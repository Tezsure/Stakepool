/* eslint-disable no-useless-constructor */
import React, { Fragment, Component } from 'react';
import { NavLink } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import OrdersForm from './OrdersForm';
import { TempleWallet } from '@temple-wallet/dapp';
import { getBetsByBettor, withdrawAmount } from '../../apis/stackingOrdersApis';
import { getCurrentCycle, fetchCurrentTzPrice } from '../../apis/homepageApis';
const CONFIG = require('../../apis/config');

export default class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'testnet',
            accountAddress: {
                mainnet: '',
                testnet: '',
            },
            buttonSpinnerState: {
                mainnet: false,
                testnet: false,
            },
            stakingOrders: {
                mainnet: [],
                testnet: [],
            },
            wallet: '',
            ongoingWithdraw: '',
            currentCycle: {
                mainnet: 0,
                testnet: 0,
            },
            currentXTZPrice: 0,
        };
        this.ConnectWallet = this.ConnectWallet.bind(this);
        this.handleWithdrawAmount = this.handleWithdrawAmount.bind(this);
    }

    componentDidMount() {
        this.getCurrentCycle();
    }

    async handleWithdrawAmount(cycle, network, wallet, index) {
        try {
            this.setState({ ongoingWithdraw: index });
            // eslint-disable-next-line no-unused-vars
            const withdrawAmountResponse = await withdrawAmount(
                cycle,
                network,
                wallet
            );
            this.setState({ ongoingWithdraw: '' });
        } catch (error) {
            this.setState({ ongoingWithdraw: '' });
        }
    }

    getCurrentCycle = async () => {
        let { currentCycle } = this.state;
        const API_RESPONSE = await Promise.all([
            getCurrentCycle('mainnet'),
            getCurrentCycle('testnet'),
            fetchCurrentTzPrice(),
        ]);
        if (API_RESPONSE[0].sucess) {
            currentCycle = {
                mainnet: API_RESPONSE[0].currentCycle,
                testnet: API_RESPONSE[1].currentCycle,
            };
            const currentXTZPrice = API_RESPONSE[2].currentprice;
            this.setState({ currentCycle, currentXTZPrice });
        }
    };

    GetStakingData = async () => {
        const {
            accountAddress,
            activeTab,
            buttonSpinnerState,
            stakingOrders,
        } = this.state;
        buttonSpinnerState[activeTab] = !buttonSpinnerState[activeTab];
        const getBetsResponse = await getBetsByBettor(
            accountAddress.testnet,
            activeTab
        );
        if (getBetsResponse.sucess) {
            stakingOrders[activeTab] = getBetsResponse.bets;
            this.setState({ stakingOrders, buttonSpinnerState });
        } else {
            stakingOrders[activeTab] = [];
            this.setState({ buttonSpinnerState, stakingOrders });
        }
    };

    async ConnectWallet() {
        try {
            const {
                accountAddress,
                activeTab,
                buttonSpinnerState,
            } = this.state;
            const available = await TempleWallet.isAvailable();
            if (!available) {
                throw new Error('Please Install');
            }
            buttonSpinnerState[activeTab] = !buttonSpinnerState[activeTab];
            const wallet = new TempleWallet('Stakepool');
            activeTab === 'mainnet'
                ? await wallet.connect('mainnet', { forcePermission: true })
                : await wallet.connect('edo2net', { forcePermission: true });
            const tezos = wallet.toTezos();
            tezos.setProvider(CONFIG.RPC_NODES[activeTab]);
            tezos.setRpcProvider(CONFIG.RPC_NODES[activeTab]);
            const accountPkh = await tezos.wallet.pkh();
            accountAddress[activeTab] = accountPkh;
            this.setState(
                { accountAddress, buttonSpinnerState, wallet },
                () => {
                    this.GetStakingData();
                }
            );
        } catch (error) {
            console.log(error);
        }
    }

    toggleTabs = (activeTab) => {
        this.setState({ activeTab });
    };

    render() {
        const { activeTab, stakingOrders } = this.state;
        return (
            <Fragment>
                <div className="main-page-container">
                    <div className="banner">
                        <div className="container">
                            <Header />
                            <div className="banner-content-container">
                                <h1 className="banner-heading">
                                    Your staking orders
                                </h1>
                                <div
                                    className="staking-orders-container"
                                    style={{ flexDirection: 'column' }}
                                >
                                    <div className="row main-row">
                                        <ul className="nav nav-tabs">
                                            <li className="nav-item">
                                                <NavLink
                                                    className={
                                                        activeTab === 'mainnet'
                                                            ? `nav-link mainnet-active-tab`
                                                            : 'nav-link'
                                                    }
                                                    to="#"
                                                    onClick={() =>
                                                        this.toggleTabs(
                                                            'testnet'
                                                        )
                                                    }
                                                >
                                                    Mainnet
                                                </NavLink>
                                            </li>
                                            <li className="nav-item">
                                                <NavLink
                                                    className={
                                                        activeTab === 'testnet'
                                                            ? `nav-link testnet-active-tab`
                                                            : 'nav-link'
                                                    }
                                                    to="#"
                                                    onClick={() =>
                                                        this.toggleTabs(
                                                            'testnet'
                                                        )
                                                    }
                                                >
                                                    Testnet
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="row order-form-container">
                                        <OrdersForm
                                            {...this.state}
                                            ConnectWallet={this.ConnectWallet}
                                            withdrawAmount={
                                                this.handleWithdrawAmount
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer {...this.props} />
                </div>
            </Fragment>
        );
    }
}
