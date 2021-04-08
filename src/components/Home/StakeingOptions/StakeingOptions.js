import React, { Component } from 'react';
import staking from '../../../assets/images/stakeing.png';
import dropdown from '../../../assets/images/down.jpeg';

export default class StakeingOptions extends Component {
    render() {
        return (
            <section
                className="container stakeing-options-container"
                id="stakeing-options"
            >
                <div className="section-heading-container">
                    <h2 className="section-heading">Staking Options</h2>
                    <button className="see-all-options-btn">Show More</button>
                </div>
                <ul className="stakeing-options-list">
                    <li className="stakeing-option-item">
                        <div className="stakeing-option shadow-sm bg-white rounded">
                            <div className="stakeing-option-img-container">
                                <img
                                    src={staking}
                                    className="stakeing-option-img"
                                    alt="Stakeing Option"
                                />
                            </div>
                            <div className="predicted-price">
                                <p className="pridicted-price-text">
                                    Predicted Price Below $3.04
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
                    <li className="stakeing-option-item">
                        <div className="stakeing-option shadow-sm bg-white rounded">
                            <div className="stakeing-option-img-container">
                                <img
                                    src={staking}
                                    className="stakeing-option-img"
                                    alt="Stakeing Option"
                                />
                            </div>
                            <div className="predicted-price">
                                Predicted Price Below $3.04
                            </div>
                        </div>
                    </li>

                    <li className="stakeing-option-item">
                        <div className="stakeing-option shadow-sm bg-white rounded">
                            <div className="stakeing-option-img-container">
                                <img
                                    src={staking}
                                    className="stakeing-option-img"
                                    alt="Stakeing Option"
                                />
                            </div>
                            <div className="predicted-price">
                                Predicted Price Below $3.04
                            </div>
                        </div>
                    </li>

                    <li className="stakeing-option-item">
                        <div className="stakeing-option shadow-sm bg-white rounded">
                            <div className="stakeing-option-img-container">
                                <img
                                    src={staking}
                                    className="stakeing-option-img"
                                    alt="Stakeing Option"
                                />
                            </div>
                            <div className="predicted-price">
                                Predicted Price Below $3.04
                            </div>
                        </div>
                    </li>
                </ul>
            </section>
        );
    }
}
