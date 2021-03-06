/* eslint-disable jsx-a11y/accessible-emoji */
import React, { Component } from 'react';

export default class OrdersForm extends Component {
    calculateRange = (elem) => {
        let range;
        if (elem.low !== elem.high) {
            if (elem.high < 0 || elem.low < 0) {
                if (elem.high === 0) {
                    range = `Down to ${(-1 * elem.low) / 100}%`;
                } else {
                    range = `Down ${(-1 * elem.high) / 100}% - ${(
                        (-1 * elem.low) /
                        100
                    ).toFixed(2)}%`;
                }
            } else {
                if (elem.low === 0) {
                    range = `Up to ${elem.high / 100}%`;
                } else {
                    range = `Up ${elem.low / 100}% - ${(
                        elem.high / 100
                    ).toFixed(2)}%`;
                }
            }
        }
        if (elem.low === elem.high && elem.low < 0) {
            range = `Down ${(-1 * elem.low) / 100}% or More`;
        }
        if (elem.low === elem.high && elem.low > 0) {
            range = `Up ${elem.high / 100}% or More`;
        }
        return range;
    };

    render() {
        const {
            accountAddress,
            activeTab,
            stakingOrders,
            wallet,
            ongoingWithdraw,
            currentCycle,
        } = this.props;
        const currentAddress = accountAddress[activeTab];
        const stakingOrdersJSX = stakingOrders[activeTab].map((elem, index) => {
            const stakingPeriod = `${elem.stakedAt} - ${elem.cycle}`;
            const range = this.calculateRange(elem.range);
            let rewadsText = 'Withdraw';
            let buttonStatusDisabled = false;
            let status = (document.createElement('span').innerHTML = (
                <span title="Awaiting result">N/A &#128683;</span>
            ));
            if (
                currentCycle[activeTab] >= elem.cycle &&
                (elem.withdrawnAmount === elem.stakedAmount ||
                    elem.withdrawnAmount === 0)
            ) {
                status = document.createElement('span').innerHTML = (
                    <span>nay &#128078;</span>
                );
            }
            if (
                currentCycle[activeTab] >= elem.cycle &&
                elem.withdrawnAmount > elem.stakedAmount
            ) {
                status = document.createElement('span').innerHTML = (
                    <span>yay &#x1F44D;</span>
                );
            }
            console.log(elem.withdrawnAmount);

            if (currentCycle[activeTab] <= elem.cycle) {
                buttonStatusDisabled = true;
                rewadsText = 'Pending';
            }
            if (elem.withdrawn || ongoingWithdraw === index) {
                buttonStatusDisabled = true;
                rewadsText = 'Withdrawn';
            }

            return (
                <tr key={stakingPeriod}>
                    <td className="staking-period">{stakingPeriod}</td>
                    <td className="range">{range}</td>
                    <td className="staked-amount">
                        {elem.stakedAmount / Math.pow(10, 6)} ꜩ
                    </td>
                    <td className="staked-amount">
                        {currentCycle[activeTab] <= elem.cycle
                            ? 'N/A'
                            : (
                                  elem.withdrawnAmount / Math.pow(10, 6)
                              ).toString() + `ꜩ`}{' '}
                    </td>
                    <td>
                        <span
                            className={
                                elem.withdrawn
                                    ? 'sucess-badge'
                                    : 'warning-badge'
                            }
                        />
                        {'  '}
                        {rewadsText}
                    </td>
                    <td className="staked-status">
                        <button
                            type="button"
                            className="btn btn-dark processing-button"
                            onClick={() =>
                                this.props.withdrawAmount(
                                    elem.cycle,
                                    activeTab,
                                    wallet,
                                    index
                                )
                            }
                            disabled={buttonStatusDisabled}
                            style={{
                                cursor: buttonStatusDisabled
                                    ? 'not-allowed'
                                    : 'pointer',
                            }}
                        >
                            {ongoingWithdraw !== index ? (
                                'withdraw'
                            ) : (
                                <>
                                    <span
                                        className="spinner-grow spinner-grow-sm"
                                        role="status"
                                        aria-hidden="true"
                                        style={{
                                            marginTop: '5px',
                                        }}
                                    />
                                    <p className="processing-text">
                                        &nbsp; processing...
                                    </p>
                                </>
                            )}
                        </button>
                    </td>
                    <td>{status}</td>
                </tr>
            );
        });
        return (
            <div className="container-fluid">
                <div className="network-container" style={{ marginTop: '0px' }}>
                    <div
                        className="network-tab "
                        style={{ textAlign: 'center' }}
                    >
                        <span className={'sucess-badge'} />
                        &nbsp; Ongoing current cycle: {currentCycle[activeTab]}
                    </div>
                </div>
                <div className="container-account-details">
                    <div className="account-details">
                        {currentAddress ? (
                            <span className="wallet-address-des">
                                Wallet address: &nbsp;
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
                            <th scope="col">Withdraw amount</th>
                            <th scope="col">Staked reward status</th>
                            <th scope="col">Action</th>
                            <th scope="col">Winning status</th>
                        </tr>
                    </thead>
                    {stakingOrdersJSX.length > 0 ? (
                        <tbody>{stakingOrdersJSX}</tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan="7">No data available</td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
        );
    }
}
