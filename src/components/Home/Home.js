import React, { Fragment, Component } from 'react';
import Banner from './Banner/Banner';
import StackeingOptions from './StakeingOptions/StakeingOptions';
import Footer from '../Footer/Footer';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
import {
    placeBetAPI,
    doScrolling,
    getCurrentCycle,
    getReferencePriceAndRanges,
} from '../../apis/homepageApis';
import { Container } from 'reactstrap';
const { TZSTATS_DASHBOARD } = require('../../apis/config');

export default class Home extends Component {
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
            stakedPriceRange: '0',
            betAmount: '1',
            fetchingCurrentPriceRanges: true,
            onGoingBet: false,
            alertShow: false,
            errorMsg: '',
            showError: false,
        };
    }
    handleAlertShow = () => {
        const { stakedPriceRange, betAmount } = this.state;
        if (stakedPriceRange === '0') {
            swal({
                title: 'Cannot place bet',
                text: 'Please select predicted price range from the dropdown',
                icon: 'error',
                button: 'Okay',
            });
        } else if (parseInt(betAmount, 10) === 0) {
            swal({
                title: 'Cannot place bet',
                text:
                    'Invalid bet amount please enter amount greater than zero',
                icon: 'error',
                button: 'Okay',
            });
        } else {
            this.setState({
                alertShow: true,
            });
        }
    };
    handleStakingOptionsSelect = (stakedPriceRange) => {
        this.setState({ stakedPriceRange });
    };
    handlePriceChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    setNetwork = () => {
        const path = this.props.location.pathname;
        const network = path === '/mainnet' ? 'mainnet' : 'testnet';
        return network;
    };
    getReferencePriceAndRanges = async () => {
        const { currentCycle, network, currentPriceRanges } = this.state;
        this.setState({ fetchingCurrentPriceRanges: true });
        const API_RESPONSE = await getReferencePriceAndRanges(
            currentCycle[network].currentCycle,
            network
        );
        if (API_RESPONSE.sucess) {
            currentPriceRanges[network] = API_RESPONSE.data.ranges;
            const currentXTZPrice =
                API_RESPONSE.data.referencePrice / Math.pow(10, 3);
            this.setState({
                currentXTZPrice,
                currentPriceRanges,
                fetchingCurrentPriceRanges: false,
            });
        }
    };
    placeBet = async () => {
        this.setState({ onGoingBet: true, alertShow: false });
        const { stakedPriceRange, network, betAmount } = this.state;
        if (stakedPriceRange === '0') {
            swal({
                title: 'Cannot place bet',
                text: 'Please select predicted price range from the dropdown',
                icon: 'error',
                button: 'Okay',
            });
        } else if (parseInt(betAmount, 10) === 0) {
            swal({
                title: 'Cannot place bet',
                text:
                    'Invalid bet amount please enter amount greater than zero',
                icon: 'error',
                button: 'Okay',
            });
        } else {
            const API_RESPONSE = await placeBetAPI(
                network,
                betAmount,
                stakedPriceRange
            );
            if (API_RESPONSE.sucess) {
                const URL = `${TZSTATS_DASHBOARD[network]}/${API_RESPONSE.operationId}`;
                const htmlContent = document.createElement('div');
                htmlContent.innerHTML = `Operation id: <a href='${URL}' style='word-break: break-all' target='_blank'>${API_RESPONSE.operationId}</a>`;
                swal({
                    title: 'Bet placed sucessfully',
                    content: htmlContent,
                    icon: 'success',
                    button: 'Okay',
                });
            } else {
                swal({
                    title: 'Cannot place bet',
                    text: API_RESPONSE.error.message,
                    icon: 'error',
                    button: 'Okay',
                });
            }
        }
        this.setState({ onGoingBet: false });
    };
    getCurrentCycle = async (network) => {
        const { currentCycle } = this.state;
        const API_RESPONSE = await getCurrentCycle(network);
        if (API_RESPONSE.sucess) {
            currentCycle[network] = API_RESPONSE;
            this.setState({ currentCycle }, () =>
                this.getReferencePriceAndRanges()
            );
        }
    };
    componentDidMount() {
        const { network } = this.state;
        this.getCurrentCycle(network);
    }
    handleScolling = (element, duration) => {
        doScrolling(element, duration);
    };
    render() {
        const {
            stakedPriceRange,
            network,
            betAmount,
            currentCycle,
            currentPriceRanges,
        } = this.state;
        const low = parseInt(stakedPriceRange.split('~')[0], 10);
        const high = parseInt(stakedPriceRange.split('~')[1], 10);
        const betRange = currentPriceRanges[network].filter(
            (elem) => elem.low === low && elem.high === high
        );
        return (
            <Fragment>
                <div className="main-page-container">
                    <Banner
                        {...this.props}
                        {...this.state}
                        handlePriceChange={this.handlePriceChange}
                        handleScolling={this.handleScolling}
                        getCurrentCycle={this.getCurrentCycle}
                        placeBet={this.placeBet}
                        handleAlertShow={this.handleAlertShow}
                    />
                    <StackeingOptions
                        {...this.props}
                        {...this.state}
                        handleStakingOptionsSelect={
                            this.handleStakingOptionsSelect
                        }
                    />
                    <Footer {...this.props} />
                    {this.state.alertShow && (
                        <SweetAlert
                            info
                            showCancel
                            confirmBtnText="Confirm"
                            confirmBtnBsStyle="primary"
                            cancelBtnBsStyle="light"
                            title={'Staking Order Review!'}
                            onConfirm={() => this.placeBet()}
                            onCancel={() => {
                                this.setState({
                                    alertShow: false,
                                });
                            }}
                            dependencies={[
                                betRange,
                                currentCycle,
                                betAmount,
                                network,
                            ]}
                        >
                            {() => (
                                <Container
                                    style={{ margin: '35px 0px 0px 0px' }}
                                >
                                    <ul
                                        style={{
                                            color: '#748093',
                                        }}
                                    >
                                        <li
                                            style={{
                                                paddingBottom: '1vmax',
                                                textAlign: 'left',
                                            }}
                                        >
                                            Staked Amount: {betAmount || 0} XTZ
                                        </li>
                                        <li
                                            style={{
                                                paddingBottom: '1vmax',
                                                textAlign: 'left',
                                            }}
                                        >
                                            Staking period:{' '}
                                            {currentCycle[network].currentCycle}
                                            {' Cycle '}-{' '}
                                            {currentCycle[network]
                                                .currentCycle + 2}
                                            {' Cycle '}
                                        </li>
                                        <li
                                            style={{
                                                paddingBottom: '1vmax',
                                                textAlign: 'left',
                                            }}
                                        >
                                            Reward Return Cycle:{' '}
                                            {currentCycle[network]
                                                .currentCycle + 3}{' '}
                                            Cycle
                                        </li>
                                        <li
                                            style={{
                                                paddingBottom: '1vmax',
                                                textAlign: 'left',
                                            }}
                                        >
                                            Platform Usage Fee: 2% of the
                                            winning total reward pool
                                        </li>
                                        <li
                                            style={{
                                                paddingBottom: '1vmax',
                                                textAlign: 'left',
                                            }}
                                        >
                                            Expected Min ROI as per current
                                            active bets*:{' '}
                                            {betRange[0].rangeBasedRoi.estimatedRoi.toFixed(
                                                3
                                            )}
                                            %. *The mentioned ROI is only
                                            applicable if your prediction is
                                            right.Else your ROI would be 0%.
                                        </li>
                                    </ul>
                                </Container>
                            )}
                        </SweetAlert>
                    )}
                </div>
            </Fragment>
        );
    }
}
