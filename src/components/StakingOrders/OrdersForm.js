import React, { Component } from 'react';

export default class OrdersForm extends Component {
    calculateRange = (elem) => {
        const { currentXTZPrice } = this.props;
        let range;
        if (elem.low !== elem.high) {
            range = `In the range of $ ${(
                (currentXTZPrice * 100 + elem.low / 100) /
                100
            ).toFixed(2)} - $ ${(
                (currentXTZPrice * 100 + elem.high / 100) /
                100
            ).toFixed(2)}`;
        }
        if (elem.low === elem.high && elem.low < 0) {
            range = `Below $ ${(
                (currentXTZPrice * 100 + elem.low / 100) /
                100
            ).toFixed(2)}`;
        }
        if (elem.low === elem.high && elem.low > 0) {
            range = `Above $ ${(
                (currentXTZPrice * 100 + elem.low / 100) /
                100
            ).toFixed(2)}`;
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
            let rewadsText = '';
            let buttonStatusDisabled = false;
            if (currentCycle[activeTab] <= elem.cycle) {
                buttonStatusDisabled = true;
                rewadsText = 'Pending';
            }
            if (elem.withdrawn || ongoingWithdraw === index) {
                buttonStatusDisabled = true;
                rewadsText = 'Withdawn';
            }
            return (
                <tr key={stakingPeriod}>
                    <td className="staking-period">{stakingPeriod}</td>
                    <td className="range">{range}</td>
                    <td className="staked-amount">
                        {elem.stakedAmount / Math.pow(10, 6)} ꜩ
                    </td>
                    <td className="staked-amount">
                        {elem.withdrawnAmount / Math.pow(10, 6)} ꜩ
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
                            className="btn btn-dark"
                            onClick={() =>
                                this.props.withdrawAmount(
                                    elem.cycle,
                                    activeTab,
                                    wallet,
                                    index
                                )
                            }
                            disabled={buttonStatusDisabled}
                        >
                            {ongoingWithdraw !== index ? (
                                'withdraw'
                            ) : (
                                <>
                                    <span
                                        className="spinner-grow spinner-grow-sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    &nbsp; processing...
                                </>
                            )}
                        </button>
                    </td>
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
                        </tr>
                    </thead>
                    {stakingOrdersJSX.length > 0 ? (
                        <tbody>{stakingOrdersJSX}</tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan="6">No data available</td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
        );
    }
}
