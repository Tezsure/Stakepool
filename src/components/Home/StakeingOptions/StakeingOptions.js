/* eslint-disable jsx-a11y/heading-has-content */
import React, { Component } from 'react';
import staking from '../../../assets/images/stakeing.png';
import dropdown from '../../../assets/images/down.jpeg';
import Skeleton from 'react-loading-skeleton';

export default class StakeingOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showOptions: 4,
        };
        this.getCards = this.getCards.bind(this);
    }
    handleShowMore = () => {
        const { showOptions } = this.state;
        const {
            network,
            currentPriceRanges,
            fetchingCurrentPriceRanges,
        } = this.props;
        if (showOptions === 4 && !fetchingCurrentPriceRanges) {
            this.setState({ showOptions: currentPriceRanges[network].length });
        } else {
            this.setState({ showOptions: 4 });
        }
    };
    getCards() {
        const {
            network,
            currentXTZPrice,
            currentPriceRanges,
            fetchingCurrentPriceRanges,
        } = this.props;
        let cards = [];
        let i = 0;
        if (!fetchingCurrentPriceRanges) {
            while (
                i < currentPriceRanges[network].length &&
                i < this.state.showOptions
            ) {
                let elem = currentPriceRanges[network][i];
                let innerText;
                if (elem.low !== elem.high) {
                    innerText = `Price prediction between $ ${(
                        (currentXTZPrice * 100 + elem.low / 100) /
                        100
                    ).toFixed(2)} - $ ${(
                        (currentXTZPrice * 100 + elem.high / 100) /
                        100
                    ).toFixed(2)}`;
                }
                if (elem.low === elem.high && elem.low < 0) {
                    innerText = `Price prediction below $ ${(
                        (currentXTZPrice * 100 + elem.low / 100) /
                        100
                    ).toFixed(2)}`;
                }
                if (elem.low === elem.high && elem.low > 0) {
                    innerText = `Price prediction above $ ${(
                        (currentXTZPrice * 100 + elem.low / 100) /
                        100
                    ).toFixed(2)}`;
                }
                cards.push(
                    <li className="stakeing-option-item" key={innerText}>
                        <div
                            className="stakeing-option shadow-sm bg-white rounded"
                            style={{ height: '100%' }}
                        >
                            <div className="stakeing-option-img-container">
                                <img
                                    src={staking}
                                    className="stakeing-option-img"
                                    alt="Stakeing Option"
                                />
                            </div>
                            <div className="predicted-price">
                                <p className="pridicted-price-text">
                                    {innerText}
                                </p>
                                <span className="dropdown-image-container">
                                    <img
                                        src={dropdown}
                                        className="stakeing-dropdown-img"
                                        alt="Stakeing Dropdown"
                                    />
                                </span>
                            </div>
                        </div>
                    </li>
                );
                ++i;
            }
        } else {
            while (i < this.state.showOptions) {
                cards.push(
                    <li className="stakeing-option-item" key={i}>
                        <div
                            className="stakeing-option shadow-sm bg-white rounded"
                            style={{ height: '100%' }}
                        >
                            <div className="stakeing-option-img-container">
                                <Skeleton />
                            </div>
                            <Skeleton count={5} />
                        </div>
                    </li>
                );
                ++i;
            }
        }
        return cards;
    }
    render() {
        const { showOptions } = this.state;
        const {
            network,
            currentPriceRanges,
            fetchingCurrentPriceRanges,
        } = this.props;

        return (
            <section
                className="container stakeing-options-container"
                id="stakeing-options"
            >
                <div className="section-heading-container">
                    <h2 className="section-heading">Staking Options</h2>
                    <button
                        className="see-all-options-btn"
                        onClick={() => this.handleShowMore()}
                        disabled={fetchingCurrentPriceRanges}
                    >
                        {currentPriceRanges[network].length > showOptions ||
                        fetchingCurrentPriceRanges
                            ? 'Show More'
                            : 'Show Less'}
                    </button>
                </div>
                <ul className="stakeing-options-list">{this.getCards()}</ul>
            </section>
        );
    }
}
