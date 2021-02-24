import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import { ThanosWallet } from "@thanos-wallet/dapp";
import {Collapse,Spinner,Row,Col,UncontrolledCollapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,InputGroup, InputGroupAddon, InputGroupText, Input,Badge,UncontrolledTooltip,Card,CardHeader, CardText,CardBody,Modal, ModalBody} from 'reactstrap';
import tz from './tez.png';
import axios from 'axios'
import Countdown from 'react-countdown-now';


export default class setseller extends React.Component {
  //tzstatsInterval;
  coingeckoInterval;
  bcdInterval;
  constructor(props){
    super(props)
    this.state = { spindex:null, amount:null,currentprice:null,collapsed:true,spranges:[],tamountInRange:null,roi:null,duration:null,currentCycle:null,endCycle:null,cycletime:null,option:false,help:false,confirm:false}
  };

  async showNav(){
    var setCollapsed=!this.state.collapsed;
    this.setState((state) =>{return {collapsed: setCollapsed}});
  }
  async showOption(){
    var setOption=!this.state.option;
    if(this.state.amount!=null){
    this.setState((state) =>{return {option: setOption,help:false}});
  }else{
    this.setState((state) =>{return {amount:1,option: setOption,help:false}});
  }
  }
  async showHelp(){
    if(this.state.amount==null){
      this.setState((state) =>{return {amount:1}});
    }
    if(this.state.spindex==null){
      var setOption=!this.state.option;
      this.setState((state) =>{return {option: setOption,help:false}});
    }
    else{
      var setHelp=!this.state.help;
      this.setState((state) =>{return {help: setHelp,option:false}});
  }
  }

  async select(id){
    document.getElementById("mySelect").selectedIndex = id.toString();
    this.setState((state) =>{return {spindex:id}});

  }

  async componentDidMount(){
    this.fetchContractData();
    this.fetchPrice();
    this.fetchCycleData();
  }

  async componentWillUnmount(){
    clearTimeout(this.coingeckoInterval);
    clearTimeout(this.bcdInterval);
  }

  async fetchPrice(){
    const response=await axios.get('https://api.coingecko.com/api/v3/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false');
    if(this.state.currentprice!=response.data.market_data.current_price.usd){
      this.setState((state) =>{return {currentprice: response.data.market_data.current_price.usd}});
    }
    this.coingeckoInterval=setTimeout(this.fetchPrice.bind(this),240000);
  }

    async fetchCycleData(){
      //const tzresponse=await axios.get('https://cors-anywhere.herokuapp.com/https://api.carthagenet.tzstats.com/explorer/cycle/head');
      const tzresponse=await axios.get('https://api.carthagenet.tzstats.com/explorer/cycle/head/');
      const ctime=new Date(tzresponse.data.end_time).valueOf();
      const stime=new Date(tzresponse.data.start_time).valueOf();
      const cycle=tzresponse.data.cycle;
      const sCycle=tzresponse.data.follower_cycle.cycle+1;
      const dur=(sCycle-cycle)*(ctime-stime);
      this.setState((state) =>{return {duration:dur,cycletime:ctime,currentCycle:cycle,endCycle:sCycle}});
    }

  async fetchContractData(){
    const storagedata=await axios.get('https://api.better-call.dev/v1/contract/carthagenet/KT18of9Q7f2UKfPteTTDYHGN9uUZes4Em6ha/storage/rich');
    const l=storagedata.data.args[0].args[1].args[1].length;
    const mapdata=storagedata.data.args[0].args[1].args[1][l-1].args[1].args[0];
    const price=storagedata.data.args[0].args[1].args[1][l-1].args[1].args[1].args[1].int;
    const rate=parseInt(storagedata.data.args[1].args[1].args[0].int)/100;
    const tamount=parseInt(storagedata.data.args[0].args[1].args[1][l-1].args[1].args[1].args[0].int);
    if(this.state.tamountInRange!=tamount){
      var sp=[];
      var i,lRange,uRange;
      for (i in mapdata) {
        var sprange=[];
        lRange=(parseInt(price)+ parseInt(price*mapdata[i].args[0].args[0].int/10000))/100;
        uRange=(parseInt(price)+parseInt(price*mapdata[i].args[0].args[1].int/10000))/100;
        sprange=[lRange,uRange,parseInt(mapdata[i].args[0].args[0].int),parseInt(mapdata[i].args[0].args[1].int),parseInt(mapdata[i].args[1].args[0].int)];
        sp.push(sprange);
      }
      this.setState((state) =>{return {roi:rate,tamountInRange:tamount,spranges:sp}});
    }
    this.bcdInterval=setTimeout(this.fetchContractData.bind(this),60000);
  }


