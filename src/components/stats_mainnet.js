import React from 'react';
import { TempleWallet } from '@temple-wallet/dapp';
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
} from 'reactstrap';
import stakepool from './icons/stakepool.svg';
import bg from './icons/background.png';
import setting from './icons/setting.svg';
import heart from './icons/Heart.svg';
import tezsure from './icons/tezsure.jpg';
import youtube from './icons/youtube.svg';
import telegram from './icons/telegram.svg';
import linkedin from './icons/linkedin.svg';
import twitter from './icons/twitter.svg';
import axios from 'axios';
import { animateScroll as scroll } from 'react-scroll';
import Footer from './footer';

export default class setseller extends React.Component {
    tzInterval;
    constructor(props) {
        super(props);
        this.state = {
            currentCycle: null,
            winning: [],
            TamountInRange: null,
            pool: null,
            announce: true,
            Rannounce: true,
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
        "https://api.delphi.tzstats.com/explorer/contract/KT1WvnSNdkM8MFnKFApuZLtZH5VUNYYSm6Nr/storage"
      );*/
        const storagedata = await axios.get(
            'https://api.tzstats.com/explorer/contract/KT1DGHWbNCa57L9ctZXrD45P3XoDsHXAdgJK/storage'
        );
        const fetchHeight = await axios.get(
            'https://api.tzkt.io/v1/cycles/count'
        );
        var cycle = fetchHeight.data;
        var currentReferenceRewardCycle = Number(
            storagedata.data.value.currentReferenceRewardCycle
        );
        //var cycle = Math.trunc(height / 2048);
        if (storagedata.data.value.currentReferenceRewardCycle != '1') {
            if (
                Number(storagedata.data.value.currentReferenceRewardCycle) > 8
            ) {
                cycle = cycle - 8;
                var wprice =
                    Number(
                        storagedata.data.value.cycleOperations[
                            currentReferenceRewardCycle.toString()
                        ].priceAtCurrentCycle
                    ) / 100;
                currentReferenceRewardCycle = currentReferenceRewardCycle - 8;
                for (var key of Object.keys(
                    storagedata.data.value.cycleOperations[
                        currentReferenceRewardCycle.toString()
                    ].rangeDetails
                )) {
                    var lrange =
                        Math.trunc(
                            ((100 +
                                Number(key.slice(0, key.indexOf('#'))) / 100) *
                                Number(
                                    storagedata.data.value.cycleOperations[
                                        currentReferenceRewardCycle.toString()
                                    ].priceAtCurrentCycle
                                )) /
                                100
                        ) / 100;
                    var urange =
                        Math.trunc(
                            ((100 +
                                Number(key.slice(key.indexOf('#') + 1)) / 100) *
                                Number(
                                    storagedata.data.value.cycleOperations[
                                        currentReferenceRewardCycle.toString()
                                    ].priceAtCurrentCycle
                                )) /
                                100
                        ) / 100;
                    if (
                        lrange === urange &&
                        key[0] === '-' &&
                        wprice < lrange
                    ) {
                        var negative = true;
                        var reward =
                            Number(
                                storagedata.data.value.cycleOperations[
                                    currentReferenceRewardCycle.toString()
                                ].rangeDetails[key].totalRewards
                            ) / 1000000;
                        var camountInRange =
                            Number(
                                storagedata.data.value.cycleOperations[
                                    currentReferenceRewardCycle.toString()
                                ].rangeDetails[key].amountInRange
                            ) / 1000000;
                        break;
                    }
                    if (
                        lrange === urange &&
                        key[0] !== '-' &&
                        wprice >= urange
                    ) {
                        var negative = false;
                        var reward =
                            Number(
                                storagedata.data.value.cycleOperations[
                                    currentReferenceRewardCycle.toString()
                                ].rangeDetails[key].totalRewards
                            ) / 1000000;
                        var camountInRange =
                            Number(
                                storagedata.data.value.cycleOperations[
                                    currentReferenceRewardCycle.toString()
                                ].rangeDetails[key].amountInRange
                            ) / 1000000;
                        break;
                    }
                    if (
                        lrange != urange &&
                        wprice >= lrange &&
                        wprice < urange
                    ) {
                        var negative = false;
                        var reward =
                            Number(
                                storagedata.data.value.cycleOperations[
                                    currentReferenceRewardCycle.toString()
                                ].rangeDetails[key].totalRewards
                            ) / 1000000;
                        var camountInRange =
                            Number(
                                storagedata.data.value.cycleOperations[
                                    currentReferenceRewardCycle.toString()
                                ].rangeDetails[key].amountInRange
                            ) / 1000000;
                        break;
                    }
                }
                this.setState((state) => {
                    return {
                        currentCycle: cycle,
                        announce: true,
                        Rannounce: true,
                        TamountInRange:
                            Number(
                                storagedata.data.value.cycleOperations[
                                    currentReferenceRewardCycle.toString()
                                ].cAmount
                            ) / 1000000,
                        pool:
                            Number(storagedata.data.value.interestPool) /
                            1000000,
                        winning: [
                            lrange.toFixed(2),
                            urange.toFixed(2),
                            wprice,
                            reward,
                            camountInRange,
                            negative,
                        ],
                    };
                });
            } else {
                cycle =
                    cycle +
                    1 -
                    Number(storagedata.data.value.currentReferenceRewardCycle);
                this.setState((state) => {
                    return {
                        currentCycle: cycle,
                        announce: true,
                        Rannounce: false,
                        TamountInRange:
                            Number(
                                storagedata.data.value.cycleOperations['1']
                                    .cAmount
                            ) / 1000000,
                    };
                });
            }
        } else {
            this.setState((state) => {
                return {
                    currentCycle: cycle,
                    announce: false,
                };
            });
        }
        this.tzInterval = setTimeout(
            this.stakingStats.bind(this),
            cycle * 30000
        );
    }

