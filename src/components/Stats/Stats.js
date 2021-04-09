import React, { Fragment, Component } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

export default class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total_bet_amount: '0',
            staking_start_range: '0',
            staking_end_range: '0',
            total_pool_rewards_won: '0',
            total_amount_in_winning_range: '0',
            staking_cycle_start: '0',
            staking_cycle_end: '0',
            winners_roi: '0',
        };
    }
    componentDidMount() {
        console.log(this.props.location.pathname);
    }
    render() {
        const {
            total_bet_amount,
            staking_start_range,
            staking_end_range,
            winners_roi,
            total_pool_rewards_won,
            total_amount_in_winning_range,
            staking_cycle_start,
            staking_cycle_end,
        } = this.state;
        return (
            <Fragment>
                <div className="main-page-container">
                    <div className="banner">
                        <div className="container">
                            <Header />
                            <div className="banner-content-container">
                                <h1 className="banner-heading">
                                    Previous Staking Period Cycle{' '}
                                    {staking_cycle_start} - {staking_cycle_end}
                                </h1>
                                <div className="stakepool-banner-form-container stats-container">
                                    <div className="row">
                                        <div className="col-sm-6 info-cards-stats">
                                            <div className="card shadow-lg bg-white rounded">
                                                <div className="card-body">
                                                    <p className="card-text">
                                                        Winning price range
                                                    </p>
                                                    <p className="card-text">
                                                        Between $
                                                        {staking_start_range} -
                                                        ${staking_end_range}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 info-cards-stats">
                                            <div className="card shadow-lg bg-white rounded">
                                                <div className="card-body">
                                                    <p className="card-text">
                                                        Total bet amount
                                                    </p>
                                                    <p className="card-text">
                                                        {total_bet_amount} ꜩ
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 info-cards-stats">
                                            <div className="card shadow-lg bg-white rounded">
                                                <div className="card-body">
                                                    <p className="card-text">
                                                        Winners aggregate ROI
                                                    </p>
                                                    <p className="card-text">
                                                        {winners_roi} %
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 info-cards-stats">
                                            <div className="card shadow-lg bg-white rounded">
                                                <div className="card-body">
                                                    <p className="card-text">
                                                        Total pool rewards won
                                                    </p>
                                                    <p className="card-text">
                                                        {total_pool_rewards_won}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 info-cards-stats">
                                            <div className="card shadow-lg bg-white rounded">
                                                <div className="card-body">
                                                    <p className="card-text">
                                                        Total amount in winning
                                                        range
                                                    </p>
                                                    <p className="card-text">
                                                        {
                                                            total_amount_in_winning_range
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer {...this.props} />
                </div>
            </Fragment>
        );
    }
}