  async betting() {
    try {
      const available = await ThanosWallet.isAvailable();
      var amountInRange;
      if (!available) {
        throw new Error("Thanos Wallet not installed");
      }
      if (this.state.spindex==null) {
        throw new Error("Please select a suitable price range");
      }
      if (this.state.amount==null) {
        amountInRange=0.000001;
      }
      else{
        amountInRange=this.state.amount;
      }

      const i=this.state.spindex;
      const param1=this.state.spranges[i][2];
      const param2=this.state.spranges[i][3];
      const wallet = new ThanosWallet("Stakepool");
      await wallet.connect("carthagenet", { forcePermission: true });
      const tezos = wallet.toTezos();
      const accountPkh = await tezos.wallet.pkh();
      const accountBalance = await tezos.tz.getBalance(accountPkh);
      console.info(`address: ${accountPkh}, balance: ${accountBalance}`);
      const sell = await tezos.wallet.at("KT18of9Q7f2UKfPteTTDYHGN9uUZes4Em6ha");
      const operation = await sell.methods.placeBet(param1.toString(),param2.toString()).send({ amount: amountInRange });
      this.setState((state) =>{return {confirm:true}});
      await operation.confirmation();
      this.setState((state) =>{return {confirm:false}});
      alert("Your transaction has been successful and will be considered for staking from the following cycle onwards");

      const counterValue = await sell.storage();
      console.info(`storage: ${counterValue}`);
      window.location.reload(false);
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  }


  render() {
    return(
      <div style={{backgroundColor: '#FFFFFF',height : '100vh'}}>
      <div style={{backgroundColor: '#39cb90'}}>
      <div style={{backgroundColor: '#6b747b'}}>
      <div style={{backgroundColor: '#39cb90'}}>
        <Navbar color="faded" light>
        <link href="bootstrap.min.css" rel="stylesheet"/>
          <NavbarBrand href="/" className="mr-auto">&emsp;<img src={tz} width="180" height="60"/> </NavbarBrand>
          <NavbarToggler onClick={()=>{this.showNav()}} className="mr-2"/>
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink href="/components/" style={{"font-size": "1.25em"}}>&emsp;Documentation</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap" style={{"font-size": "1.25em"}}>&emsp;GitHub</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <h1 align="center" style={{"font-size": "5em","color":"#EBF4FA","font-family": "Quicksand-Bold"}}><strong><em>KamAO</em></strong></h1>
      </div>
      <p align="center" style={{"color":"#FFFFFF","font-family": "Quicksand","padding":"0em 0em 0em 32em"}}><strong><em>~Earn extra on your staking rewards</em></strong></p>
      </div>
      <div style={{backgroundColor: '#39cb90'}}>
      <div align="left" style={{ "margin-left": "7.0625em","margin-right": "5.75em"}}>
      <br/>
      <Row xs="2">
      <Col style={{"text-align":"left"}}>
      <label style={{"font-size": "1.125em"}}><strong>The Current Cycle {this.state.currentCycle} will be concluded in:</strong> </label>
      </Col>
      <Col style={{"text-align":"right"}}>
      <label style={{"font-size": "1.125em"}}><strong>Current price of XTZ/USD:</strong> </label>
      </Col>
      <Col style={{"text-align":"left","font-size": "1.375em","font-family": "ui-rounded","padding-left":"12.5%"}}>
      <Countdown date={this.state.cycletime} key={this.state.cycletime}  onComplete={()=>{this.fetchCycleData()}}/>
      </Col>
      <Col style={{"text-align":"right","font-size": "1.375em","font-family": "ui-rounded","padding-right":"7.15%"}}>
      <output style={{"font-size": "1em"}}><em>${this.state.currentprice}</em></output>
      </Col>
      </Row>
      </div>
      </div>
      </div>
      <div>
      <br/><br/><br/><br/>
      </div>
      <label style={{"font-size": "1.5em","color":"#0b281c"}}>&nbsp;&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;I want to stake: </label>
      <label style={{"font-size": "1.5em","color":"#0b281c"}}>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;I predict the price of XTZ to be: </label>
      <br/>
      <InputGroup>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;<input type="number" className="inputStyle" placeholder="1.000000" min="0" step="0.000001" value={this.state.amount} onChange={ (eve) => { if(Number(eve.target.value)!=0){this.setState({ amount: Math.round(Number(eve.target.value)*1000000)/1000000})}}} style={{"width":"3.9cm","text-align":"center","border-radius": "0.25em"}} />
        <InputGroupAddon addonType="append">
          <InputGroupText style={{"color":"dodgerblue"}}>XTZ</InputGroupText>
        </InputGroupAddon>
        &emsp;&nbsp;<button id="stakeOption" onClick={()=>{this.showOption()}} style={{"color":"#e5e5f2",'backgroundColor': '#000080',"font-size": "1.25em","border-radius": "0.5em"}}>Staking Options</button>
        &emsp;&nbsp;
        <InputGroupAddon addonType="prepend">
        <Badge id="tool" onClick={()=>{this.showHelp()}} color="secondary" style={{"height":"0.32cm","align-text":"center","font-size": "0.75em"}}>i</Badge>
        </InputGroupAddon>
        <UncontrolledTooltip placement="right-start" container="tool" hideArrow={true} target="tool" style={{"display":"block","border-radius": "0.5em","width":"800cm"}}>Select a predicted price range of XTZ on the completion of your staking period.<br/>Click on me to know more.</UncontrolledTooltip>
        <Input id="mySelect" type="select" name="select" value={this.state.spindex} onChange={(eve)=>{this.setState({spindex: eve.target.value })}} style={{"text-align":"center","width":"3.9cm"}}>
        <option value={null} disabled selected>Select predicted price range in USD </option>
        {this.state.spranges.map((inv,index) =>(<option value={index}>{inv[2]==inv[3]?inv[2]>0?"Above $"+inv[0].toString():"Below $"+inv[0].toString(): "In the range of $"+inv[0].toString()+" - $"+inv[1].toString()}</option>))}
        </Input>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
      </InputGroup>
      <Collapse isOpen={this.state.help}>
      <br/><br/>
      <div>
      {(this.state.spindex!=null)?
      <div align="center" style={{"margin-right": "27.5em","margin-left": "30em"}}>
      <Card>
      <CardHeader style={{"color":"#ebf9f3",'backgroundColor': '#000080',"font-size": "1.25em","border-radius": "0.5em"}}>Predicted  Price  Range  {this.state.spranges[this.state.spindex][2]==this.state.spranges[this.state.spindex][3]?this.state.spranges[this.state.spindex][2]>0?"Above  $"+this.state.spranges[this.state.spindex][0].toString():"Below  $"+this.state.spranges[this.state.spindex][0].toString(): "Between  $"+this.state.spranges[this.state.spindex][0].toString()+" - $"+this.state.spranges[this.state.spindex][1].toString()}</CardHeader>
      <div align="left" style={{"color":"#e5e5f2",'backgroundColor': '#19198c',"border-radius": "0.25em"}}>
      <CardBody>
      <br/>
      <CardText>
      <ul>
      <li>The Current ROI for your inputted staking amount is {this.state.tamountInRange==this.state.spranges[this.state.spindex][4]?this.state.roi:Math.round(10000*this.state.amount*1000000*100*((this.state.roi*(this.state.tamountInRange+this.state.amount*1000000)/100)-(0.02*this.state.roi*(this.state.tamountInRange+this.state.amount*1000000)/100))/((this.state.spranges[this.state.spindex][4]+this.state.amount*1000000)*this.state.amount*1000000))/10000}%.</li>
      <br/>
      <li>A fee of 2% inclusive on your winning returns is taken for the usage of the platform.</li>
      <br/>
      <li>If at the completion of your staking period on {new Date(this.state.cycletime+this.state.duration).toDateString()}, the price of Xtz is in this range, then you get back your returns along with your staking betAmountment.Else you would lose your staking returns and only get back your staking betAmountment. </li>
      <br/>
      <li>You shall get back your staked amount (plus the winning rewards if applicable) at the conclusion of cycle {this.state.endCycle+1} on {new Date(this.state.cycletime+this.state.duration).toDateString()}.</li>
      <br/>
      <li>The staking rewards is calculated for the cycles {this.state.currentCycle+1}-{this.state.endCycle}.</li>
      </ul>
      </CardText>
      </CardBody>
      </div>
      </Card>
      </div>
      :<br/>
    }
    </div>
      </Collapse>

      <Collapse isOpen={this.state.option}>
      <br/>
      <div style={{backgroundColor: '#e5e5f2'}}>
      <div align="center" style={{"margin-right": "5.5em","margin-left": "5.5em"}}>
      <br/>
      <Row xs="3">
      {this.state.spranges.map((value, index) =>(
        <Col>
        <Card>
        <CardHeader id={"card"+index.toString()} style={{"color":"#ebf9f3",'backgroundColor': '#000080',"font-size": "1.25em","border-radius": "0.5em"}}>Predicted  Price  {value[2]==value[3]?value[2]>0?"Above  $"+value[0].toString():"Below  $"+value[0].toString(): "Between  $"+value[0].toString()+" - $"+value[1].toString()}</CardHeader>
        <UncontrolledCollapse toggler={"card"+index.toString()}>
        <div align="left" style={{"color":"#e5e5f2",'backgroundColor': '#19198c',"border-radius": "0.25em"}}>
        <CardBody>
        <br/>
        <CardText>
        <ul>
        <li>The Current ROI for your inputted staking amount is {this.state.tamountInRange==value[4]?this.state.roi:Math.round(10000*this.state.amount*1000000*100*((this.state.roi*(this.state.tamountInRange+this.state.amount*1000000)/100)-(0.02*this.state.roi*(this.state.tamountInRange+this.state.amount*1000000)/100))/((value[4]+this.state.amount*1000000)*this.state.amount*1000000))/10000}%.</li>
        <br/>
        <li>A fee of 2% inclusive on your winning returns is taken for the usage of the platform.</li>
        <br/>
        <li>If at the completion of your staking period on {new Date(this.state.cycletime+this.state.duration).toDateString()},the price of Xtz is in this range, then you get back your returns along with your staking betAmountment.Else you would lose your staking returns and only get back your staking betAmountment. </li>
        <br/>
        <li>You shall get back your staked amount (plus the winning rewards if applicable) at the conclusion of cycle {this.state.endCycle+1} on {new Date(this.state.cycletime+this.state.duration).toDateString()}.</li>
        <br/>
        <li>The staking rewards is calculated for the cycles {this.state.currentCycle+1}-{this.state.endCycle}.</li>
        </ul>
        <div align="center">
        <button onClick={()=>{this.select(index)}} style={{"color":"#e5e5f2",'backgroundColor': '#000080',"font-size": "1.25em","border-radius": "0.5em","width":"4.3cm"}}>Select</button>
        </div>
        </CardText>
        </CardBody>
        </div>
        </UncontrolledCollapse>
        </Card>
        <br/>
        </Col>
      ))}
      </Row>
      </div>
      </div>
      </Collapse>
      <div align="center" style={{backgroundColor: '#FFFFFF'}}>
      <br/><br/>
      &emsp;&emsp;&emsp;&nbsp;
      <button onClick={()=>{this.betting()}} style={{"color":"#e5e5f2",'backgroundColor': '#000080',"font-size": "1.75em","border-radius": "0.5em","width":"4.3cm"}}><em>Stake</em></button>
      <br/><br/><br/><br/>
      <Modal isOpen={this.state.confirm} size="md" centered>
        <ModalBody style={{"font-size": "1.75em","text-align":"center",backgroundColor: '#FFFFFF'}}>
        <Spinner color="success" size="xl" style={{ width: '3rem', height: '3rem' }}/><br/>
          &nbsp;&nbsp;Waiting for Transaction Confirmation...
        </ModalBody>
        </Modal>
      </div>
      </div>
    )
  }
}
