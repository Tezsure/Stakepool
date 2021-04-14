import React, { Component } from 'react';
import Header from '../../Header/Header';
import Countdown from 'react-countdown-now';
import {
    doScrolling,
    getCurrentCycle,
    fetchCurrentTzPrice,
    getReferencePriceAndRanges,
} from '../../../apis/homepageApis';

export default class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCycle: {
                mainnet: '',
                testnet: '',
            },
            network: this.setNetwork(),
            currentXTZPrice: '00',
            currentPriceRanges: {
                mainnet: [],
                testnet: [],
            },
        };
    }
    setNetwork = () => {
        const path = this.props.location.pathname;
        const network = path === '/mainnet' ? 'mainnet' : 'testnet';
        console.log(network);
        return network;
    };
    getReferencePriceAndRanges = async () => {
        const { currentCycle, network } = this.state;
        console.log(currentCycle[network].cycletime);
        const API_RESPONSE = await getReferencePriceAndRanges(
            currentCycle[network],
            network
        );
        console.log(API_RESPONSE);
    };
    getCurrentCycle = async (network) => {
        const { currentCycle } = this.state;
        const API_RESPONSE = await Promise.all([
            getCurrentCycle(network),
            fetchCurrentTzPrice(),
        ]);
        console.log(API_RESPONSE);
        // currentCycle[network] = API_RESPONSE[0].currentCycle;
        // const currentXTZPrice = API_RESPONSE[1].currentprice;
        // this.setState(
        //     {
        //         currentCycle,
        //         currentXTZPrice,
        //     },
        //     () => this.getReferencePriceAndRanges()
        // );
        this.setState({currentCycle : {mainnet :  0 , testnet : API_RESPONSE[0].currentCycle} , currentXTZPrice : API_RESPONSE[1].currentprice})
        this.getReferencePriceAndRanges();
    };
    componentDidMount() {
        const { network } = this.state;
        this.getCurrentCycle(network);
    }
    handleScolling = (element, duration) => {
        doScrolling(element, duration);
    };
    render() {
        const { currentCycle, network, currentXTZPrice } = this.state;
        console.log(currentCycle[network].cycletime);

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
                                            this.getCurrentCycle();
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
                                >
                                    <option className="selector" disabled>
                                        ---- Please Select the stake price----
                                    </option>
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
                                            this.handleScolling(
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
