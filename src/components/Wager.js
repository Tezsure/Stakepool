import React from 'react';
import { ThanosWallet } from "@thanos-wallet/dapp";
import axios from 'axios'

export default class setbuyer extends React.Component {
  constructor(props){
    super(props)
    this.state = { sprice: null, amount: null,currentprice:null}
  };

  async componentDidMount(){
    const response=await axios.get('https://api.coingecko.com/api/v3/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false');
    this.setState((state) =>{return {currentprice: response.data.market_data.current_price.usd}});

  }

  async buying() {
    try {
        const available = await ThanosWallet.isAvailable();
        if (!available) {
          throw new Error("Thanos Wallet not installed");
        }

        const wallet = new ThanosWallet("Staking Market");
        const connect = await wallet.connect("carthagenet", { forcePermission: true });
        const tezos = wallet.toTezos();

        const accountPkh = await tezos.wallet.pkh();
        const accountBalance = await tezos.tz.getBalance(accountPkh);
        console.info(`address: ${accountPkh}, balance: ${accountBalance}`);
        const strikeprice=this.state.sprice*100
        const amountInRange=this.state.amount

        const buy = await tezos.wallet.at("KT1FTfe28g6sgEsQ75MA8J6WHRdV9w5oit1b");
        const operation = await buy.methods.setBuyer(strikeprice).send({ amount: amountInRange });
        const transtat = await operation.confirmation();
        const getCircularReplacer = () => {
          const seen = new WeakSet();
          return (key, value) => {
            if (typeof value === "object" && value !== null) {
              if (seen.has(value)) {
                return;
              }
              seen.add(value);
            }
            return value;
          };
        };
        var myString = JSON.stringify(operation, getCircularReplacer());
        alert("Transaction successful");

        const counterValue = await buy.storage();
        console.info(`Storage: ${operation}`);
      } catch (err) {
        alert(err);
        console.error(err);
      }
  }

  render() {
    return(
      <div className="mainContainer">
        <h1>&emsp;Set a wager for XTZ/USD price</h1>
        <div align="right">
        <label style={{"font-size": "18px"}}><strong>Current price of XTZ/USD:</strong> </label>
        <output style={{"font-size": "18px"}}>${this.state.currentprice}</output>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
        </div>

        <label>&emsp;&emsp;&emsp;Enter the price you estimate XTZ/USD will fall below during the staking period: </label>
        <input type="number" className="inputStyle" placeholder="1.00" step="0.01" value={this.state.sprice} onChange={ (eve) => { this.setState({ sprice: Number(eve.target.value) }) } }/>
        <br/><br/>
        <label>&emsp;&emsp;&emsp;Enter the amount of XTZ you are willing to betAmount for this wager condition: </label>
        <input type="number" className="inputStyle" placeholder="1.000000" step="0.000001" value={this.state.amount} onChange={ (eve) => { this.setState({ amount: Number(eve.target.value) })} } />
        <br/><br/>
        <br/><br/>
        <div align="center">
        <button onClick={()=>{this.buying()}} style={{"font-size": "18px","border-radius": "4px"}}>Set Wager Order</button>
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
        </div>
        <br/><br/>
      </div>
    )
  }
}
