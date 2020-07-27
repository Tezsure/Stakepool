import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import { ThanosWallet } from "@thanos-wallet/dapp";
import {Collapse,Spinner,Row,Col,UncontrolledCollapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,InputGroup, InputGroupAddon, InputGroupText, Input,Badge,UncontrolledTooltip,Card,CardHeader, CardText, CardDeck,CardBody,Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import tz from './tez.png';
import axios from 'axios'
import Countdown from 'react-countdown-now';


export default class setseller extends React.Component {
  constructor(props){
    super(props)
    this.state = { spindex:null, amount:null,currentprice:null,collapsed:true,spranges:[],tamt:null,roi:null,duration:null,cycletime:null,option:false,help:false,confirm:false}
  };

  async showNav(){
    var setCollapsed=!this.state.collapsed
    this.setState((state) =>{return {collapsed: setCollapsed}});
  }
  async showOption(){
    var setOption=!this.state.option
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
      var setOption=!this.state.option
      this.setState((state) =>{return {option: setOption,help:false}});
    }
    else{
      var setHelp=!this.state.help
      this.setState((state) =>{return {help: setHelp,option:false}});
  }
  }

  async select(id){
    document.getElementById("mySelect").selectedIndex = id.toString();
    this.setState((state) =>{return {spindex:id}});

  }

  async componentWillMount(){
    const storagedata=await axios.get('https://you.better-call.dev/v1/contract/carthagenet/KT1UXjx2A4YrNH1tkEjDmikRD46gjJ6fc52V/rich_storage');
    const l=storagedata.data.args[0].args[1].args[0].length;
    const mapdata=storagedata.data.args[0].args[1].args[0][l-1].args[1].args[0].args[0];
    const price=storagedata.data.args[0].args[1].args[0][l-1].args[1].args[1].args[0].int;
    const ctime=parseInt(storagedata.data.args[0].args[1].args[0][l-1].args[1].args[1].args[1].int)*1000
    const rate=parseInt(storagedata.data.args[1].args[1].args[0].int)/100
    const tamount=parseInt(storagedata.data.args[0].args[1].args[0][l-1].args[1].args[0].args[1].int)
    const dur=parseInt(storagedata.data.args[0].args[1].args[1].int)
    var sp=[];
    var i,lRange,uRange,odds;
    for (i in mapdata) {
      var sprange=[];
      lRange=(parseInt(price)+ parseInt(price*mapdata[i].args[0].args[0].int/10000))/100;
      uRange=(parseInt(price)+parseInt(price*mapdata[i].args[0].args[1].int/10000))/100;
      sprange=[lRange,uRange,parseInt(mapdata[i].args[0].args[0].int),parseInt(mapdata[i].args[0].args[1].int),parseInt(mapdata[i].args[1].args[0].int)];
      sp.push(sprange);
    }
    const response=await axios.get('https://api.coingecko.com/api/v3/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false');
    this.setState((state) =>{return {duration:dur,roi:rate,tamt:tamount,spranges:sp,currentprice: response.data.market_data.current_price.usd,cycletime:ctime}});
    //document.getElementById("orders").style.display = "none";
  }


  async betting() {
    try {
      const available = await ThanosWallet.isAvailable();
      var amt;
      if (!available) {
        throw new Error("Thanos Wallet not installed");
      }
      if (this.state.spindex==null) {
        throw new Error("Please select a suitable price range");
      }
      if (this.state.amount==null) {
        amt=0.000001;
      }
      else{
        amt=this.state.amount
      }

      const i=this.state.spindex;
      const param1=this.state.spranges[i][2]
      const param2=this.state.spranges[i][3]
      const wallet = new ThanosWallet("My Super DApp");
      await wallet.connect("carthagenet", { forcePermission: true });
      const tezos = wallet.toTezos();
      const accountPkh = await tezos.wallet.pkh();
      const accountBalance = await tezos.tz.getBalance(accountPkh);
      console.info(`address: ${accountPkh}, balance: ${accountBalance}`);
      const sell = await tezos.wallet.at("KT1UXjx2A4YrNH1tkEjDmikRD46gjJ6fc52V");
      const operation = await sell.methods.setWager(param1.toString(),param2.toString()).send({ amount: amt });
      this.setState((state) =>{return {confirm:true}});
      await operation.confirmation();
      this.setState((state) =>{return {confirm:false}});
      alert("Your transaction has been successful and will be considered for staking from the following cycle onwards");

      const counterValue = await sell.storage();
      console.info(`storage: ${counterValue}`);
    } catch (err) {
      alert(err.message);
      console.error(err)
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
                <NavLink href="/components/" style={{"font-size": "20px"}}>&emsp;Documentation</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap" style={{"font-size": "20px"}}>&emsp;GitHub</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <h1 align="center" style={{"font-size": "80px","color":"#EBF4FA","font-family": "Quicksand-Bold"}}><strong><em>Stakepool</em></strong></h1>
      </div>
      <p align="right" style={{"color":"#FFFFFF","font-family": "Quicksand"}}><strong><em>~Earn a little extra on your staking rewards &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</em></strong></p>
      </div>
      <div align="right" style={{ "margin-right": "92px"}}>
      <br/>
      <label style={{"font-size": "18px"}}><strong>The Current Wager cycle will be concluded in:</strong> </label>
      &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;
      <label style={{"font-size": "18px"}}><strong>Current price of XTZ/USD:</strong> </label>
      <br/>
      <div align="right" style={{"font-size": "22px","font-family": "ui-rounded"}}>
      <Countdown date={this.state.cycletime}/>
      &nbsp;&nbsp;&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
      <output style={{"font-size": "22px"}}><em>${this.state.currentprice}</em></output>
      &emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;
      </div>
      </div>
      </div>
      <div>
      <br/><br/><br/><br/>
      </div>
      <label style={{"font-size": "24px","color":"#0b281c"}}>&nbsp;&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;I want to stake: </label>
      <label style={{"font-size": "24px","color":"#0b281c"}}>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;I predict the price of XTZ to be: </label>
      <br/>
      <InputGroup>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;<input type="number" className="inputStyle" placeholder="0.000001" min="0.000001" step="0.000001" value={this.state.amount} onChange={ (eve) => { if(Number(eve.target.value)!=0){this.setState({ amount: Math.round(Number(eve.target.value)*1000000)/1000000})}}} style={{"width":"3.9cm","text-align":"center","border-radius": "4px"}} />
        <InputGroupAddon addonType="append">
          <InputGroupText style={{"color":"dodgerblue"}}>XTZ</InputGroupText>
        </InputGroupAddon>
        &emsp;&nbsp;<button id="stakeOption" onClick={()=>{this.showOption()}} style={{"color":"#e5e5f2",'backgroundColor': '#000080',"font-size": "20px","border-radius": "8px"}}>Staking Options</button>
        &emsp;&nbsp;
        <InputGroupAddon addonType="prepend">
        <Badge id="tool" onClick={()=>{this.showHelp()}} color="secondary" style={{"height":"0.32cm","align-text":"center","font-size": "12px"}}>i</Badge>
        </InputGroupAddon>
        <UncontrolledTooltip placement="right-start" container="tool" hideArrow={true} target="tool" style={{"border-radius": "8px","width":"50cm"}}>Please select a price range that you predict the value of XTZ to be in after the completion of your staking period on {new Date(this.state.cycletime+(8*1000*this.state.duration)).toDateString()} </UncontrolledTooltip>
        <Input id="mySelect" type="select" name="select" value={this.state.spindex} onChange={(eve)=>{this.setState({spindex: eve.target.value })}} style={{"text-align":"center","width":"3.9cm"}}>
        <option value={null} disabled selected>Select predicted price range in USD </option>
        {this.state.spranges.map((inv,index) =>(<option value={index}>{inv[2]==inv[3]?inv[2]>0?"Above $"+inv[0].toString():"Below $"+inv[0].toString(): "In the range of $"+inv[0].toString()+" - $"+inv[1].toString()}</option>))}
        </Input>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
      </InputGroup>
      <br/><br/>
      <Collapse isOpen={this.state.help}>
      <div style={{backgroundColor: '#FFFFFF'}}>
      {(this.state.spindex!=null)?
      <div align="center" style={{backgroundColor: '#FFFFFF',"margin-right": "440px","margin-left": "480px"}}>
      <Card>
      <CardHeader style={{"color":"#ebf9f3",'backgroundColor': '#000080',"font-size": "20px","border-radius": "8px"}}>{this.state.spranges[this.state.spindex][2]==this.state.spranges[this.state.spindex][3]?this.state.spranges[this.state.spindex][2]>0?"Above $"+this.state.spranges[this.state.spindex][0].toString():"Below $"+this.state.spranges[this.state.spindex][0].toString(): "Between $"+this.state.spranges[this.state.spindex][0].toString()+" - $"+this.state.spranges[this.state.spindex][1].toString()}</CardHeader>
      <div align="left" style={{"color":"#e5e5f2",'backgroundColor': '#19198c',"border-radius": "4px"}}>
      <CardBody>
      <br/>
      <CardText>
      <ul>
      <li>The Current ROI is {this.state.tamt==this.state.spranges[this.state.spindex][4]?this.state.roi:(this.state.amount*1000000*100*((this.state.roi*(this.state.tamt+this.state.amount*1000000)/100)-(0.02*this.state.roi*(this.state.tamt+this.state.amount*1000000)/100))/((this.state.spranges[this.state.spindex][4]+this.state.amount*1000000)*this.state.amount*1000000))}%.</li>
      <br/>
      <li>A fee of 2% inclusive on your winning returns is taken for the usage of the platform.</li>
      <br/>
      <li>If at the end of your staking period on {new Date(this.state.cycletime+(8*1000*this.state.duration)).toDateString()}, the price of Xtz is in this range, then you get back your returns along with your staking investment.Else you would lose your staking returns and only get back your staking investment. </li>
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
      <div style={{backgroundColor: '#e5e5f2'}}>
      <div align="center" style={{"margin-right": "88px","margin-left": "88px"}}>
      <br/>
      <Row xs="3">
      {this.state.spranges.map((value, index) =>(
        <Col>
        <Card>
        <CardHeader id={"card"+index.toString()} style={{"color":"#ebf9f3",'backgroundColor': '#000080',"font-size": "20px","border-radius": "8px"}}>{value[2]==value[3]?value[2]>0?"Above $"+value[0].toString():"Below $"+value[0].toString(): "Between $"+value[0].toString()+" - $"+value[1].toString()}</CardHeader>
        <UncontrolledCollapse toggler={"card"+index.toString()}>
        <div align="left" style={{"color":"#e5e5f2",'backgroundColor': '#19198c',"border-radius": "4px"}}>
        <CardBody>
        <br/>
        <CardText>
        <ul>
        <li>The Current ROI is {this.state.tamt==value[4]?this.state.roi:(this.state.amount*1000000*100*((this.state.roi*(this.state.tamt+this.state.amount*1000000)/100)-(0.02*this.state.roi*(this.state.tamt+this.state.amount*1000000)/100))/((value[4]+this.state.amount*1000000)*this.state.amount*1000000))}%.</li>
        <br/>
        <li>A fee of 2% inclusive on your winning returns is taken for the usage of the platform.</li>
        <br/>
        <li>If at the end of your staking period on {new Date(this.state.cycletime+(8*1000*this.state.duration)).toDateString()},the price of Xtz is in this range, then you get back your returns along with your staking investment.Else you would lose your staking returns and only get back your staking investment. </li>
        </ul>
        <div align="center">
        <button onClick={()=>{this.select(index)}} style={{"color":"#e5e5f2",'backgroundColor': '#000080',"font-size": "20px","border-radius": "8px","width":"4.3cm"}}>Select</button>
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
      <button onClick={()=>{this.betting()}} style={{"color":"#e5e5f2",'backgroundColor': '#000080',"font-size": "28px","border-radius": "8px","width":"4.3cm"}}><em>Stake</em></button>
      <br/><br/><br/><br/>
      <Modal isOpen={this.state.confirm} size="md" centered>
        <ModalBody style={{"font-size": "28px","text-align":"center",backgroundColor: '#FFFFFF'}}>
        <Spinner color="success" size="xl" style={{ width: '3rem', height: '3rem' }}/><br/>
          &nbsp;&nbsp;Waiting for Transaction Confirmation...
        </ModalBody>
        </Modal>
      </div>
      </div>
    )
  }
}
