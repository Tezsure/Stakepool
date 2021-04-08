/* eslint-disable no-useless-constructor */
import React, { Fragment, Component } from 'react';
import { NavLink } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import OrdersForm from './OrdersForm';

export default class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'mainnet',
            accountAddress: {
                mainnet: '',
                testnet: '',
            },
        };
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
                                        <OrdersForm {...this.state} />
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
