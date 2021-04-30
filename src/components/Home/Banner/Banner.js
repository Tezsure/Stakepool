import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Header/Header';
import Countdown from 'react-countdown-now';
import { TempleWallet } from '@temple-wallet/dapp';
import { Tooltip, Alert } from 'reactstrap';

const tzIcon = require('../../../assets/images/Path 453@2x.png');

const Title =
    'Reference price is the price of xtz in USD deduced at the starting of each cycle and all bets are placed against this reference price';

export default class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refPriceTooltipOpen: false,
            showWarningAlert: true,
            stakeAmtTooltipOpen: false,
            templeWalletError: false,
        };
    }
    componentDidMount() {
        this.checkTempleWallet();
    }
    checkTempleWallet = async () => {
        const available = await TempleWallet.isAvailable();
        if (!available) {
            this.setState({
                templeWalletError: true,
            });
        }
    };
    toggleTooltip = (StateName) => {
        const tooltipValue = !this.state[StateName];
        this.setState({ [StateName]: tooltipValue });
    };
    fetchBannerMessage = () => {
        const { onGoingBet } = this.props;
        const { templeWalletError } = this.state;
        if (onGoingBet) {
            return (
                <Alert
                    color="success"
                    isOpen={!onGoingBet}
                    style={{ width: '100%', marginTop: '-35px' }}
                >
                    <span
                        className="spinner-grow spinner-grow-sm"
                        role="status"
                        aria-hidden="true"
                        style={{
                            verticalAlign: 'baseline',
                        }}
                    />
                    &nbsp;&nbsp;Please wait while the transaction is confirmed.
                </Alert>
            );
        }
        if (templeWalletError) {
            return (
                <Alert
                    color="danger"
                    isOpen={templeWalletError}
                    style={{ width: '100%', marginTop: '-35px' }}
                    toggle={() => {
                        console.log(templeWalletError);
                        this.setState({ templeWalletError: false });
                    }}
                >
                    Error: &nbsp;Temple wallet not detected, please install
                    temple wallet.
                </Alert>
            );
        } else return [];
    };
    render() {
        const {
            onGoingBet,
            currentCycle,
            network,
            currentXTZPrice,
            currentPriceRanges,
            stakedPriceRange,
            fetchingCurrentPriceRanges,
        } = this.props;
        const { showWarningAlert, templeWalletError } = this.state;
        const ranges = currentPriceRanges[network].map((elem) => {
            let range;
            if (elem.low !== elem.high) {
                if(elem.high < 0 || elem.low < 0)
                    {
                        if(elem.high === 0 )
                        {
                            range = `Down to ${
                                (-1 * elem.low/100
                            ).toFixed(2)}%`;
                        }
                        else
                        {
                            range = `Down ${(
                                -1 * elem.high /100
                            ).toFixed(2)}% - ${
                                (-1 * elem.low/100
                            ).toFixed(2)}%`;
                        }
                    }
                    else
                    {
                        if(elem.low === 0 )
                        {
                            range = `Up to ${
                                (elem.high/100
                            ).toFixed(2)}%`;
                        }
                        else
                        {
                            range = `Up ${(
                                elem.low /100
                            ).toFixed(2)}% - ${
                                (elem.high/100
                            ).toFixed(2)}%`;
                        }
                    }
            }
            if (elem.low === elem.high && elem.low < 0) {
                range = `Down ${(
                    -1 * elem.low/100
                ).toFixed(2)}% or More`;
            }
            if (elem.low === elem.high && elem.low > 0) {
                range = `Up ${(
                    elem.high/100
                ).toFixed(2)}% or More`;;
            }
            return (
                <option
                    className="selector"
                    key={range}
                    value={`${elem.low}~${elem.high}`}
                >
                    {range}
                </option>
            );
        });
        return (
            <div className="banner">
                <Alert
                    color="warning"
                    isOpen={showWarningAlert}
                    toggle={() => {
                        this.setState({ showWarningAlert: false });
                    }}
                    className="caution-banner"
                    style={{
                        borderRadius: '0px',
                    }}
                >
                    *Caution: Underlying smart-contracts have not been audited
                    by a third party.
                </Alert>
                <div className="container">
                    <Header {...this.props} />
                    <div className="banner-content-container">
                        <h1
                            className="banner-heading"
                            style={{ maxWidth: '550px' }}
                        >
                            Predict and win great rewards <br /> without losing
                            your tez
                        </h1>
                        <div className="stakepool-banner-form-container">
                            {this.fetchBannerMessage()}
                            <div className="stakepool-banner-input-wrapper">
                                <label className="stakepool-banner-input-label">
                                    The current cycle{' '}
                                    {currentCycle[network].currentCycle || '00'}{' '}
                                    will be concluded in:
                                </label>
                                <div
                                    className="stakepool-banner-input"
                                    disabled="disabled"
                                    style={{
                                        backgroundColor: '#dee2e6',
                                        color: '#7d7e7e',
                                    }}
                                >
                                    <Countdown
                                        date={
                                            currentCycle[network].cycletime ||
                                            '000000'
                                        }
                                        key={
                                            currentCycle[network].cycletime ||
                                            '000000'
                                        }
                                        onComplete={() => {
                                            this.props.getCurrentCycle();
                                        }}
                                        className="stakepool-banner-input"
                                        disabled="disabled"
                                    />
                                </div>
                            </div>

                            <div className="stakepool-banner-input-wrapper">
                                <label className="stakepool-banner-input-label">
                                    <span
                                        className="info-icon"
                                        style={{ cursor: 'pointer' }}
                                        id={'info-icon-tooltip'}
                                    >
                                        &#9432;
                                    </span>
                                    <Tooltip
                                        placement="bottom"
                                        isOpen={this.state.refPriceTooltipOpen}
                                        target="info-icon-tooltip"
                                        toggle={() =>
                                            this.toggleTooltip(
                                                'refPriceTooltipOpen'
                                            )
                                        }
                                    >
                                        {Title}
                                    </Tooltip>
                                    &nbsp;&nbsp;Reference price of XTZ/USD:
                                </label>
                                <input
                                    className="stakepool-banner-input"
                                    type="text"
                                    disabled="disabled"
                                    value={`$ ${currentXTZPrice}`}
                                />
                            </div>

                            <div className="stakepool-banner-input-wrapper">
                                <label className="stakepool-banner-input-label">
                                    <span
                                        className="info-icon"
                                        style={{ cursor: 'pointer' }}
                                        id={'stake-amt-icon-tooltip'}
                                    >
                                        &#9432;
                                    </span>
                                    <Tooltip
                                        placement="bottom"
                                        isOpen={this.state.stakeAmtTooltipOpen}
                                        target="stake-amt-icon-tooltip"
                                        toggle={() =>
                                            this.toggleTooltip(
                                                'stakeAmtTooltipOpen'
                                            )
                                        }
                                    >
                                        Maximum allowed limit to stake is 10 tz
                                    </Tooltip>
                                    &nbsp;&nbsp;Enter the amount you want to
                                    stake:
                                </label>
                                <span className="bet-amount-conatiner">
                                    <input
                                        name="betAmount"
                                        className="stakepool-banner-input"
                                        type="number"
                                        placeholder="Enter your stake price"
                                        value={this.props.betAmount}
                                        max={10}
                                        onChange={(e) =>
                                            this.props.handlePriceChange(e)
                                        }
                                    />
                                    <img
                                        src={tzIcon}
                                        className="tz-icon"
                                        alt=""
                                    />
                                </span>
                            </div>

                            <div className="stakepool-banner-input-wrapper">
                                <label className="stakepool-banner-input-label">
                                    I predict the price of XTZ to be:
                                </label>
                                <select
                                    name="stakedPriceRange"
                                    className="stakepool-banner-input"
                                    type="select"
                                    placeholder="Price of XTZ"
                                    value={stakedPriceRange}
                                    onChange={(e) =>
                                        this.props.handlePriceChange(e)
                                    }
                                >
                                    <option
                                        className="selector"
                                        disabled
                                        value="0"
                                    >
                                        ---- Please Select the stake price ----
                                    </option>
                                    {ranges}
                                </select>
                            </div>
                            <div className="row" style={{ width: '100%' }}>
                                <div
                                    className="col-md-6 "
                                    style={{ textAlign: 'right' }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-lg staking-options-button banner-button"
                                        onClick={() =>
                                            this.props.handleScolling(
                                                'stakeing-options',
                                                1000
                                            )
                                        }
                                    >
                                        Staking Options
                                    </button>
                                </div>
                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg banner-button"
                                        disabled={
                                            fetchingCurrentPriceRanges ||
                                            onGoingBet ||
                                            templeWalletError
                                        }
                                        onClick={() =>
                                            this.props.handleAlertShow()
                                        }
                                    >
                                        {onGoingBet ? (
                                            <>
                                                <span
                                                    className="spinner-grow spinner-grow-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    style={{
                                                        verticalAlign:
                                                            'baseline',
                                                    }}
                                                />
                                                &nbsp;&nbsp;Please wait...
                                            </>
                                        ) : (
                                            'Stake now'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
