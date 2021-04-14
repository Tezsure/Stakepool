import React, { Component } from 'react';
import Header from '../../Header/Header';
import Countdown from 'react-countdown-now';

export default class Banner extends Component {
    render() {
        const {
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
                        <h1 className="banner-heading">
                            Earn a little extra on your staking rewards
                        </h1>
                        <div className="stakepool-banner-form-container ">
                            <div className="stakepool-banner-input-wrapper">
                                <label className="stakepool-banner-input-label">
                                    The current Cycle{' '}
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
                                    Current price of XTZ/USD:
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
                                <input
                                    className="stakepool-banner-input"
                                    type="text"
                                    placeholder="Enter your stake price"
                                />
                            </div>

                            <div className="stakepool-banner-input-wrapper">
                                <label className="stakepool-banner-input-label">
                                    I predict the price of XTZ to be:
                                </label>
                                <select
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
                                        ---- Please Select the stake price----
                                    </option>
                                    {ranges}
                                </select>
                            </div>

                            <p className="form-footer-text">
                                By submitting this form you agree to our terms
                                and conditions and our Privacy Policy which
                                explains how we may collect, use and disclose
                                your personal information including to third
                                parties.
                            </p>

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
                                        disabled={fetchingCurrentPriceRanges}
                                    >
                                        Stake now
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
