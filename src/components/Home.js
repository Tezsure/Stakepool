import React from "react";
import { ThanosWallet } from "@thanos-wallet/dapp";
import { animateScroll as scroll } from "react-scroll";
import {
  Container,
  Collapse,
  Spinner,
  Row,
  Col,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  InputGroup,
  Input,
  Badge,
  Card,
  CardHeader,
  CardImg,
  CardText,
  CardBody,
  UncontrolledPopover,
  PopoverBody,
  PopoverHeader,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import stakepool from "./icons/stakepool.svg";
import bg from "./icons/background.png";
import setting from "./icons/setting.svg";
import tz from "./icons/tz.svg";
import heart from "./icons/Heart.svg";
import tezsure from "./icons/tezsure.jpg";
import youtube from "./icons/youtube.svg";
import telegram from "./icons/telegram.svg";
import linkedin from "./icons/linkedin.svg";
import twitter from "./icons/twitter.svg";
import up from "./icons/up.jpeg";
import down from "./icons/down.jpeg";
import det from "./icons/details.svg";
import axios from "axios";
import Countdown from "react-countdown-now";
import swal from "@sweetalert/with-react";

export default class setseller extends React.Component {
  //tzstatsInterval;
  coingeckoInterval;
  bcdInterval;
  constructor(props) {
    super(props);
    this.state = {
      thanosError: false,
      spindex: null,
      amount: null,
      currentprice: null,
      error: false,
      errMsg: "",
      spranges: [],
      tamt: null,
      roi: null,
      duration: null,
      currentCycle: null,
      endCycle: null,
      cycletime: null,
      option: false,
      help: false,
    };
  }

  async onDismiss() {
    this.setState((state) => {
      return { error: false };
    });
  }

  async showOption() {
    var setOption = !this.state.option;
    if (this.state.amount != null) {
      this.setState((state) => {
        return { option: setOption, help: false };
      });
    } else {
      this.setState((state) => {
        return { amount: 1, option: setOption, help: false };
      });
    }
  }
  async showHelp() {
    if (this.state.amount == null) {
      this.setState((state) => {
        return { amount: 1 };
      });
    }
    if (this.state.spindex == null) {
      var setOption = !this.state.option;
      this.setState((state) => {
        return { option: setOption, help: false };
      });
    } else {
      var setHelp = !this.state.help;
      this.setState((state) => {
        return { help: setHelp, option: false };
      });
    }
  }

  async select(id) {
    document.getElementById("mySelect").selectedIndex = id.toString();
    this.setState((state) => {
      return { spindex: id };
    });
  }

  async componentDidMount() {
    this.fetchContractData();
    this.fetchPrice();
    this.fetchCycleData();
  }

  async componentWillUnmount() {
    clearTimeout(this.coingeckoInterval);
    clearTimeout(this.bcdInterval);
  }

  async fetchPrice() {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
    );
    if (
      this.state.currentprice != response.data.market_data.current_price.usd
    ) {
      this.setState((state) => {
        return { currentprice: response.data.market_data.current_price.usd };
      });
    }
    this.coingeckoInterval = setTimeout(this.fetchPrice.bind(this), 240000);
  }

  async fetchCycleData() {
    const tzresponse = await axios.get(
      "https://api.delphi.tzstats.com/explorer/cycle/head"
    );
    /*const tzresponse = await axios.get(
      "https://api.delphi.tzstats.com/explorer/cycle/head/"
    );*/
    const ctime = new Date(tzresponse.data.end_time).valueOf();
    const stime = new Date(tzresponse.data.start_time).valueOf();
    const cycle = tzresponse.data.cycle;
    const sCycle = tzresponse.data.follower_cycle.cycle + 1;
    const dur = (sCycle - cycle - 1) * (ctime - stime);
    this.setState((state) => {
      return {
        duration: dur,
        cycletime: ctime,
        currentCycle: cycle,
        endCycle: sCycle,
      };
    });
  }

  async fetchContractData() {
    const storagedata = await axios.get(
      "https://api.better-call.dev/v1/contract/delphinet/KT1AQd6KeoPyFJdY4baRyR6zCkGZV2r35K1u/storage/rich"
    );
    const l = storagedata.data.args[0].args[1].args[0].length;
    const mapdata =
      storagedata.data.args[0].args[1].args[0][l - 1].args[1].args[0];
    const price =
      storagedata.data.args[0].args[1].args[0][l - 1].args[1].args[1].args[1]
        .int;
    const rate = parseInt(storagedata.data.args[1].args[1].args[0].int) / 100;
    const tamount = parseInt(
      storagedata.data.args[0].args[1].args[0][l - 1].args[1].args[1].args[0]
        .int
    );
    if (this.state.tamt != tamount) {
      var sp = [];
      var i, lRange, uRange;
      for (i in mapdata) {
        var sprange = [];
        lRange =
        lRange =
        Math.trunc(parseInt(price) +
            parseInt((price * mapdata[i].args[0].args[0].int) / 10000)) /
          100;
        uRange =
        Math.trunc(parseInt(price) +
            parseInt((price * mapdata[i].args[0].args[1].int) / 10000)) /
          100;
        sprange = [
          lRange.toFixed(2),
          uRange.toFixed(2),
          parseInt(mapdata[i].args[0].args[0].int),
          parseInt(mapdata[i].args[0].args[1].int),
          parseInt(mapdata[i].args[1].args[0].int),
        ];
        sp.push(sprange);
      }
      this.setState((state) => {
        return { roi: rate, tamt: tamount, spranges: sp };
      });
    }
    this.bcdInterval = setTimeout(this.fetchContractData.bind(this), 60000);
  }

  async betting() {
    try {
      const available = await ThanosWallet.isAvailable();
      var amt;
      if (!available) {
        throw new Error("Please Install ");
      }
      if (this.state.spindex == null) {
        throw new Error("Please select a suitable price range!");
      }
      if (this.state.amount == null) {
        amt = 1;
      } else {
        amt = this.state.amount;
      }
      const i = this.state.spindex;
      const param1 = this.state.spranges[i][2];
      const param2 = this.state.spranges[i][3];
      var val;
      await swal({
        title: "Staking Order Review!",
        content: (
          <Container fluid="xs" align="left">
            <ul
              style={{
                "padding-left": "1.2444444444vmax",
                color: "#748093",
              }}
            >
              <li style={{ "padding-bottom": "1vmax" }}>
                Staked Amount: {amt} XTZ
              </li>
              <li style={{ "padding-bottom": "1vmax" }}>
                Predicted Price Range:{" "}
                {this.state.spranges[i][2] == this.state.spranges[i][3]
                  ? this.state.spranges[i][2] > 0
                    ? "Above  $" + this.state.spranges[i][0].toString()
                    : "Below  $" + this.state.spranges[i][0].toString()
                  : "Between  $" +
                    this.state.spranges[i][0].toString() +
                    " - $" +
                    this.state.spranges[i][1].toString()}
              </li>
              <li style={{ "padding-bottom": "1vmax" }}>
                Expected Min ROI as per current active bets*:{" "}
                {this.state.roi}
                %.
              </li>
              <li style={{ "padding-bottom": "1vmax" }}>
                Expected Max ROI as per current active bets**:{" "}
                {this.state.tamt == this.state.spranges[this.state.spindex][4]
                  ? this.state.roi
                  : this.state.amount !== null
                  ? Math.round(
                      (10000 *
                        (100 - 2) *
                        this.state.roi *
                        (this.state.tamt + this.state.amount * 1000000)) /
                        (100 *
                          (this.state.spranges[this.state.spindex][4] +
                            this.state.amount * 1000000))
                    ) / 10000
                  : Math.round(
                      (10000 *
                        (100 - 2) *
                        this.state.roi *
                        (this.state.tamt + 1 * 1000000)) /
                        (100 *
                          (this.state.spranges[this.state.spindex][4] +
                            1 * 1000000))
                    ) / 10000}
                %.
              </li>
              <li style={{ "padding-bottom": "1vmax" }}>
                Staking period: cycles {this.state.currentCycle + 1}-
                {this.state.endCycle}
              </li>
              <li style={{ "padding-bottom": "1vmax" }}>
                Reward Return Cycle: Cycle {this.state.endCycle}
              </li>
              <li style={{ "padding-bottom": "1vmax" }}>
                Estimated Reward Return Date:
                {new Date(
                  this.state.cycletime + this.state.duration
                ).toDateString()}
              </li>
              <li style={{ "padding-bottom": "1vmax" }}>
                Platform Usage Fee: 2% of the winning returns
              </li>
            </ul>
            <p
              style={{
                color: "#5A7184",
                "font-family": "OpenSans-Regular, sans-serif",
                "padding-top": "1vmax",
                "font-size": "1.1111111111vmax",
              }}
            >
              *The mentioned ROI is only applicable if your prediction is right.Else your ROI would be 0%.
              <br/>** The maximum expected ROI is variable under the cycle and is dependent on the total number of XTZ staked on the other price ranges and the outcome of the previous cycle/s pool.
            </p>
          </Container>
        ),
        icon: "info",
        buttons: { cancel: "Cancel", confirm: "Confirm" },
      }).then((value) => {
        val = value;
      });

      if (val) {
        const wallet = new ThanosWallet("Stakepool");
        await wallet.connect("delphinet", { forcePermission: true });
        const tezos = wallet.toTezos();
        const accountPkh = await tezos.wallet.pkh();
        const accountBalance = await tezos.tz.getBalance(accountPkh);
        console.info(`address: ${accountPkh}, balance: ${accountBalance}`);
        if(amt+0.1>accountBalance/1000000){
          throw new Error("Insufficient Balance in your Account to complete this transaction!");
        }
        const sell = await tezos.wallet.at(
          "KT1AQd6KeoPyFJdY4baRyR6zCkGZV2r35K1u"
        );
        const operation = await sell.methods
          .setWager(param1.toString(), param2.toString())
          .send({ amount: amt, mutez: false });

        swal({
          closeOnClickOutside: false,
          closeOnEsc: false,
          button: false,
          content: (
            <div>
              <Spinner
                color="success"
                size="xl"
                style={{
                  "margin-top": "1.66666667vmax",
                  width: "5.55556vw",
                  height: "5.555556vw",
                }}
              />
              <br />
              <br />
              <h
                align="center"
                style={{
                  "font-size": "2.2vmax",
                  "font-family": "OpenSans-SemiBold, sans-serif",
                  color: "#5A7184",
                  "letter-spacing": "0.049vmax",
                }}
              >
                <strong>Waiting for Transaction Confirmation...</strong>
              </h>
            </div>
          ),
        });

        await operation.confirmation();
        await swal({
          title: "Stake Order Successful",
          content: (
            <Container fluid="xs" align="left">
              <p
                style={{
                  "padding-left": "1.12rem",
                  "line-height": "2.11rem",
                  color: "#748093",
                }}
              >
                The amount will be considered for staking from the following
                cycle onwards.
              </p>
              <br />
              <p
                style={{
                  "padding-left": "1.12rem",
                  "line-height": "1rem",
                  color: "#748093",
                }}
              >
                Tx Hash:
              </p>
              <p
                style={{
                  "padding-left": "1.61rem",
                  "font-size": "0.8rem",
                  "line-height": "1rem",
                  color: "#748093",
                }}
              >
                {operation.opHash.toString()}
              </p>
            </Container>
          ),
          icon: "success",
          timer: 30000,
        });
        const counterValue = await sell.storage();
        console.info(`storage: ${counterValue}`);
        window.location.reload(true);
      }
    } catch (err) {
      if (err.message == "Please Install ") {
        this.setState((state) => {
          return { errMsg: err.message, error: true, thanosError: true };
        });
      } else {
        this.setState((state) => {
          return { errMsg: err.message, error: true, thanosError: false };
        });
      }
      console.error(err);
    }
  }

  render() {

    let upranges = [];
    let lowranges = [];
    for(let i=0;i<this.state.spranges.length;i++)
    {
      if(i<4)
      {
        upranges.push(this.state.spranges[i]);
      }
      else
      {
        lowranges.push(this.state.spranges[i]);
      }
    }

    let upperItems = (
      <div>
        {upranges.map((value,index)=> {
          
          if(index <1)
          {
            return (
              <div>
                <Row xs="4">
                  {upranges.map((value, index)=> (
                    <Col style={{ "padding-bottom": "1.6666667vmax" }}>
                      <Card
                        id={"card" + index.toString()}
                        style={{
                          "background-color": "#FFFFFF",
                          "border-radius": "0.2777777778vmax",
                        }}
                      >
                        <CardImg
                          src={det}
                          style={{
                            width: "5vmax",
                            height: "4.7222222222vmax",
                            "padding-top": "1.6666666667vmax",
                            "padding-left": "1.6666666667vmax",
                          }}
                        />
                        <CardHeader
                          style={{
                            "background-color": "#FFFFFF",
                            "text-align": "left",
                            "font-family": "OpenSans-Bold, sans-serif",
                            color: "#183B56",
                            "font-size": "1.2152777778vmax",
                            "letter-spacing": "0.0138888889vmax",
                            "border-radius": "0.2083333333vmax",
                            "padding-left": "1.6666666667vmax",
                          }}
                        >
                          <strong>
                            Price Prediction
                            <br />
                            {value[2] == value[3]
                              ? value[2] > 0
                                ? "Above $" + value[0].toString()
                                : "Below $" + value[0].toString()
                              : "Between $" +
                                value[0].toString() +
                                " - $" +
                                value[1].toString()}
                          </strong>
                          <img
                            align="right"
                            src={value[2] < 0 ? down : up}
                            style={{
                              width: "1.2222222222vmax",
                              height: "2.5vmax",
                              "padding-right": "0.121vmax",
                              "padding-bottom": "0.5777777778vmax",
                            }}
                          />
                        </CardHeader>
                      </Card>
                      <UncontrolledPopover
                        placement="bottom-start"
                        hideArrow={true}
                        trigger="legacy"
                        flip={false}
                        target={"card" + index.toString()}
                        container={"card" + index.toString()}
                      >
                        <PopoverHeader
                          style={{
                            "text-align": "center",
                            "font-size": "1.2152777778vmax",
                          }}
                        >
                          The Predicted Price is
                          <br />
                          {value[2] == value[3]
                            ? value[2] > 0
                              ? "Above $" + value[0].toString()
                              : "Below $" + value[0].toString()
                            : "Between $" +
                              value[0].toString() +
                              " - $" +
                              value[1].toString()}
                        </PopoverHeader>
                        <PopoverBody>
                          <ul
                            style={{
                              "padding-left": "0.6333333333vmax",
                              color: "#748093",
                              "font-size": "0.9652778vmax",
                            }}
                          >
                            <li
                              style={{ "padding-bottom": "1vmax" }}
                              style={{ "padding-bottom": "1vmax" }}
                            >
                              The Expected ROI currently for your inputted staking amount
                              is{" "}
                              {this.state.tamt == value[4]
                                ? this.state.roi
                                : this.state.amount !== null
                                ? Math.round(
                                    (10000 *
                                      (100 - 2) *
                                      this.state.roi *
                                      (this.state.tamt +
                                        this.state.amount * 1000000)) /
                                      (100 *
                                        (value[4] +
                                          this.state.amount * 1000000))
                                  ) / 10000
                                : Math.round(
                                    (10000 *
                                      (100 - 2) *
                                      this.state.roi *
                                      (this.state.tamt + 1 * 1000000)) /
                                      (100 * (value[4] + 1 * 1000000))
                                  ) / 10000}
                              %.
                            </li>
                            <li style={{ "padding-bottom": "1vmax" }}>
                              The staking rewards is calculated for the cycles{" "}
                              {this.state.currentCycle + 1}-
                              {this.state.endCycle}.
                            </li>
                            <li style={{ "padding-bottom": "1vmax" }}>
                              A fee of 2% inclusive on your winning returns is
                              taken for the usage of the platform.
                            </li>
                            <li style={{ "padding-bottom": "1vmax" }}>
                              If, at the completion of your staking period on{" "}
                              {new Date(
                                this.state.cycletime + this.state.duration
                              ).toDateString()}
                              ,the price of XTZ is in this range, then you get
                              back your returns along with your staking
                              investment.Else you would lose your staking
                              returns and only get back your staking investment.{" "}
                            </li>
                            <li style={{ "padding-bottom": "1vmax" }}>
                              You shall get back your staked amount (plus the
                              winning rewards if applicable) at the conclusion
                              of cycle {this.state.endCycle - 1} on{" "}
                              {new Date(
                                this.state.cycletime + this.state.duration
                              ).toDateString()}
                              .
                            </li>
                          </ul>
                          <div align="center">
                            <button
                              onClick={() => {
                                this.select(index);
                              }}
                              style={{
                                "font-family": "OpenSans-Bold, sans-serif",
                                color: "#1565D8",
                                backgroundColor: "#FFFFFF",
                                "text-align": "center",
                                "font-size": "1.277778vmax",
                                border: "0.06944vmax solid #1565D8",
                                "border-radius": "0.556vmax",
                                width: "9.4444444vmax",
                                height: "2.5555555vmax",
                                padding: "0.13889vmax 0.13889vmax ",
                              }}
                            >
                              Select
                            </button>
                          </div>
                        </PopoverBody>
                      </UncontrolledPopover>
                    </Col>
                  ))}
                </Row>
              </div>
            )
          }
          else
          {
            return null;
          }
        })}
      </div>
    )


    return (
      <Container
        fluid="xs"
        style={{
          backgroundColor: "#F9FBFE",
          "background-size": "cover",
          height: "100%",
          width: "100vmax",
        }}
      >
        <Container
          fluid="xs"
          id="stake"
          style={{
            width: "100vmax",
            opacity: "1",
            "background-size": "100% 86.2%",
            backgroundImage: `url(${bg})`,
            backgroundClip: "padding-box",
            backgroundRepeat: "repeat-x",
            "box-shadow": "0px 10px 35px #00000008",
          }}
        >
          <Navbar
            color="faded"
            light
            style={{ "margin-left": "6.667vmax", "margin-right": "5.2vmax" }}
          >
            <link href="bootstrap.min.css" rel="stylesheet" />
            <NavbarBrand
              href="/"
              className="mr-auto"
              styles={{ "margin-top": "0.97222222vmax" }}
            >
              <img
                src={stakepool}
                style={{ width: "13.264vmax", height: "3.056vmax" }}
              />
            </NavbarBrand>
            <Nav>
              <NavItem>
                <NavLink
                  href="https://www.notion.so/Stakepool-A-no-loss-price-prediction-experiment-38bc2c0e0fe540aaaa1bc91ebcdcf5c4"
                  target="_blank" rel="noopener noreferrer"

                  style={{
                    "font-size": "1.1111111111vmax",
                    "font-family": "OpenSans-SemiBold, sans-serif",
                    color: "#FFFFFF",
                    "margin-top": "1.736vmax",
                  }}
                >
                  Documentation
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="https://github.com/Tezsure/Stakepool-Contracts"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    "font-size": "1.1111111111vmax",
                    "font-family": "OpenSans-SemiBold, sans-serif",
                    color: "#FFFFFF",
                    "margin-top": "1.736vmax",
                  }}
                >
                  GitHub
                </NavLink>
              </NavItem>

              <NavItem>
                <UncontrolledButtonDropdown
                  direction="bottom-start"
                  style={{ color: "#1565D8" }}
                >
                  <DropdownToggle
                    caret={false}
                    color="#1565D8"
                    style={{
                      "font-size": "1.1111111111vmax",
                      "font-family": "OpenSans-SemiBold, sans-serif",
                      color: "#FFFFFF",
                      "margin-top": "1.736vmax",
                    }}>
                    Stats
                  </DropdownToggle>

                  <DropdownMenu
                    style={{
                      backgroundColor: "#F9FBFE",
                      width: "200%",
                      "border-radius": "0.27777778vmax",
                    }}
                  >
                    <DropdownItem style={{ "line-height": "0.6667vmax" }}>
                      <NavLink
                        href="/mainnet"
                        style={{
                          "font-size": "1.1111111111vmax",
                          "font-family": "OpenSans-SemiBold, sans-serif",
                          color: "#5A7184",
                        }}
                      >
                        Mainnet
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem style={{ "line-height": "0.6667vmax" }}>
                      <NavLink
                        href="/statsdelphinet"
                        style={{
                          "font-size": "1.1111111111vmax",
                          "font-family": "OpenSans-SemiBold, sans-serif",
                          color: "#5A7184",
                        }}
                      >
                        Delphinet
                      </NavLink>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </NavItem>

              <NavItem>
                <NavLink
                  href="/FAQ"
                  style={{
                    "font-size": "1.1111111111vmax",
                    "font-family": "OpenSans-SemiBold, sans-serif",
                    color: "#FFFFFF",
                    "margin-top": "1.736vmax",
                  }}
                >
                  FAQ
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  style={{
                    "font-size": "1.1111111111vmax",
                    "font-family": "OpenSans-SemiBold, sans-serif",
                    color: "#FFFFFF",
                    "margin-top": "0.764vmax",
                  }}
                >
                  <button
                    onClick={() => {
                      scroll.scrollToBottom();
                    }}
                    style={{
                      color: "#FFFFFF",
                      backgroundColor: "#1565D8",
                      "text-align": "center",
                      "font-size": "1.1111111111vmax",
                      border: "0.13889vmax solid #FFFFFF",
                      "border-radius": "0.556vmax",
                      width: "10.764vmax",
                      padding: "0.762vmax 0vmax 0.556vmax 0vmax",
                    }}
                  >
                    Get In Touch
                  </button>
                </NavLink>
              </NavItem>
              <NavItem>
                <UncontrolledButtonDropdown
                  direction="bottom-start"
                  style={{ color: "#1565D8" }}
                >
                  <DropdownToggle
                    caret={false}
                    color="#1565D8"
                    style={{ "margin-top": "0.764vmax" }}
                  >
                    <img
                      src={setting}
                      style={{
                        width: "4vmax",
                        height: "3.33333333vmax",
                        "padding-right": "0.24444444vmax",
                      }}
                    />
                  </DropdownToggle>
                  <DropdownMenu
                    style={{
                      backgroundColor: "#F9FBFE",
                      width: "200%",
                      "border-radius": "0.27777778vmax",
                    }}
                  >
                    <DropdownItem header>Stakepool</DropdownItem>
                    <DropdownItem style={{ "line-height": "0.6667vmax" }}>
                      <NavLink
                        href="/mainnet"
                        style={{
                          "font-size": "1.1111111111vmax",
                          "font-family": "OpenSans-SemiBold, sans-serif",
                          color: "#5A7184",
                        }}
                      >
                        Mainnet
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem style={{ "line-height": "0.6667vmax" }}>
                      <NavLink
                        href="/mainnet"
                        style={{
                          "font-size": "1.1111111111vmax",
                          "font-family": "OpenSans-SemiBold, sans-serif",
                          color: "#5A7184",
                        }}
                      >
                        Delphinet
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem style={{ "line-height": "0.6667vmax" }}>
                      <NavLink
                        href="/account"
                        style={{
                          "font-size": "1.1111111111vmax",
                          "font-family": "OpenSans-SemiBold, sans-serif",
                          color: "#5A7184",
                        }}
                      >
                        Staking Orders
                      </NavLink>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </NavItem>
            </Nav>
          </Navbar>
          <p
            align="center"
            style={{
              "font-size": "3.888888889vmax",
              "font-family": "OpenSans-Bold, sans-serif",
              "padding-top": "5vmax",
              "padding-bottom": "1.66666667vmax",
              "padding-left": "0.902777778vmax",
              color: "#FFFFFF",
              "letter-spacing": "0.049vmax",
              "line-height": "5.056vmax",
            }}
          >
            <strong>
              Earn a little extra on your
              <br />
              staking rewards
            </strong>
          </p>
          <Card
            inverse={true}
            style={{
              "margin-left": "16.805555556vmax",
              "margin-right": "16.52777778vmax",
              "box-shadow": "0px 0.6944444vmax 2.430555556vmax #00000008",
            }}
          >
            <Collapse isOpen={this.state.error}>
              <CardBody
                style={{
                  "text-align": "center",
                  backgroundColor: "#f8f9fa",
                  color: "black",
                  border: "0.06944vmax solid red",
                  "border-radius": "0.833333vmax",
                  "box-shadow": "0vmax 0vmax 0.902778vmax 0.06944vmax #ef9696",
                }}
              >
                <button
                  onClick={() => {
                    this.setState({ error: false });
                  }}
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    padding: "0vmax 0.556vmax",
                    border: "0.06944vmax solid red",
                    "border-radius": "1.3888888889vmax",
                    background: "#bd2130",
                    color: "white",
                  }}
                >
                  X
                </button>
                {this.state.thanosError ? (
                  <CardText>
                    Error: {this.state.errMsg}
                    <a href="https://thanoswallet.com/download">
                      Thanos Wallet Browser Plugin
                    </a>{" "}
                    To Utilize The Services Of Stakepool
                  </CardText>
                ) : (
                  <CardText>Error: {this.state.errMsg}</CardText>
                )}
              </CardBody>
            </Collapse>
            <CardBody
              style={{
                "padding-top": this.state.error ? "2.292vmax" : "4.583vmax",
                "padding-bottom": "4.583vmax",
              }}
            >
              <Row
                xs="2"
                style={{
                  "margin-left": "2.5vmax",
                  "margin-right": "2.5vmax",
                }}
              >
                <Col xs="6">
                  <label
                    style={{
                      color: "#5A7184",
                      "font-family": "OpenSans-SemiBold,sans-serif",
                      "font-size": "1.277778vmax",
                    }}
                  >
                    Current Cycle {this.state.currentCycle} will be concluded
                    in:
                  </label>
                </Col>
                <Col xs="6">
                  <label
                    style={{
                      color: "#5A7184",
                      "font-family": "OpenSans-SemiBold, sans-serif",
                      "font-size": "1.277778vmax",
                    }}
                  >
                    Current price of XTZ/USD:
                  </label>
                </Col>
                <Col xs="6">
                  <Badge
                    color="light"
                    style={{
                      width: "100%",
                      height: "3.8888889vmax",
                      "line-height": "3.8888889vmax",
                      "text-align": "left",
                      "padding-left": "1.8888889vmax",
                      color: "#959EAD",
                      "font-family": "OpenSans-SemiBold, sans-serif",
                      "font-size": "1.277778vmax",
                    }}
                  >
                    <Countdown
                      date={this.state.cycletime}
                      key={this.state.cycletime}
                      onComplete={() => {
                        this.fetchCycleData();
                      }}
                    />
                  </Badge>
                </Col>
                <Col xs="6">
                  <Badge
                    color="light"
                    style={{
                      width: "100%",
                      height: "3.8888889vmax",
                      "line-height": "3.8888889vmax",
                      "text-align": "left",
                      "padding-left": "1.8888889vmax",
                      color: "#183B56",
                      "font-family": "OpenSans-SemiBold, sans-serif",
                      "font-size": "1.277778vmax",
                    }}
                  >
                    ${this.state.currentprice}
                  </Badge>
                </Col>

                <Col xs="6" style={{ "padding-top": "4vmax" }}>
                  <label
                    style={{
                      color: "#5A7184",
                      "font-family": "OpenSans-SemiBold, sans-serif",
                      "font-size": "1.277778vmax",
                    }}
                  >
                    I want to stake:
                  </label>
                </Col>
                <Col xs="6" style={{ "padding-top": "4vmax" }}>
                  <label
                    style={{
                      color: "#5A7184",
                      "font-family": "OpenSans-SemiBold, sans-serif",
                      "font-size": "1.277778vmax",
                    }}
                  >
                    I predict the price of XTZ to be:
                  </label>
                </Col>
                <Col xs="6">
                  <InputGroup>
                    <Input
                      type="number"
                      className="inputStyle"
                      placeholder="1.000000"
                      min="1"
                      step="0.000001"
                      value={this.state.amount}
                      onChange={(eve) => {
                        if (Math.abs(parseFloat(eve.target.value)) >= 1) {
                          this.setState({
                            amount:
                              Math.round(
                                Math.abs(parseFloat(eve.target.value)) * 1000000
                              ) / 1000000,
                          });
                        } else if (eve.target.value == "") {
                          this.setState({ amount: null });
                        } else {
                          var num = 1;
                          this.setState({ amount: num.toFixed(6) });
                        }
                      }}
                      style={{
                        height: "3.8888889vmax",
                        width: "13.3333333333vmax",
                        border: "0.06944vmax solid #C3CAD9",
                        "border-radius": "0.556vmax",
                        background: "#FFFFFF 0% 0% no-repeat padding-box",
                        color: "#959EAD",
                        "font-family": "OpenSans-SemiBold, sans-serif",
                        "font-size": "1.277778vmax",
                        "text-align": "left",
                        "padding-left": "1.6888889vmax",
                      }}
                    />
                    <Badge
                      color="#FFFFFF"
                      style={{
                        height: "3.888888889vmax",
                        "line-height": "4.4444444vmax",
                        "text-align": "left",
                        "padding-left": "0.556vmax",
                        "padding-right": "0.556vmax",
                        color: "#959EAD",
                        "font-family": "OpenSans-SemiBold, sans-serif",
                        "font-size": "1.1111111111vmax",
                      }}
                    >
                      <img
                        src={tz}
                        style={{
                          height: "3.33333333vmax",
                          "padding-right": "0.64444444vmax",
                        }}
                      />

                    </Badge>
                  </InputGroup>
                </Col>
                <Col xs="6">
                  <Input
                    id="mySelect"
                    type="select"
                    name="select"
                    value={this.state.spindex}
                    onChange={(eve) => {
                      this.setState({ spindex: eve.target.value });
                    }}
                    style={{
                      "text-align": "left",
                      width: "100%",
                      height: "3.8888889vmax",
                      border: "0.06944vmax solid #C3CAD9",
                      "border-radius": "0.556vmax",
                      background: "#FFFFFF 0% 0% no-repeat padding-box",
                      color: "#959EAD",
                      "font-family": "OpenSans-SemiBold, sans-serif",
                      "font-size": "1.277778vmax",
                      "padding-left": "1.6888889vmax",
                    }}
                  >
                    <option
                      value={null}
                      disabled
                      selected
                      style={{
                        color:
                          this.state.spindex == null ? "#183B56" : "#959EAD",
                      }}
                    >
                      Select predicted price range in USD{" "}
                    </option>
                    {this.state.spranges.map((inv, index) => (
                      <option
                        value={index}
                        style={{
                          color:
                            index == this.state.spindex ? "#183B56" : "#959EAD",
                        }}
                      >
                        {inv[2] == inv[3]
                          ? inv[2] > 0
                            ? "Above $" + inv[0].toString()
                            : "Below $" + inv[0].toString()
                          : "In the range of $" +
                            inv[0].toString() +
                            " - $" +
                            inv[1].toString()}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>

              <p
                style={{
                  color: "#5A7184",
                  "margin-left": "4vmax",
                  "margin-right": "5.3vmax",
                  "font-family": "OpenSans-Regular, sans-serif",
                  "padding-top": "1.69vmax",
                  "font-size": "1.1111111111vmax",
                }}
              >
              </p>
              <br />
              <Row
                xs="2"
                style={{
                  "margin-left": "4.144444vmax",
                  "margin-right": "4.144444vmax",
                }}
              >
                <Col
                  xs="6"
                  style={{ "text-align": "right", "padding-right": "1.3vmax" }}
                >
                  <button
                    onClick={() => {
                      this.showHelp();
                    }}
                    style={{
                      "font-family": "OpenSans-Bold, sans-serif",
                      color: "#1565D8",
                      backgroundColor: "#FFFFFF",
                      "text-align": "center",
                      "font-size": "1.277778vmax",
                      border: "0.06944vmax solid #1565D8",
                      "border-radius": "0.556vmax",
                      width: "14.7222222vmax",
                      height: "3.333333vmax",
                    }}
                  >
                    <strong>Staking Option</strong>
                  </button>
                </Col>
                <Col
                  xs="6"
                  style={{ "text-align": "left", "padding-left": "1.3vmax" }}
                >
                  <button
                    onClick={() => {
                      this.betting();
                    }}
                    style={{
                      "font-family": "OpenSans-Bold, sans-serif",
                      color: "#FFFFFF",
                      backgroundColor: "#1565D8",
                      "text-align": "center",
                      "font-size": "1.277778vmax",
                      border: "0.06944vmax solid #1565D8",
                      "border-radius": "0.556vmax",
                      width: "14.7222222vmax",
                      height: "3.333333vmax",
                    }}
                  >
                    <strong>Stake</strong>
                  </button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>

        <Container
          fluid="xs"
          style={{
            backgroundColor: "#F9FBFE",
            width: "100vmax",
            "padding-left": "9.0888888889vmax",
            "padding-right": "7.6vmax",
            "padding-top": "5vmax",
            "padding-bottom":
              this.state.help || this.state.option ? "3.3333333vmax" : "5vmax",
          }}
        >
          <Row xs="2">
            <Col xs="6">
              <label
                align="left"
                style={{
                  "font-family": "OpenSans-Bold, sans-serif",
                  color: "#183B56",
                  display: "block",
                  "font-size": "3.3333333333vmax",
                  "letter-spacing": "0.0138888889vmax",
                }}
              >
                <strong>Staking Options</strong>
              </label>
            </Col>
            <Col
              xs="6"
              style={{
                "text-align": "right",
                "padding-top": "2.9044444444vmax",
                "padding-right": "3.59vmax",
              }}
            >
              <button
                id="stakeOption"
                onClick={() => {
                  this.showOption();
                }}
                style={{
                  color: "#36B37E",
                  "font-family": "OpenSans-Bold, sans-serif",
                  backgroundColor: "#FFFFFF",
                  "text-align": "center",
                  "font-size": "1.1111111111vmax",
                  border: "0.13889vmax solid #36B37E",
                  "border-radius": "0.2777777778vmax",
                  width: "9.6527777778vmax",
                  height: "3.0555555556vmax",
                  "letter-spacing": "0.0138888889vmax",
                }}
              >
                <strong> {this.state.option ? "SHOW LESS" : "SHOW MORE"}</strong>
              </button>
            </Col>
          </Row>
          <p
            style={{
              color: "#5A7184",
              "font-family": "OpenSans-Regular, sans-serif",
              "font-size": "1.18055556vmax",
              "padding-bottom": "3.3333333vmax",
            }}
          >
            You can search for more details by clicking on the respective
            category below.
          </p>
          
            {upperItems}
          
          <Collapse isOpen={this.state.option || this.state.help}>
            {this.state.option || this.state.help ? (
              this.state.option ? (
                <Row xs="4">
                  {lowranges.map((value, index) => (
                    <Col style={{ "padding-bottom": "1.6666667vmax" }}>
                      <Card
                        id={"card" + index.toString()}
                        style={{
                          "background-color": "#FFFFFF",
                          "border-radius": "0.2777777778vmax",
                        }}
                      >
                        <CardImg
                          src={det}
                          style={{
                            width: "5vmax",
                            height: "4.7222222222vmax",
                            "padding-top": "1.6666666667vmax",
                            "padding-left": "1.6666666667vmax",
                          }}
                        />
                        <CardHeader
                          style={{
                            "background-color": "#FFFFFF",
                            "text-align": "left",
                            "font-family": "OpenSans-Bold, sans-serif",
                            color: "#183B56",
                            "font-size": "1.2152777778vmax",
                            "letter-spacing": "0.0138888889vmax",
                            "border-radius": "0.2083333333vmax",
                            "padding-left": "1.6666666667vmax",
                          }}
                        >
                          <strong>
                            Price Prediction
                            <br />
                            {value[2] == value[3]
                              ? value[2] > 0
                                ? "Above $" + value[0].toString()
                                : "Below $" + value[0].toString()
                              : "Between $" +
                                value[0].toString() +
                                " - $" +
                                value[1].toString()}
                          </strong>
                          <img
                            align="right"
                            src={value[2] < 0 ? down : up}
                            style={{
                              width: "1.2222222222vmax",
                              height: "2.5vmax",
                              "padding-right": "0.121vmax",
                              "padding-bottom": "0.5777777778vmax",
                            }}
                          />
                        </CardHeader>
                      </Card>
                      <UncontrolledPopover
                        placement="bottom-start"
                        hideArrow={true}
                        trigger="legacy"
                        flip={false}
                        target={"card" + index.toString()}
                        container={"card" + index.toString()}
                      >
                        <PopoverHeader
                          style={{
                            "text-align": "center",
                            "font-size": "1.2152777778vmax",
                          }}
                        >
                          The Predicted Price is
                          <br />
                          {value[2] == value[3]
                            ? value[2] > 0
                              ? "Above $" + value[0].toString()
                              : "Below $" + value[0].toString()
                            : "Between $" +
                              value[0].toString() +
                              " - $" +
                              value[1].toString()}
                        </PopoverHeader>
                        <PopoverBody>
                          <ul
                            style={{
                              "padding-left": "0.6333333333vmax",
                              color: "#748093",
                              "font-size": "0.9652778vmax",
                            }}
                          >
                            <li
                              style={{ "padding-bottom": "1vmax" }}
                              style={{ "padding-bottom": "1vmax" }}
                            >
                              The Expected ROI currently for your inputted staking amount
                              is{" "}
                              {this.state.tamt == value[4]
                                ? this.state.roi
                                : this.state.amount !== null
                                ? Math.round(
                                    (10000 *
                                      (100 - 2) *
                                      this.state.roi *
                                      (this.state.tamt +
                                        this.state.amount * 1000000)) /
                                      (100 *
                                        (value[4] +
                                          this.state.amount * 1000000))
                                  ) / 10000
                                : Math.round(
                                    (10000 *
                                      (100 - 2) *
                                      this.state.roi *
                                      (this.state.tamt + 1 * 1000000)) /
                                      (100 * (value[4] + 1 * 1000000))
                                  ) / 10000}
                              %.
                            </li>
                            <li style={{ "padding-bottom": "1vmax" }}>
                              The staking rewards is calculated for the cycles{" "}
                              {this.state.currentCycle + 1}-
                              {this.state.endCycle}.
                            </li>
                            <li style={{ "padding-bottom": "1vmax" }}>
                              A fee of 2% inclusive on your winning returns is
                              taken for the usage of the platform.
                            </li>
                            <li style={{ "padding-bottom": "1vmax" }}>
                              If, at the completion of your staking period on{" "}
                              {new Date(
                                this.state.cycletime + this.state.duration
                              ).toDateString()}
                              ,the price of XTZ is in this range, then you get
                              back your returns along with your staking
                              investment.Else you would lose your staking
                              returns and only get back your staking investment.{" "}
                            </li>
                            <li style={{ "padding-bottom": "1vmax" }}>
                              You shall get back your staked amount (plus the
                              winning rewards if applicable) at the conclusion
                              of cycle {this.state.endCycle - 1} on{" "}
                              {new Date(
                                this.state.cycletime + this.state.duration
                              ).toDateString()}
                              .
                            </li>
                          </ul>
                          <div align="center">
                            <button
                              onClick={() => {
                                this.select(index);
                              }}
                              style={{
                                "font-family": "OpenSans-Bold, sans-serif",
                                color: "#1565D8",
                                backgroundColor: "#FFFFFF",
                                "text-align": "center",
                                "font-size": "1.277778vmax",
                                border: "0.06944vmax solid #1565D8",
                                "border-radius": "0.556vmax",
                                width: "9.4444444vmax",
                                height: "2.5555555vmax",
                                padding: "0.13889vmax 0.13889vmax ",
                              }}
                            >
                              Select
                            </button>
                          </div>
                        </PopoverBody>
                      </UncontrolledPopover>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Card
                  style={{
                    "margin-left": "21.7777777778vmax",
                    "margin-right": "21.5vmax",
                    "margin-bottom": "1.6666667vmax",
                    "border-radius": "0.2777777778vmax",
                  }}
                >
                  <CardHeader
                    style={{
                      "text-align": "left",
                      "font-family": "OpenSans-Bold, sans-serif",
                      color: "#183B56",
                      "font-size": "1.3444444444vmax",
                      "letter-spacing": "0.0138888889vmax",
                      "background-color": "#f7f7f7",
                    }}
                  >
                    <CardImg
                      align="left"
                      src={det}
                      style={{
                        width: "5vmax",
                        height: "4.4444444444vmax",
                        "padding-bottom": "1.6666666667vmax",
                        "padding-left": "0.5555555556vmax",
                        "padding-right": "1.6666666667vmax",
                        width: "5.677vmax",
                        height: "4.677vmax",
                      }}
                    />
                    <br />
                    <strong>
                      Price Prediction{" "}
                      {this.state.spranges[this.state.spindex][2] ==
                      this.state.spranges[this.state.spindex][3]
                        ? this.state.spranges[this.state.spindex][2] > 0
                          ? "Above  $" +
                            this.state.spranges[
                              this.state.spindex
                            ][0].toString()
                          : "Below  $" +
                            this.state.spranges[
                              this.state.spindex
                            ][0].toString()
                        : "Between  $" +
                          this.state.spranges[
                            this.state.spindex
                          ][0].toString() +
                          " - $" +
                          this.state.spranges[this.state.spindex][1].toString()}
                    </strong>
                    <CardImg
                      src={
                        this.state.spranges[this.state.spindex][2] < 0
                          ? down
                          : up
                      }
                      style={{
                        width: "1.2222222222vmax",
                        height: "2.5vmax",
                        "margin-left": "1.366666667vmax",
                        "padding-bottom": "0.5777777778vmax",
                      }}
                    />
                  </CardHeader>
                  <CardBody>
                    <CardText>
                      <ul
                        style={{
                          "padding-left": "0.6333333333vmax",
                          color: "#748093",
                          "font-size": "1.118056vmax",
                        }}
                      >
                        <li style={{ "padding-bottom": "1vmax" }}>
                          The Expected ROI currently for your inputted staking amount is{" "}
                          {this.state.tamt ==
                          this.state.spranges[this.state.spindex][4]
                            ? this.state.roi
                            : this.state.amount !== null
                            ? Math.round(
                                (10000 *
                                  (100 - 2) *
                                  this.state.roi *
                                  (this.state.tamt +
                                    this.state.amount * 1000000)) /
                                  (100 *
                                    (this.state.spranges[
                                      this.state.spindex
                                    ][4] +
                                      this.state.amount * 1000000))
                              ) / 10000
                            : Math.round(
                                (10000 *
                                  (100 - 2) *
                                  this.state.roi *
                                  (this.state.tamt + 1 * 1000000)) /
                                  (100 *
                                    (this.state.spranges[
                                      this.state.spindex
                                    ][4] +
                                      1 * 1000000))
                              ) / 10000}
                          %.
                        </li>
                        <li style={{ "padding-bottom": "1vmax" }}>
                          The staking rewards is calculated for the cycles{" "}
                          {this.state.currentCycle + 1}-{this.state.endCycle}.
                        </li>
                        <li style={{ "padding-bottom": "1vmax" }}>
                          A fee of 2% inclusive on your winning returns is taken
                          for the usage of the platform.
                        </li>
                        <li style={{ "padding-bottom": "1vmax" }}>
                          If, at the completion of your staking period on{" "}
                          {new Date(
                            this.state.cycletime + this.state.duration
                          ).toDateString()}
                          , the price of XTZ is in this range, then you get back
                          your returns along with your staking investment.Else
                          you would lose your staking returns and only get back
                          your staking investment.{" "}
                        </li>
                        <li style={{ "padding-bottom": "1vmax" }}>
                          You shall get back your staked amount (plus the
                          winning rewards if applicable) at the conclusion of
                          cycle {this.state.endCycle - 1} on{" "}
                          {new Date(
                            this.state.cycletime + this.state.duration
                          ).toDateString()}
                          .
                        </li>
                      </ul>
                    </CardText>
                  </CardBody>
                </Card>
              )
            ) : null}
          </Collapse>
        </Container>
        <Container
          fluid="xs"
          style={{
            backgroundColor: "#2C7DF7",
            "padding-left": "9.0888888889vmax",
            "padding-right": "7.6vmax",
            width: "100vmax",
          }}
        >
          <Row
            xs="2"
            style={{ "padding-top": "5vmax", "padding-bottom": "5vmax" }}
          >
            <Col>
              <label
                style={{
                  color: "#FFFFFF",
                  "letter-spacing": "0.0138888889vmax",
                  "font-family": "OpenSans-Bold, sans-serif",
                  "font-size": "3.888888889vmax",
                }}
              >
                Try Stakepool now for smart prediction
              </label>
            </Col>
            <Col
              style={{
                "text-align": "right",
                "padding-top": "4.2677777778vmax",
              }}
            >
              <NavLink>
                <button
                  onClick={() => {
                    scroll.scrollToTop();
                  }}
                  style={{
                    color: "#1565D8",
                    backgroundColor: "#F2F5F8",
                    "font-family": "OpenSans-Bold, sans-serif",
                    "text-align": "center",
                    "font-size": "2.4305555556vmax",
                    border: "0.06944vmax solid #1565D8",
                    "border-radius": "0.5555556vmax",
                    width: "24.5138888888889vmax",
                    height: "5.55555556vmax",
                    "line-height": "5.55555556vmax",
                  }}
                >
                  Stake
                </button>
              </NavLink>
            </Col>
          </Row>
        </Container>
        <Container
          fluid="xs"
          id="contact"
          align="center"
          style={{
            backgroundColor: "#F9FBFE",
            height: "100%",
            width: "100vmax",
            "padding-top": "3.333333vmax",
            "padding-bottom": "3.333333vmax",
          }}
        >
          <img src={heart} style={{ width: "8.8vmax", height: "8.8vmax" }} />
          <p
            style={{
              color: "#5A7184",
              "font-family": "OpenSans-SemiBold, sans-serif",
              "font-size": "1.34027778vmax",
            }}
          >
            <strong>Copyright © 2021. Crafted with love.</strong>
          </p>
          <a
          href="https://tezsure.com"
          target="_blank" rel="noopener noreferrer"
          >
          <img
            src={tezsure}
            style={{
              width: "1.2vmax",
              height: "1.2vmax",
              "margin-left": "1.3888888889vmax",
            }}
          />
          </a>
          <a
          href="https://twitter.com/tezsure"
          target="_blank" rel="noopener noreferrer"
          >
          <img
            src={twitter}
            style={{
              width: "1.25vmax",
              height: "1.25vmax",
              "margin-left": "1.3888888889vmax",
            }}
          />
          </a>
          <a
          href="https://www.linkedin.com/company/tezsure/"
          target="_blank" rel="noopener noreferrer"
          >
          <img
            src={linkedin}
            style={{
              width: "1.25vmax",
              height: "1.25vmax",
              "margin-left": "1.3888888889vmax",
            }}
          />
          </a>
          <a
          href="https://www.youtube.com/channel/UCZg7LT1bFWeFiKwGBLcLfLQ"
          target="_blank" rel="noopener noreferrer"
          >
          <img
            src={youtube}
            style={{
              width: "1.25vmax",
              height: "1.25vmax",
              "margin-left": "1.3888888889vmax",
            }}
          />
          </a>
          <a
          href="https://web.telegram.org/#/im?p=@Indiatezos"
          target="_blank" rel="noopener noreferrer"
          >
          <img
            src={telegram}
            style={{
              width: "1.25vmax",
              height: "1.25vmax",
              "margin-left": "1.3888888889vmax",
            }}
          />
          </a>
        </Container>
      </Container>
    );
  }
}
