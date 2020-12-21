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
import stakepool from "./icons/stakepool.svg";
import bg from "./icons/background.png";
import setting from "./icons/setting.svg";
import heart from "./icons/Heart.svg";
import tezsure from "./icons/tezsure.png";
import youtube from "./icons/youtube.svg";
import telegram from "./icons/telegram.svg";
import linkedin from "./icons/linkedin.svg";
import twitter from "./icons/twitter.svg";
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

  async componentWillUnmount() {
    clearTimeout(this.tzInterval);
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
              Coming Soon...
            </strong>
          </p>

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