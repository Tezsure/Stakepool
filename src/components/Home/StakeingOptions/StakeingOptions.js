/* eslint-disable no-useless-constructor */
/* eslint-disable jsx-a11y/heading-has-content */
import React, { Component } from 'react';
import StakingCards from './StakingCards';

export default class StakeingOptions extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <section
                className="container stakeing-options-container"
                id="stakeing-options"
            >
                <div className="section-heading-container">
                    <h2 className="section-heading">Staking Options</h2>
                </div>
                <ul className="stakeing-options-list">
                    <StakingCards {...this.state} {...this.props} />
                </ul>
            </section>
        );
    }
}
