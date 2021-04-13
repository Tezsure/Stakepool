/* eslint-disable no-useless-constructor */
import React, { Fragment, Component } from 'react';
import { NavLink } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import OrdersForm from './OrdersForm';
import { TempleWallet } from '@temple-wallet/dapp';
import { getBetsByBettor } from '../../apis/stackingOrdersApis';

export default class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'testnet',
            accountAddress: {
                mainnet: '',
                testnet: '',
            },
        };
        this.ConnectWallet = this.ConnectWallet.bind(this);
    }

    GetStakingData = async () => {
        const { accountAddress, activeTab } = this.state;
        const Bets = await getBetsByBettor(accountAddress, activeTab);
        console.log('======= Bets =========', Bets);
    };

    async ConnectWallet() {
        try {
            const { accountAddress, activeTab } = this.state;
            const available = await TempleWallet.isAvailable();
            if (!available) {
                throw new Error('Please Install ');
            }
            const wallet = new TempleWallet('Stakepool');
            activeTab === 'mainnet'
                ? await wallet.connect('mainnet', { forcePermission: true })
                : await wallet.connect('edo2net', { forcePermission: true });
            const tezos = wallet.toTezos();
            const accountPkh = await tezos.wallet.pkh();
            accountAddress[activeTab] = accountPkh;
            this.setState({ accountAddress }, () => {
                this.GetStakingData();
            });
        } catch (error) {
            console.log(error);
        }
    }

    toggleTabs = (activeTab) => {
        this.setState({ activeTab });
    };

    render() {
        const { activeTab } = this.state;
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
                                <div className="staking-orders-container">
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
                                                            'mainnet'
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
