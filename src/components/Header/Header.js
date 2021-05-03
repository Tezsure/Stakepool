/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/Group 35964@2x.png';
import { doScrolling } from '../../apis/homepageApis';
import NetworkDropDown from './NetworkDropDown';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayDropdownStats: false,
            displayDropdownSetting: false,
        };
    }
    handleScolling = (element, duration) => {
        doScrolling(element, duration);
    };
    componentDidMount() {
        window.onclick = (e) => {
            const { displayDropdownStats, displayDropdownSetting } = this.state;
            const { className } = e.target;
            if (
                className !== 'settings-logo' &&
                className !== 'btn dropdown-toggle stats-button'
            ) {
                if (displayDropdownSetting || displayDropdownStats) {
                    this.setState({
                        displayDropdownStats: false,
                        displayDropdownSetting: false,
                    });
                }
            }
        };
    }
    toggleStatsDropdownStats = () => {
        const { displayDropdownStats } = this.state;
        this.setState({
            displayDropdownStats: !displayDropdownStats,
        });
    };
    toggleSettingsDropdown = () => {
        const { displayDropdownSetting } = this.state;
        this.setState({
            displayDropdownSetting: !displayDropdownSetting,
        });
    };
    render() {
        const { displayDropdownStats } = this.state;
        return (
            <header className="site-header">
                <div className="site-logo">
                    <a href="/" className="site-header-link">
                        <img src={logo} alt="logo" className="logo-image" />
                    </a>
                </div>
                <ul className="site-menu-wrapper">
                    <li className="site-menu-item">
                        <Link
                            className="site-menu-item-link"
                            to={'/faq'}
                            style={{ fontWeight: '600' }}
                        >
                            FAQ
                        </Link>
                    </li>
                    <li className="site-menu-item">
                        <Link
                            className="site-menu-item-link"
                            to="staking-orders"
                            style={{ fontWeight: '600' }}
                        >
                            Staking orders
                        </Link>
                    </li>
                    <li className="site-menu-item">
                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn dropdown-toggle stats-button"
                                onClick={() => {
                                    this.setState({
                                        displayDropdownStats: !displayDropdownStats,
                                    });
                                }}
                                style={{
                                    color: '#fff',
                                    border: '#fff',
                                    fontWeight: '600',
                                }}
                            >
                                Statistics
                            </button>
                            <div
                                className="dropdown-menu"
                                style={{
                                    display: displayDropdownStats
                                        ? 'block'
                                        : 'none',
                                }}
                            >
                                <Link
                                    className="dropdown-item"
                                    to={`/mainnet-stats`}
                                    onClick={() => {
                                        this.toggleStatsDropdownStats();
                                        window.location.href = 'mainnet-stats';
                                    }}
                                    replace
                                >
                                    Mainnet stats
                                </Link>
                                <Link
                                    className="dropdown-item"
                                    to={'/testnet-stats'}
                                    onClick={() => {
                                        this.toggleStatsDropdownStats();
                                        window.location.href = 'testnet-stats';
                                    }}
                                    replace
                                >
                                    Testnet stats
                                </Link>
                            </div>
                        </div>
                    </li>
                    <NetworkDropDown {...this.props} />
                </ul>
            </header>
        );
    }
}
