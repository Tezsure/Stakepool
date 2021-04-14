import React, { Fragment, Component } from 'react';
import Banner from './Banner/Banner';
import StackeingOptions from './StakeingOptions/StakeingOptions';
import { TempleWallet } from '@temple-wallet/dapp';
import Footer from '../Footer/Footer';
import {
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
            fetchingCurrentPriceRanges: false,
        };
    }
    handlePriceChange = (event) => {
        this.setState({ stakedPriceRange: event.target.value });
    };
    setNetwork = () => {
        const path = this.props.location.pathname;
        const network = path === '/mainnet' ? 'mainnet' : 'testnet';
        console.log(network);
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
        //const available = await TempleWallet.isAvailable();
        console.log('Clicked');
        const wallet = new TempleWallet('Stakepool');
        await wallet.connect('edo2net', { forcePermission: true });
        const tezos = wallet.toTezos();
        const contractInstance = await tezos.wallet.at(
            'KT1DDnjzQhA25Vjm3AwqVWGFskzoW3QARKsE'
        );

        // .placeBet (high,low)
        // .send (amount)
        const operation = await contractInstance.methods
                    .placeBet(250, 0)
                    .send({ amount: 8, mutez: false });
        console.log('Operation Injected awaiting confirmation');
        const confirmation = await operation.confirmation();
        console.log(operation , confirmation);
    }
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
                        placeBet = {this.placeBet}
                    />
                    <StackeingOptions {...this.props} {...this.state} />
                    <Footer {...this.props} />
                </div>
            </Fragment>
        );
    }
}
