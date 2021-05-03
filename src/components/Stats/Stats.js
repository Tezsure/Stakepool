import React, { Fragment, Component } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import StakepoolChart from './StakepoolChart';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { getStats } from '../../apis/statsApis';
import { getCurrentCycle } from '../../apis/homepageApis';

export default class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statsResponse: [],
            network: this.setNetwork(),
            currentCycleData: {
                mainnet: 0,
                testnet: 0,
            },
            fetchingData: true,
        };
    }

    getStats = async () => {
        const { currentCycleData, network } = this.state;
        const API_RESPONSE = await getStats(
            currentCycleData[network].currentCycle,
            network
        );
        if (API_RESPONSE.success) {
            return this.setState({
                statsResponse: API_RESPONSE.response,
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
        if (API_RESPONSE.sucess) {
            currentCycleData[network] = API_RESPONSE;
            this.setState(
                {
                    currentCycleData,
                },
                () => this.getStats(currentCycleData[network], network)
            );
        }
    };

    setNetwork = () => {
        const path = this.props.location.pathname;
        const network = path === '/mainnet-stats' ? 'mainnet' : 'testnet';
        return network;
    };

    componentDidMount() {
        this.getCurrentCycle();
    }

    render() {
        const { currentCycleData, network, fetchingData } = this.state;
        const minValue = currentCycleData[network].currentCycle - 10;
        const maxValue = currentCycleData[network].currentCycle - 1;
        return (
            <Fragment>
                <div className="main-page-container">
                    <div className="banner">
                        <div className="container">
                            <Header {...this.props} />
                            <div className="banner-content-container">
                                <h1 className="banner-heading">
                                    Cycle {minValue || 0} - {maxValue || 0}
                                </h1>
                                <div className="stakepool-banner-form-container stats-container">
                                    <div className="row">
                                        <div className="col-sm-12 info-cards-stats">
                                            {fetchingData ? (
                                                <div style={{ lineHeight: 3 }}>
                                                    <SkeletonTheme>
                                                        <Skeleton height={80} />
                                                        <br />
                                                        <Skeleton count={3} />
                                                    </SkeletonTheme>
                                                </div>
                                            ) : (
                                                <StakepoolChart
                                                    {...this.state}
                                                />
                                            )}
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
