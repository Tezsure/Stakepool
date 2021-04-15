import React, { Fragment, Component } from 'react';
import Banner from './Banner/Banner';
import StackeingOptions from './StakeingOptions/StakeingOptions';
import Footer from '../Footer/Footer';
import swal from 'sweetalert';
import {
    placeBetAPI,
    doScrolling,
    getCurrentCycle,
    fetchCurrentTzPrice,
    getReferencePriceAndRanges,
} from '../../apis/homepageApis';

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
        };
    }
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
            this.setState({
                currentPriceRanges,
                fetchingCurrentPriceRanges: false,
            });
        }
    };
    placeBet = async () => {
        this.setState({ onGoingBet: true });
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
                swal({
                    title: 'Bet placed sucessfully',
                    text: 'Operation id: \n' + API_RESPONSE.operationId,
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
        const API_RESPONSE = await Promise.all([
            getCurrentCycle(network),
            fetchCurrentTzPrice(),
        ]);
        if (API_RESPONSE[0].sucess && API_RESPONSE[1].sucess) {
            currentCycle[network] = API_RESPONSE[0];
            const currentXTZPrice = API_RESPONSE[1].currentprice;
            this.setState(
                {
                    currentCycle,
                    currentXTZPrice,
                },
                () => this.getReferencePriceAndRanges()
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
                    />
                    <StackeingOptions
                        {...this.props}
                        {...this.state}
                        handleStakingOptionsSelect={
                            this.handleStakingOptionsSelect
                        }
                    />
                    <Footer {...this.props} />
                </div>
            </Fragment>
        );
    }
}
