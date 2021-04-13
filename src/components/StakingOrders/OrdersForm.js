import React, { Component } from 'react';

export default class OrdersForm extends Component {
    render() {
        const { accountAddress, activeTab, stakingOrders } = this.props;
        const currentAddress = accountAddress[activeTab];
        const stakingOrdersJSX = stakingOrders[activeTab].map((elem) => {
            const stakingPeriod = `${elem.stakedAt} - ${elem.cycle}`;
            const range = `${parseInt(elem.range.low, 10) / 100} - ${
                parseInt(elem.range.high, 10) / 100
            }`;
            return (
                <tr key={stakingPeriod}>
                    <td className="staking-period">{stakingPeriod}</td>
                    <td className="range">{range}</td>
                    <td className="staked-amount">
                        {elem.stakedAmount / Math.pow(10, 6)}
                    </td>
                    <td>
                        <span className="warning-badge" />
                    </td>
                    <td className="staked-status">
                        <button
                            type="button"
                            className="btn btn-dark"
                            disabled={elem.withdrawn}
                        >
                            withdraw
                        </button>
                    </td>
                </tr>
            );
        });
        return (
            <div className="container-fluid">
                <div className="container-account-details">
                    <div className="account-details">
                        {currentAddress ? (
                            <span className="wallet-address-des">
                                Account address: &nbsp;
                                <span className="wallet-address">
                                    {currentAddress}
                                </span>
                            </span>
                        ) : (
                            <span className="wallet-address-des">
                                <span className="wallet-address">
                                    No wallet connected
                                </span>
                            </span>
                        )}
                    </div>
                    <div className="account-details-button">
                        {!this.props.buttonSpinnerState[activeTab] ? (
                            <button
                                type="button"
                                className="btn btn-primary shadow-sm rounded"
                                onClick={() => this.props.ConnectWallet()}
                            >
                                Connect wallet
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                type="button"
                                disabled
                            >
                                <span
                                    className="spinner-grow spinner-grow-sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                &nbsp; Please wait ...
                            </button>
                        )}
                    </div>
                </div>

                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr className="table-head-container">
                            <th scope="col">Staking period</th>
                            <th scope="col">Staked range</th>
                            <th scope="col">Staked amount</th>
                            <th scope="col">Staking reward won</th>
                            <th scope="col">Staked status</th>
                        </tr>
                    </thead>
                    {stakingOrdersJSX.length > 0 ? (
                        <tbody>{stakingOrdersJSX}</tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan="5">No data available</td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
        );
    }
}
