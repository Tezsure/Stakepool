/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/images/Group 35964@2x.png';
import settingsLogo from '../../assets/images/setting.46141fb1.png';
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
        const { displayDropdownStats, displayDropdownSetting } = this.state;
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
                            to="staking-orders"
                            style={{ fontWeight: '600' }}
                        >
                            Staking-orders
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
                                    onClick={() =>
                                        this.toggleStatsDropdownStats()
                                    }
                                    replace
                                >
                                    Mainnet stats
                                </Link>
                                <Link
                                    className="dropdown-item"
                                    to={'/testnet-stats'}
                                    onClick={() =>
                                        this.toggleStatsDropdownStats()
                                    }
                                    replace
                                >
                                    Testnet stats
                                </Link>
                            </div>
                        </div>
                    </li>
                    <NetworkDropDown {...this.props} />
                    <li className="site-menu-item">
                        <span className="dropdown">
                            <NavLink
                                to="#"
                                className="dropdown-toggle dropdown-setting-icon"
                                role="button"
                                id="dropdownMenuLink"
                                onClick={() => {
                                    this.setState({
                                        displayDropdownSetting: !displayDropdownSetting,
                                    });
                                }}
                            >
                                <img
                                    src={settingsLogo}
                                    className="settings-logo"
                                    alt="settings"
                                    style={{ width: '35px', cursor: 'pointer' }}
                                    title="settings"
                                />
                            </NavLink>
                            <div
                                className="dropdown-menu"
                                aria-labelledby="dropdownMenuLink"
                                style={{
                                    display: displayDropdownSetting
                                        ? 'block'
                                        : 'none',
                                    margin: '1.125rem 0px 0',
                                }}
                            >
                                <Link className="dropdown-item" to={'/faq'}>
                                    FAQ
                                </Link>
                                <a
                                    href="https://github.com/Tezsure/Stakepool-Contracts/tree/development/stakepool-contract"
                                    className="dropdown-item"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    Contribute
                                </a>
                                <a
                                    className="dropdown-item"
                                    href="#"
                                    rel="noopener noreferrer"
                                    onClick={() =>
                                        this.handleScolling('contact', 1000)
                                    }
                                >
                                    Connect with us
                                </a>
                            </div>
                        </span>
                    </li>
                </ul>
            </header>
        );
    }
}
