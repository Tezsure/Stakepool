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
import stakepool from "./icons/stakepool.svg";
import bg from "./icons/background.png";
import setting from "./icons/setting.svg";
import heart from "./icons/Heart.svg";
import tezsure from "./icons/tezsure.png";
import youtube from "./icons/youtube.svg";
import telegram from "./icons/telegram.svg";
import linkedin from "./icons/linkedin.svg";
import twitter from "./icons/twitter.svg";
import axios from "axios";
import swal from "@sweetalert/with-react";
import { JSONPath } from "@astronautlabs/jsonpath";
import { animateScroll as scroll } from "react-scroll";

export default class setseller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "delphinet",
      result: [],
      account: "",
      Cycle: null,
      show: false,
    };
  }

  async onDismiss() {
    this.setState((state) => {
      return { error: false };
    });
  }


  async setTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState((state) => {
        return { activeTab: tab, show: false };
      });
    }
  }

  async stakingDet() {
    try {
      const available = await ThanosWallet.isAvailable();
      var amt;
      if (!available) {
        throw new Error("Please Install ");
      }
      const wallet = new ThanosWallet("Stakepool");
      await wallet.connect("delphinet", { forcePermission: true });
      const tezos = wallet.toTezos();
      const accountPkh = await tezos.wallet.pkh();
      /*const storagedata = await axios.get(
        "https://api.delphi.tzstats.com/explorer/contract/KT1AQd6KeoPyFJdY4baRyR6zCkGZV2r35K1u/storage"
      );*/
      const storagedata = await axios.get(
        "https://api.delphi.tzstats.com/explorer/contract/KT1AQd6KeoPyFJdY4baRyR6zCkGZV2r35K1u/storage"
      );
      var cycle = Math.trunc(storagedata.data.meta.height / 2048);
      var find = JSONPath.nodes(storagedata, "$..bettor");
      find = find.filter((find) => find.value === accountPkh);
      var x;
      var entries = [];
      for (x of find) {
        var entry = [];
        var roi;
        var lrange =
          ((100 + Number(x.path[6].slice(0, x.path[6].indexOf("#"))) / 100) *
            Number(storagedata.data.value.cycleDet[x.path[4]].cPrice)) /
          10000;
        var urange =
          ((100 + Number(x.path[6].slice(x.path[6].indexOf("#") + 1)) / 100) *
            Number(storagedata.data.value.cycleDet[x.path[4]].cPrice)) /
          10000;
        var wPrice;
        var winning =
          (parseFloat(
            storagedata.data.value.cycleDet[x.path[4]].betDet[x.path[6]].det[
              x.path[8]
            ].invest
          ) *
            parseFloat(
              storagedata.data.value.cycleDet[x.path[4]].betDet[x.path[6]]
                .winnings
            )) /
          parseFloat(
            storagedata.data.value.cycleDet[x.path[4]].betDet[x.path[6]].amt
          );
        var ending = Number(x.path[4]) + 5 + 1;
        if (ending <= Number(storagedata.data.value.withdrawcycle)) {
          wPrice = (
            Number(storagedata.data.value.cycleDet[ending.toString()].cPrice) /
              100
          ).toString();
          roi =
            (winning * 100) /
            parseFloat(
              storagedata.data.value.cycleDet[x.path[4]].betDet[x.path[6]].det[
                x.path[8]
              ].invest
            );
        } else {
          wPrice = "TBA";
          if (
            parseFloat(
              storagedata.data.value.cycleDet[x.path[4]].betDet[x.path[6]].amt
            ) == parseFloat(storagedata.data.value.cycleDet[x.path[4]].cAmount)
          ) {
            roi = Number(storagedata.data.value.rate) / 100;
          } else {
            roi =
              ((100 - 2) *
                parseFloat(storagedata.data.value.rate) *
                parseFloat(
                  storagedata.data.value.cycleDet[x.path[4]].cAmount
                )) /
              (10000 *
                parseFloat(
                  storagedata.data.value.cycleDet[x.path[4]].betDet[x.path[6]]
                    .amt
                ));
          }
        }
        entry = [
          cycle -
            Number(storagedata.data.value.withdrawcycle) +
            Number(x.path[4]) +
            1,
          lrange.toFixed(2),
          urange.toFixed(2),
          wPrice,
          Number(
            storagedata.data.value.cycleDet[x.path[4]].betDet[x.path[6]].det[
              x.path[8]
            ].invest
          ),
          winning,
          x.path[6].includes("-"),
          parseFloat(roi.toFixed(4)),
        ];
        entries.push(entry);
      }
      if (entries.length != 0) {
        this.setState((state) => {
          return {
            account: accountPkh,
            result: entries.reverse(),
            Cycle: cycle,
            show: true,
          };
        });
      } else {
        await swal({
          title: "Error!!!",
          text:
            "The selected account has not executed any staking orders in the past 11 cycles.",
          icon: "error",
        });
      }
    } catch (err) {
      if (err.message == "Please Install ") {
        await swal({
          title: "Error!!!",
          content: (
            <Container fluid="xs" align="left">
              <p
                style={{
                  "padding-left": "1.12rem",
                  "line-height": "2.11rem",
                  color: "#748093",
                }}
              >
                {err.message}
                <a href="https://thanoswallet.com/download">
                  Thanos Wallet Browser Plugin
                </a>{" "}
                To Utilize The Services Of Stakepool
              </p>
            </Container>
          ),
          icon: "error",
        });
      } else {
        await swal({
          title: "Error!!!",
          content: (
            <Container fluid="xs" align="left">
              <p
                style={{
                  "padding-left": "1.12rem",
                  "line-height": "2.11rem",
                  color: "#748093",
                }}
              >
                {err.message}
              </p>
            </Container>
          ),
          icon: "error",
        });
      }
    }
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
                        href="/Account"
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
              Your
              <br />
              Staking Orders
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
            <Nav tabs>
              <NavItem style={{ width: "16vmax" }}>
                <NavLink
                disabled
                  className={classnames({
                    active: this.state.activeTab === "mainnet",
                  })}
                  onClick={() => {
                    this.setTab("mainnet");
                  }}
                  style={{
                    color:
                      this.state.activeTab === "mainnet"
                        ? "#183B56"
                        : "#5A7184",
                    "font-family": "OpenSans-SemiBold, sans-serif",
                    "text-align": "Center",
                    "font-size": "1.7vmax",
                  }}
                >
                  Mainnet
                </NavLink>
              </NavItem>
              <NavItem style={{ width: "16vmax" }}>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "delphinet",
                  })}
                  onClick={() => {
                    this.setTab("delphinet");
                  }}
                  style={{
                    color:
                      this.state.activeTab === "delphinet"
                        ? "#183B56"
                        : "#5A7184",
                    "font-family": "OpenSans-SemiBold, sans-serif",
                    "text-align": "Center",
                    "font-size": "1.7vmax",
                  }}
                >
                  Delphinet
                </NavLink>
              </NavItem>
            </Nav>
            <Col
              style={{
                "text-align": "right",
                "padding-right": "3.4vmax",
                "padding-top": this.state.show ? "1.666666667vmax" : "5vmax",
                "padding-bottom": this.state.show ? "1.66667vmax" : "5vmax",
              }}
            >
              <button
                onClick={() => {
                  this.stakingDet();
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
                <strong>Connect Wallet</strong>
              </button>
            </Col>
            <Collapse isOpen={this.state.show}>
              <Row
                sm="2"
                style={{
                  "margin-left": "1vmax",
                  "margin-right": "3.5vmax",
                  "margin-bottom": "1vmax",
                }}
              >
                <Col sm="6">
                  <label
                    style={{
                      color: "#5A7184",
                      "font-family": "OpenSans-SemiBold, sans-serif",
                      "font-size": "1.277778vmax",
                    }}
                  >
                    Account Address:
                    <Badge
                      color="light"
                      style={{
                        height: "1.6666667vmax",
                        "text-align": "left",
                        "padding-left": "0.8888889vmax",
                        color: "#959EAD",
                        "font-family": "OpenSans-SemiBold, sans-serif",
                        "font-size": "1.277778vmax",
                      }}
                    >
                      {this.state.account}
                    </Badge>
                  </label>{" "}
                </Col>
              </Row>
              <Table hover responsive style={{ "margin-bottom": "2.15vmax" }}>
                <thead
                  style={{
                    "font-family": "OpenSans-SemiBold, sans-serif",
                    "font-size": "1.282vmax",
                    "text-align": "center",
                  }}
                >
                  <tr>
                    <th>Staking Period</th>
                    <th>Predicted Price Range</th>
                    <th>Price at conclusion of Staking Period</th>
                    <th>Staked Amount</th>
                    <th>Staked ROI</th>
                    <th>Staking Reward Won</th>
                    <th>Staking Status</th>
                  </tr>
                </thead>
                <tbody
                  style={{
                    "text-align": "center",
                    color: "#5A7184",
                    "font-family": "OpenSans-SemiBold, sans-serif",
                    "font-size": "1.277778vmax",
                  }}
                >
                  {this.state.result.map((value) => (
                    <tr>
                      <td>
                        {value[0]} - {value[0] + 5}
                      </td>
                      <td>
                        {value[1] == value[2]
                          ? value[6]
                            ? "Below $" + value[1].toString()
                            : "Above $" + value[1].toString()
                          : "Between $" +
                            value[1].toString() +
                            " - $" +
                            value[2].toString()}
                      </td>
                      <td>{Number(value[3])?"$"+value[3]:value[3]}</td>
                      <td>{value[4] / 1000000} XTZ</td>
                      <td>{value[7]}%</td>
                      <td>{Number(value[3])?value[5]?(value[5]/1000000).toString()+" XTZ":"Stake Refunded":"TBA"}</td>
                      <td>{Number(value[3])?"Completed":"Ongoing"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Collapse>
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
            <strong>Copyright © 2020. Crafted with love.</strong>
          </p>
          <a
          href="https://tezsure.com"
          target="_blank" rel="noopener noreferrer"
          >
          <img
            src={tezsure}
            style={{
              width: "1.25vmax",
              height: "1.25vmax",
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
