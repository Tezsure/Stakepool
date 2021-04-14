/* eslint-disable jsx-a11y/heading-has-content */
import React, { Component } from 'react';
import StakingCards from './StakingCards';

export default class StakeingOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showOptions: 4,
        };
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
                <ul className="stakeing-options-list">
                    <StakingCards {...this.state} {...this.props} />
                </ul>
            </section>
        );
    }
}
