import React from "react";
import { ThanosWallet } from "@thanos-wallet/dapp";
import {
  Container,
  Collapse,
  Row,
  Col,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Badge,
  Card,
  Table,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import classnames from "classnames";
import stakepool from "./icons/stakepool.png";
import bg from "./icons/background.png";
import setting from "./icons/setting.png";
import heart from "./icons/Heart.png";
import tezsure from "./icons/tezsure.png";
import youtube from "./icons/youtube.png";
import instagram from "./icons/instagram.png";
import google from "./icons/google.png";
import telegram from "./icons/telegram.png";
import linkedin from "./icons/linkedin.png";
import twitter from "./icons/twitter.png";
import axios from "axios";
import swal from "@sweetalert/with-react";
import { JSONPath } from "@astronautlabs/jsonpath";
import { animateScroll as scroll } from "react-scroll";

export default class setseller extends React.Component {
  tzInterval;
  constructor(props) {
    super(props);
    this.state = {
      currentCycle: null,
      winning: [],
      tamt: null,
      pool:null,
      announce: true,
      Rannounce:true
    };
  }

  async componentDidMount() {
    this.stakingStats();
  }

  async componentWillUnmount() {
    clearTimeout(this.tzInterval);
  }

  async stakingStats() {
      /*const storagedata = await axios.get(
        "https://api.delphi.tzstats.com/explorer/contract/KT1AkmEKWNKSqK48FTrAF9xUXZ1UdZEPcryk/storage"
      );*/
      const storagedata = await axios.get(
        "https://cors-anywhere.herokuapp.com/https://api.delphi.tzstats.com/explorer/contract/KT1AkmEKWNKSqK48FTrAF9xUXZ1UdZEPcryk/storage"
      );
      console.log(storagedata);
      var cycle = Math.trunc(storagedata.data.meta.height / 2048);
      if(storagedata.data.value.withdrawcycle!="1"){
        if(Number(storagedata.data.value.withdrawcycle)>6){
          cycle=cycle-6;
          var withdrawcycle=Number(storagedata.data.value.withdrawcycle);
          var wprice=Number(storagedata.data.value.cycleDet[withdrawcycle.toString()].cPrice)/100;
          withdrawcycle=withdrawcycle-6;
          for(var key of Object.keys(storagedata.data.value.cycleDet[withdrawcycle.toString()].betDet)){
            var lrange =
              ((100 - Number(key.slice(0, key.indexOf("#"))) / 100) *
                Number(storagedata.data.value.cycleDet[withdrawcycle.toString()].cPrice)) /
              10000;
            var urange =
              ((100 - Number(key.slice(key.indexOf("#") + 1)) / 100) *
                Number(storagedata.data.value.cycleDet[withdrawcycle.toString()].cPrice)) /
              10000;
            if((lrange==urange)&&(key[0]=="-")&&(wprice<lrange)){
              var reward=Number(storagedata.data.value.cycleDet[withdrawcycle.toString()].betDet[key].winnings)/1000000;
              var cAmt=Number(storagedata.data.value.cycleDet[withdrawcycle.toString()].betDet[key].amt)/1000000;
              break;
            }
            if((lrange==urange)&&(key[0]!="-")&&(wprice>=urange)){
              var reward=Number(storagedata.data.value.cycleDet[withdrawcycle.toString()].betDet[key].winnings)/1000000;
              var cAmt=Number(storagedata.data.value.cycleDet[withdrawcycle.toString()].betDet[key].amt)/1000000;
              break;
            }
            if((lrange!=urange)&&(wprice>=lrange)&&(wprice<urange)){
              var reward=Number(storagedata.data.value.cycleDet[withdrawcycle.toString()].betDet[key].winnings)/1000000;
              var cAmt=Number(storagedata.data.value.cycleDet[withdrawcycle.toString()].betDet[key].amt)/1000000;
              break;
            }
          }
          this.setState((state) => {
            return {
              currentCycle: cycle,
              announce: true,
              Rannounce:true,
              Tamt:Number(storagedata.data.value.cycleDet[withdrawcycle.toString()].cAmount)/1000000,
              pool:Number(storagedata.data.value.interestPool)/1000000,
              winning:[lrange,urange,wprice,reward,cAmt]
            };
          });

        }else{
          cycle=cycle+1-Number(storagedata.data.value.withdrawcycle)
          this.setState((state) => {
            return {
              currentCycle: cycle,
              announce: true,
              Rannounce:false,
              Tamt:Number(storagedata.data.value.cycleDet[withdrawcycle.toString()].cAmount)/1000000
            };
          });
        }
      }else{
        this.setState((state) => {
          return {
            currentCycle: cycle,
            announce: false,
          };
        });
      }
      this.tzInterval = setTimeout(this.stakingStats.bind(this), (storagedata.data.meta.height % 2048)*30000);
  }

  render() {
    return (
      <Container
        fluid="xs"
        style={{
          backgroundColor: "#F9FBFE",
          "background-size": "cover",
          height: "100%",
          width: "100vmax",
          "min-height": "100vh",
        }}
      >
        <Container
          fluid="xs"
          id="stake"
          style={{
            width: "100v",
            opacity: "1",
            "background-size": "100% 43vmax",
            backgroundImage: `url(${bg})`,
            backgroundClip: "padding-box",
            backgroundRepeat: "repeat-x",
            "box-shadow": "0px 10px 35px #00000008",
            "padding-bottom": "10vmax",
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
                href="https://gitlab.com/tezsure/staking-market-george/-/tree/StakePool"
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
                    disabled
                      href="/statsmainnet"
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
                    disabled
                      href="/"
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
                      href="/"
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
              Previous Staking Period
              <br />
              Cycle {this.state.currentCycle} Stats
            </strong>
          </p>
          <Card
            inverse={true}
            style={{
              "margin-left": "9.0888888889vmax",
              "margin-right": "7.6vmax",
              "box-shadow": "0px 0.6944444vmax 2.430555556vmax #00000008",
              "min-height": "22vmax",
            }}
          >

            <Row>

            <Col
                style={{
                    "text-align": "right",
                    "padding-right": "9.5vmax",
                    "padding-top": this.state.show ? "1.666666667vmax" : "4vmax",
                    "padding-bottom": this.state.show ? "1.66667vmax" : "4vmax",
                }}
                >
                    <button
                    disabled  
                    style={{
                      color: "white",
                        backgroundColor: "#4868c2",
                        "font-family": "OpenSans-Bold, sans-serif",
                        "text-align": "center",
                        "font-size": "1.805555556vmax",
                        border: "0.06944vmax solid black",
                        "border-radius": "0.5555556vmax",
                        width: "24.5138888888889vmax",
                        height: "7.05555556vmax",
                        "line-height": "2.55555556vmax",

                    }}
                    >
                      Winning Price{" "}<br/>
                      {this.state.announce?this.state.Rannounce?"$"+this.state.winning[2]:"TBA":"TBA"}
                    </button>

                </Col>
                
                <Col
                style={{
                    "text-align": "left",
                    "padding-left": "9.5vmax",
                    "padding-top": this.state.show ? "1.666666667vmax" : "4vmax",
                    "padding-bottom": this.state.show ? "1.66667vmax" : "4vmax",
                }}
                >
                    <button
                    disabled
                    style={{
                        color: "white",
                        backgroundColor: "#4868c2",
                        "font-family": "OpenSans-Bold, sans-serif",
                        "text-align": "center",
                        "font-size": "1.805555556vmax",
                        border: "0.06944vmax solid black",
                        "border-radius": "0.5555556vmax",
                        width: "24.5138888888889vmax",
                        height: "7.05555556vmax",
                        "line-height": "2.55555556vmax",
                    }}
                    >
                      Total Bet Amount<br/>
                      {this.state.announce?this.state.tamt?this.state.tamt.toString()+"XTZ":"0 XTZ":"TBA"}
                    </button>

                </Col>

            </Row>

            <Row>
                <Col
                style={{
                    "text-align": "left",
                    "padding-left": "9.5vmax",
                    "padding-top": this.state.show ? "1.666666667vmax" : "4vmax",
                    "padding-bottom": this.state.show ? "1.66667vmax" : "4vmax",
                }}
                >
                    <button
                    disabled
                    style={{
                      color: "white",
                        backgroundColor: "#4868c2",
                        "font-family": "OpenSans-Bold, sans-serif",
                        "text-align": "center",
                        "font-size": "1.805555556vmax",
                        border: "0.06944vmax solid black",
                        "border-radius": "0.5555556vmax",
                        width: "24.5138888888889vmax",
                        height: "7.05555556vmax",
                        "line-height": "2.55555556vmax",

                    }}
                    >
                    Winners Aggregate ROI{" "}<br/>
                    {this.state.announce?this.state.Rannounce?this.state.winning[4]?this.state.winning[3]*100/this.state.winning[4]+"%":"0%":"TBA":"TBA"}
                    </button>

                </Col>

                <Col
                style={{
                    "text-align": "right",
                    "padding-right": "9.5vmax",
                    "padding-top": this.state.show ? "1.666666667vmax" : "4vmax",
                    "padding-bottom": this.state.show ? "1.66667vmax" : "4vmax",
                }}
                >
                    <button
                    disabled
                    style={{
                      color: "white",
                        backgroundColor: "#4868c2",
                        "font-family": "OpenSans-Bold, sans-serif",
                        "text-align": "center",
                        "font-size": "1.805555556vmax",
                        border: "0.06944vmax solid black",
                        "border-radius": "0.5555556vmax",
                        width: "24.5138888888889vmax",
                        height: "7.05555556vmax",
                        "line-height": "2.55555556vmax",

                    }}
                    >
                    Total Pool Rewards Won{" "}<br/>
                    {this.state.announce?this.state.Rannounce?this.state.winning[3]?this.state.winning[3]+"XTZ":"0 XTZ":"TBA":"TBA"}
                    </button>

                </Col>
            </Row>

            <Row>
                <Col
                style={{
                    "text-align": "left",
                    "padding-left": "9.5vmax",
                    "padding-top": this.state.show ? "1.666666667vmax" : "4vmax",
                    "padding-bottom": this.state.show ? "1.66667vmax" : "4vmax",
                }}
                >
                    <button
                    disabled
                    style={{
                      color: "white",
                        backgroundColor: "#4868c2",
                        "font-family": "OpenSans-Bold, sans-serif",
                        "text-align": "center",
                        "font-size": "1.805555556vmax",
                        border: "0.06944vmax solid black",
                        "border-radius": "0.5555556vmax",
                        width: "24.5138888888889vmax",
                        height: "9.05555556vmax",
                        "line-height": "2.55555556vmax",
                    }}
                    >
                    Total Amount in Winning Range{" "}<br/>
                    {this.state.announce?this.state.Rannounce?this.state.winning[4]?this.state.winning[4]+"XTZ":"0 XTZ":"TBA":"TBA"}
                    </button>

                </Col>

                <Col
                style={{
                    "text-align": "right",
                    "padding-right": "9.5vmax",
                    "padding-top": this.state.show ? "1.666666667vmax" : "4vmax",
                    "padding-bottom": this.state.show ? "1.66667vmax" : "4vmax",
                }}
                >
                    <button
                    disabled
                    style={{
                      color: "white",
                        backgroundColor: "#4868c2",
                        "font-family": "OpenSans-Bold, sans-serif",
                        "text-align": "center",
                        "font-size": "1.805555556vmax",
                        border: "0.06944vmax solid black",
                        "border-radius": "0.5555556vmax",
                        width: "24.5138888888889vmax",
                        height: "9.05555556vmax",
                        "line-height": "2.55555556vmax",
                    }}
                    >
                    Carry Forwarded Amount from Previous Pool{" "} <br/>
                    {this.state.announce?this.state.Rannounce?this.state.pool?this.state.pool+"XTZ":"0 XTZ":"TBA":"TBA"}
                    </button>

                </Col>
            </Row>
          </Card>
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
              <NavLink href="/">
                <button
                  style={{
                    color: "#1565D8",
                    backgroundColor: "#F2F5F8",
                    "font-family": "OpenSans-Bold, sans-serif",
                    "text-align": "center",
                    "font-size": "2.0305555556vmax",
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
            <strong>Copyright © 2020. Crafted with love.</strong>
          </p>
          <img
            src={google}
            style={{
              width: "1.125em",
              height: "1.125em",
              "margin-left": "1.25em",
            }}
          />
          <img
            src={youtube}
            style={{
              width: "1.25vmax",
              height: "1.25vmax",
              "margin-left": "1.3888888889vmax",
            }}
          />
          <img
            src={telegram}
            style={{
              width: "1.25vmax",
              height: "1.25vmax",
              "margin-left": "1.3888888889vmax",
            }}
          />
          <img
            src={tezsure}
            style={{
              width: "1.25vmax",
              height: "1.25vmax",
              "margin-left": "1.3888888889vmax",
            }}
          />
          <img
            src={twitter}
            style={{
              width: "1.25vmax",
              height: "1.25vmax",
              "margin-left": "1.3888888889vmax",
            }}
          />
          <img
            src={linkedin} 
            style={{
              width: "1.25vmax",
              height: "1.25vmax",
              "margin-left": "1.3888888889vmax",
            }}
          />
          <img
            src={instagram}
            style={{
              width: "1.25vmax",
              height: "1.25vmax",
              "margin-left": "1.3888888889vmax",
            }}
          />
        </Container>
      </Container>
    );
  }
}