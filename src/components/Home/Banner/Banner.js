import React, { Component } from 'react';
import Header from '../../Header/Header';
import Countdown from 'react-countdown-now';
import { Tooltip } from 'reactstrap';
const tzIcon = require('../../../assets/images/Path 453@2x.png');

const Title =
    'Reference price is the price of xtz in USD deduced at the starting of each cycle and all bets are placed against this reference price';

export default class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltipOpen: false,
        };
    }
    toggleTooltip = () => {
        const { tooltipOpen } = this.state;
        this.setState({ tooltipOpen: !tooltipOpen });
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
        const ranges = currentPriceRanges[network].map((elem) => {
            let range;
            if (elem.low !== elem.high) {
                range = `In the range of $${
                    (currentXTZPrice + (currentXTZPrice * (elem.low / 100)/ 100)
                ).toFixed(3)} - $${
                    (currentXTZPrice + (currentXTZPrice * (elem.high / 100)/ 100)
                ).toFixed(3)}`;
            }
            if (elem.low === elem.high && elem.low < 0) {
                range = `Below $${(
                    currentXTZPrice + (currentXTZPrice * (elem.low / 100)/ 100)
                ).toFixed(3)}`;
            }
            if (elem.low === elem.high && elem.low > 0) {
                range = `Above $${(
                    currentXTZPrice + (currentXTZPrice * (elem.high / 100)/ 100)
                ).toFixed(3)}`;
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
                <div className="container">
                    <Header />
                    <div className="banner-content-container">
                        <h1
                            className="banner-heading"
                            style={{ maxWidth: '550px' }}
                        >
                            Predict and win great rewards <br /> without losing
                            your tez
                        </h1>
                        <div className="stakepool-banner-form-container ">
                            <div className="network-container">
                                <div
                                    className="network-tab "
                                    style={{ textAlign: 'center' }}
                                >
                                    <span
                                        className={
                                            network === 'mainnet'
                                                ? 'sucess-badge'
                                                : 'warning-badge'
                                        }
                                    />
                                    &nbsp; Current network:{' '}
                                    <span className="network-name">
                                        {network}
                                    </span>
                                </div>
                            </div>
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
                                        isOpen={this.state.tooltipOpen}
                                        target="info-icon-tooltip"
                                        toggle={() => this.toggleTooltip()}
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
                                    I want to stake:
                                </label>
                                <span className="bet-amount-conatiner">
                                    <input
                                        name="betAmount"
                                        className="stakepool-banner-input"
                                        type="number"
                                        placeholder="Enter your stake price"
                                        value={this.props.betAmount}
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

                            <span className="banner-footer-container">
                                <p className="form-footer-text">
                                    *Caution: Underlying smart-contracts have
                                    not been audited by a third party.
                                </p>
                            </span>

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
                                            onGoingBet
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
