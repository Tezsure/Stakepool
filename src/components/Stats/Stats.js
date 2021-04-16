import React, { Fragment, Component } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getLastCycleStats } from '../../apis/statsApis';
import { getCurrentCycle, fetchCurrentTzPrice } from '../../apis/homepageApis';

export default class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total_bet_amount: '0',
            staking_start_range: '0',
            staking_end_range: '0',
            total_pool_rewards_won: '0',
            total_amount_in_winning_range: '0',
            winners_roi: '0',
            network: this.setNetwork(),
            currentCycleData: {
                mainnet: 0,
                testnet: 0,
            },
            fetchingData: true,
        };
    }

    getLastCycleStats = async (currentCycleData, network) => {
        const { currentXTZPrice } = this.state;
        const API_RESPONSE = await getLastCycleStats(
            currentCycleData.currentCycle,
            network
        );
        if (API_RESPONSE.success) {
            const { lowPrice, highPrice } = API_RESPONSE.data.winningPriceRange;
            const {
                totalBetAmount,
                totalAmountInWinningRange,
                totalPoolRewardWon,
                aggregateROIPercent,
            } = API_RESPONSE.data;
            const staking_start_range = (
                (currentXTZPrice * 100 + lowPrice / 100) /
                100
            ).toFixed(2);
            const staking_end_range = (
                (currentXTZPrice * 100 + highPrice / 100) /
                100
            ).toFixed(2);
            const total_bet_amount = totalBetAmount / Math.pow(10, 6);
            const total_amount_in_winning_range =
                totalAmountInWinningRange / Math.pow(10, 6);
            const total_pool_rewards_won = totalPoolRewardWon / Math.pow(10, 6);
            const winners_roi = aggregateROIPercent.toFixed(2);
            return this.setState({
                staking_start_range,
                staking_end_range,
                total_bet_amount,
                total_amount_in_winning_range,
                total_pool_rewards_won,
                winners_roi,
                fetchingData: false,
            });
        } else {
            this.setState({
                fetchingData: false,
            });
        }
    };

    getCurrentCycle = async () => {
        const { currentCycleData, network } = this.state;
        const API_RESPONSE = await getCurrentCycle(network);
        if (API_RESPONSE[0].sucess && API_RESPONSE[1].sucess) {
            currentCycleData[network] = API_RESPONSE[0];
            const currentXTZPrice = API_RESPONSE[1].currentprice;
            this.setState(
                {
                    currentCycleData,
                    currentXTZPrice,
                },
                () => this.getLastCycleStats(currentCycleData[network], network)
            );
        }
    };

    setNetwork = () => {
        const path = this.props.location.pathname;
        const network = path === '/mainnet-stats' ? 'mainnet' : 'testnet';
        return network;
    };

    componentDidMount() {
        const { network } = this.state;
        this.getCurrentCycle(network);
    }

    render() {
        const {
            total_bet_amount,
            staking_start_range,
            staking_end_range,
            winners_roi,
            total_pool_rewards_won,
            total_amount_in_winning_range,
            currentCycleData,
            network,
            fetchingData,
        } = this.state;
        return (
            <Fragment>
                <div className="main-page-container">
                    <div className="banner">
                        <div className="container">
                            <Header />
                            <div className="banner-content-container">
                                <h1 className="banner-heading">
                                    Previous Staking Period <br />
                                    Cycle{' '}
                                    {currentCycleData[network].currentCycle -
                                        2 || 0}{' '}
                                    -{' '}
                                    {currentCycleData[network].currentCycle ||
                                        0}
                                </h1>
                                <div className="stakepool-banner-form-container stats-container">
                                    <div className="row">
                                        <div className="col-sm-6 info-cards-stats">
                                            <div className="card shadow-lg bg-white rounded">
                                                <div className="card-body">
                                                    {fetchingData ? (
                                                        <>
                                                            <SkeletonTheme
                                                                color="#2d7cf7"
                                                                highlightColor="#88b7e0"
                                                            >
                                                                <p>
                                                                    <Skeleton
                                                                        count={
                                                                            3
                                                                        }
                                                                    />
                                                                </p>
                                                            </SkeletonTheme>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="card-text">
                                                                Winning price
                                                                range
                                                            </p>
                                                            <p className="card-text">
                                                                Between $
                                                                {
                                                                    staking_start_range
                                                                }{' '}
                                                                - $
                                                                {
                                                                    staking_end_range
                                                                }
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 info-cards-stats">
                                            <div className="card shadow-lg bg-white rounded">
                                                <div className="card-body">
                                                    {fetchingData ? (
                                                        <SkeletonTheme
                                                            color="#2d7cf7"
                                                            highlightColor="#88b7e0"
                                                        >
                                                            <p>
                                                                <Skeleton
                                                                    count={3}
                                                                />
                                                            </p>
                                                        </SkeletonTheme>
                                                    ) : (
                                                        <>
                                                            <p className="card-text">
                                                                Total bet amount
                                                            </p>
                                                            <p className="card-text">
                                                                {
                                                                    total_bet_amount
                                                                }{' '}
                                                                ꜩ
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 info-cards-stats">
                                            <div className="card shadow-lg bg-white rounded">
                                                <div className="card-body">
                                                    {fetchingData ? (
                                                        <SkeletonTheme
                                                            color="#2d7cf7"
                                                            highlightColor="#88b7e0"
                                                        >
                                                            <p>
                                                                <Skeleton
                                                                    count={3}
                                                                />
                                                            </p>
                                                        </SkeletonTheme>
                                                    ) : (
                                                        <>
                                                            <p className="card-text">
                                                                Winners
                                                                aggregate ROI
                                                            </p>
                                                            <p className="card-text">
                                                                {winners_roi} %
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 info-cards-stats">
                                            <div className="card shadow-lg bg-white rounded">
                                                <div className="card-body">
                                                    {fetchingData ? (
                                                        <SkeletonTheme
                                                            color="#2d7cf7"
                                                            highlightColor="#88b7e0"
                                                        >
                                                            <p>
                                                                <Skeleton
                                                                    count={3}
                                                                />
                                                            </p>
                                                        </SkeletonTheme>
                                                    ) : (
                                                        <>
                                                            <p className="card-text">
                                                                Total pool
                                                                rewards won
                                                            </p>
                                                            <p className="card-text">
                                                                {
                                                                    total_pool_rewards_won
                                                                }
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 info-cards-stats">
                                            <div className="card shadow-lg bg-white rounded">
                                                <div className="card-body">
                                                    {fetchingData ? (
                                                        <SkeletonTheme
                                                            color="#2d7cf7"
                                                            highlightColor="#88b7e0"
                                                        >
                                                            <p>
                                                                <Skeleton
                                                                    count={3}
                                                                />
                                                            </p>
                                                        </SkeletonTheme>
                                                    ) : (
                                                        <>
                                                            <p className="card-text">
                                                                Total amount in
                                                                winning range
                                                            </p>
                                                            <p className="card-text">
                                                                {
                                                                    total_amount_in_winning_range
                                                                }{' '}
                                                                ꜩ
                                                            </p>
                                                        </>
                                                    )}
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