    render() {
        return (
            <Container
                fluid="xs"
                style={{
                    backgroundColor: '#F9FBFE',
                    'background-size': 'cover',
                    height: '100%',
                    width: '100vmax',
                    'min-height': '100vh',
                }}
            >
                <Container
                    fluid="xs"
                    id="stake"
                    style={{
                        width: '100v',
                        opacity: '1',
                        'background-size': '100% 43vmax',
                        backgroundImage: `url(${bg})`,
                        backgroundClip: 'padding-box',
                        backgroundRepeat: 'repeat-x',
                        'box-shadow': '0px 10px 35px #00000008',
                        'padding-bottom': '10vmax',
                    }}
                >
                    <Navbar
                        color="faded"
                        light
                        style={{
                            'margin-left': '6.667vmax',
                            'margin-right': '5.2vmax',
                        }}
                    >
                        <link href="bootstrap.min.css" rel="stylesheet" />
                        <NavbarBrand
                            href="/"
                            className="mr-auto"
                            styles={{ 'margin-top': '0.97222222vmax' }}
                        >
                            <img
                                src={stakepool}
                                style={{
                                    width: '13.264vmax',
                                    height: '3.056vmax',
                                }}
                            />
                        </NavbarBrand>
                        <Nav>
                            <NavItem>
                                <NavLink
                                    href="https://www.notion.so/Stakepool-A-no-loss-price-prediction-experiment-38bc2c0e0fe540aaaa1bc91ebcdcf5c4"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        'font-size': '1.1111111111vmax',
                                        'font-family':
                                            'OpenSans-SemiBold, sans-serif',
                                        color: '#FFFFFF',
                                        'margin-top': '1.736vmax',
                                    }}
                                >
                                    Documentation
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    href="https://github.com/Tezsure/Stakepool-Contracts"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        'font-size': '1.1111111111vmax',
                                        'font-family':
                                            'OpenSans-SemiBold, sans-serif',
                                        color: '#FFFFFF',
                                        'margin-top': '1.736vmax',
                                    }}
                                >
                                    GitHub
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <UncontrolledButtonDropdown
                                    direction="bottom-start"
                                    style={{ color: '#1565D8' }}
                                >
                                    <DropdownToggle
                                        caret={false}
                                        color="#1565D8"
                                        style={{
                                            'font-size': '1.1111111111vmax',
                                            'font-family':
                                                'OpenSans-SemiBold, sans-serif',
                                            color: '#FFFFFF',
                                            'margin-top': '1.736vmax',
                                        }}
                                    >
                                        Stats
                                    </DropdownToggle>

                                    <DropdownMenu
                                        style={{
                                            backgroundColor: '#F9FBFE',
                                            width: '200%',
                                            'border-radius': '0.27777778vmax',
                                        }}
                                    >
                                        <DropdownItem
                                            style={{
                                                'line-height': '0.6667vmax',
                                            }}
                                        >
                                            <NavLink
                                                href="/statsdelphinet"
                                                style={{
                                                    'font-size':
                                                        '1.1111111111vmax',
                                                    'font-family':
                                                        'OpenSans-SemiBold, sans-serif',
                                                    color: '#5A7184',
                                                }}
                                            >
                                                Mainnet
                                            </NavLink>
                                        </DropdownItem>
                                        <DropdownItem
                                            style={{
                                                'line-height': '0.6667vmax',
                                            }}
                                        >
                                            <NavLink
                                                href="/statsdelphinet"
                                                style={{
                                                    'font-size':
                                                        '1.1111111111vmax',
                                                    'font-family':
                                                        'OpenSans-SemiBold, sans-serif',
                                                    color: '#5A7184',
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
                                        'font-size': '1.1111111111vmax',
                                        'font-family':
                                            'OpenSans-SemiBold, sans-serif',
                                        color: '#FFFFFF',
                                        'margin-top': '1.736vmax',
                                    }}
                                >
                                    FAQ
                                </NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink
                                    style={{
                                        'font-size': '1.1111111111vmax',
                                        'font-family':
                                            'OpenSans-SemiBold, sans-serif',
                                        color: '#FFFFFF',
                                        'margin-top': '0.764vmax',
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            scroll.scrollToBottom();
                                        }}
                                        style={{
                                            color: '#FFFFFF',
                                            backgroundColor: '#1565D8',
                                            'text-align': 'center',
                                            'font-size': '1.1111111111vmax',
                                            border: '0.13889vmax solid #FFFFFF',
                                            'border-radius': '0.556vmax',
                                            width: '10.764vmax',
                                            padding:
                                                '0.762vmax 0vmax 0.556vmax 0vmax',
                                        }}
                                    >
                                        Get In Touch
                                    </button>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <UncontrolledButtonDropdown
                                    direction="bottom-start"
                                    style={{ color: '#1565D8' }}
                                >
                                    <DropdownToggle
                                        caret={false}
                                        color="#1565D8"
                                        style={{ 'margin-top': '0.764vmax' }}
                                    >
                                        <img
                                            src={setting}
                                            style={{
                                                width: '4vmax',
                                                height: '3.33333333vmax',
                                                'padding-right':
                                                    '0.24444444vmax',
                                            }}
                                        />
                                    </DropdownToggle>
                                    <DropdownMenu
                                        style={{
                                            backgroundColor: '#F9FBFE',
                                            width: '200%',
                                            'border-radius': '0.27777778vmax',
                                        }}
                                    >
                                        <DropdownItem header>
                                            Stakepool
                                        </DropdownItem>
                                        <DropdownItem
                                            style={{
                                                'line-height': '0.6667vmax',
                                            }}
                                        >
                                            <NavLink
                                                href="/"
                                                style={{
                                                    'font-size':
                                                        '1.1111111111vmax',
                                                    'font-family':
                                                        'OpenSans-SemiBold, sans-serif',
                                                    color: '#5A7184',
                                                }}
                                            >
                                                Mainnet
                                            </NavLink>
                                        </DropdownItem>
                                        <DropdownItem
                                            style={{
                                                'line-height': '0.6667vmax',
                                            }}
                                        >
                                            <NavLink
                                                href="/"
                                                style={{
                                                    'font-size':
                                                        '1.1111111111vmax',
                                                    'font-family':
                                                        'OpenSans-SemiBold, sans-serif',
                                                    color: '#5A7184',
                                                }}
                                            >
                                                Delphinet
                                            </NavLink>
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem
                                            style={{
                                                'line-height': '0.6667vmax',
                                            }}
                                        >
                                            <NavLink
                                                href="/account"
                                                style={{
                                                    'font-size':
                                                        '1.1111111111vmax',
                                                    'font-family':
                                                        'OpenSans-SemiBold, sans-serif',
                                                    color: '#5A7184',
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
                    <p align="center" className="header-stats">
                        Previous Staking Period
                        <br />
                        Cycle {this.state.currentCycle + 1} -{' '}
                        {this.state.currentCycle + 8} Stats
                    </p>
                    <Card
                        inverse={true}
                        style={{
                            'margin-left': '9.0888888889vmax',
                            'margin-right': '7.6vmax',
                            'box-shadow':
                                '0px 0.6944444vmax 2.430555556vmax #00000008',
                            'min-height': '22vmax',
                        }}
                    >
                        <Row>
                            <Col
                                style={{
                                    'text-align': 'right',
                                    'padding-right': '9.5vmax',
                                    'padding-top': this.state.show
                                        ? '1.666666667vmax'
                                        : '2vmax',
                                    'padding-bottom': this.state.show
                                        ? '1.66667vmax'
                                        : '2vmax',
                                }}
                            >
                                <button
                                    disabled
                                    style={{
                                        color: 'white',
                                        backgroundColor: '#4868c2',
                                        'font-family':
                                            'OpenSans-Bold, sans-serif',
                                        'text-align': 'center',
                                        fontSize: 'large',
                                        border: '0.06944vmax solid black',
                                        'border-radius': '0.5555556vmax',
                                        width: '24.5138888888889vmax',
                                        height: '7.05555556vmax',
                                        'line-height': '2.55555556vmax',
                                    }}
                                >
                                    Winning Price Range <br />
                                    {this.state.announce
                                        ? this.state.Rannounce
                                            ? this.state.winning[0] ==
                                              this.state.winning[1]
                                                ? this.state.winning[5]
                                                    ? 'Below $' +
                                                      this.state.winning[0]
                                                    : 'Above $' +
                                                      this.state.winning[0]
                                                : 'Between $' +
                                                  this.state.winning[0] +
                                                  ' - $' +
                                                  this.state.winning[1]
                                            : 'TBA'
                                        : 'TBA'}
                                </button>
                            </Col>

                            <Col
                                style={{
                                    'text-align': 'left',
                                    'padding-left': '9.5vmax',
                                    'padding-top': this.state.show
                                        ? '1.666666667vmax'
                                        : '2vmax',
                                    'padding-bottom': this.state.show
                                        ? '1.66667vmax'
                                        : '2vmax',
                                }}
                            >
                                <button
                                    disabled
                                    style={{
                                        color: 'white',
                                        backgroundColor: '#4868c2',
                                        'font-family':
                                            'OpenSans-Bold, sans-serif',
                                        'text-align': 'center',
                                        fontSize: 'large',
                                        border: '0.06944vmax solid black',
                                        'border-radius': '0.5555556vmax',
                                        width: '24.5138888888889vmax',
                                        height: '7.05555556vmax',
                                        'line-height': '2.55555556vmax',
                                    }}
                                >
                                    Total Bet Amount
                                    <br />
                                    {this.state.announce
                                        ? this.state.TamountInRange
                                            ? this.state.TamountInRange.toString() +
                                              ' XTZ'
                                            : '0 XTZ'
                                        : 'TBA'}
                                </button>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                style={{
                                    'text-align': 'left',
                                    'padding-left': '9.5vmax',
                                    'padding-top': this.state.show
                                        ? '1.666666667vmax'
                                        : '2vmax',
                                    'padding-bottom': this.state.show
                                        ? '1.66667vmax'
                                        : '2vmax',
                                }}
                            >
                                <button
                                    disabled
                                    style={{
                                        color: 'white',
                                        backgroundColor: '#4868c2',
                                        'font-family':
                                            'OpenSans-Bold, sans-serif',
                                        'text-align': 'center',
                                        fontSize: 'large',
                                        border: '0.06944vmax solid black',
                                        'border-radius': '0.5555556vmax',
                                        width: '24.5138888888889vmax',
                                        height: '7.05555556vmax',
                                        'line-height': '2.55555556vmax',
                                    }}
                                >
                                    Winners Aggregate ROI <br />
                                    {this.state.announce
                                        ? this.state.Rannounce
                                            ? this.state.winning[4]
                                                ? (
                                                      (this.state.winning[3] *
                                                          100) /
                                                      this.state.winning[4]
                                                  ).toFixed(4) + '%'
                                                : '0%'
                                            : 'TBA'
                                        : 'TBA'}
                                </button>
                            </Col>

                            <Col
                                style={{
                                    'text-align': 'right',
                                    'padding-right': '9.5vmax',
                                    'padding-top': this.state.show
                                        ? '1.666666667vmax'
                                        : '2vmax',
                                    'padding-bottom': this.state.show
                                        ? '1.66667vmax'
                                        : '2vmax',
                                }}
                            >
                                <button
                                    disabled
                                    style={{
                                        color: 'white',
                                        backgroundColor: '#4868c2',
                                        'font-family':
                                            'OpenSans-Bold, sans-serif',
                                        'text-align': 'center',
                                        fontSize: 'large',
                                        border: '0.06944vmax solid black',
                                        'border-radius': '0.5555556vmax',
                                        width: '24.5138888888889vmax',
                                        height: '7.05555556vmax',
                                        'line-height': '2.55555556vmax',
                                    }}
                                >
                                    Total Pool Rewards Won <br />
                                    {this.state.announce
                                        ? this.state.Rannounce
                                            ? this.state.winning[3]
                                                ? this.state.winning[3] + ' XTZ'
                                                : '0 XTZ'
                                            : 'TBA'
                                        : 'TBA'}
                                </button>
                            </Col>
                        </Row>

                        <Row>
                            <Col
                                style={{
                                    'text-align': 'left',
                                    'padding-left': '9.5vmax',
                                    'padding-top': this.state.show
                                        ? '1.666666667vmax'
                                        : '2vmax',
                                    'padding-bottom': this.state.show
                                        ? '1.66667vmax'
                                        : '2vmax',
                                }}
                            >
                                <button
                                    disabled
                                    style={{
                                        color: 'white',
                                        backgroundColor: '#4868c2',
                                        'font-family':
                                            'OpenSans-Bold, sans-serif',
                                        'text-align': 'center',
                                        fontSize: 'large',
                                        border: '0.06944vmax solid black',
                                        'border-radius': '0.5555556vmax',
                                        width: '24.5138888888889vmax',
                                        height: '9.05555556vmax',
                                        'line-height': '2.55555556vmax',
                                    }}
                                >
                                    Total Amount in Winning Range <br />
                                    {this.state.announce
                                        ? this.state.Rannounce
                                            ? this.state.winning[4]
                                                ? this.state.winning[4] + ' XTZ'
                                                : '0 XTZ'
                                            : 'TBA'
                                        : 'TBA'}
                                </button>
                            </Col>

                            <Col
                                style={{
                                    'text-align': 'right',
                                    'padding-right': '9.5vmax',
                                    'padding-top': this.state.show
                                        ? '1.666666667vmax'
                                        : '2vmax',
                                    'padding-bottom': this.state.show
                                        ? '1.66667vmax'
                                        : '2vmax',
                                }}
                            >
                                <button
                                    disabled
                                    style={{
                                        color: 'white',
                                        backgroundColor: '#4868c2',
                                        'font-family':
                                            'OpenSans-Bold, sans-serif',
                                        'text-align': 'center',
                                        fontSize: 'large',
                                        border: '0.06944vmax solid black',
                                        'border-radius': '0.5555556vmax',
                                        width: '24.5138888888889vmax',
                                        height: '9.05555556vmax',
                                        'line-height': '2.55555556vmax',
                                    }}
                                >
                                    Carry Forwarded Amount to Current Pool{' '}
                                    <br />
                                    {this.state.announce
                                        ? this.state.Rannounce
                                            ? this.state.pool
                                                ? this.state.pool + ' XTZ'
                                                : '0 XTZ'
                                            : 'TBA'
                                        : 'TBA'}
                                </button>
                            </Col>
                        </Row>
                    </Card>
                </Container>
                <Footer />
            </Container>
        );
    }
}