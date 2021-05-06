import React, { Component } from 'react';
import staking from '../../../assets/images/stakeing.png';
import dropdown from '../../../assets/images/down.jpeg';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';

export default class Cards extends Component {
    state = {
        visible: false,
    };
    onVisibleChange = (visible) => {
        this.setState({
            visible,
        });
    };
    onDestroy = () => {
        this.setState({
            destroy: true,
        });
    };
    render() {
        const {
            currentCycle,
            cycleEndDate,
            rangeBasedRoi,
            network,
            innerText,
            low,
            high,
        } = this.props;
        const htmlComponent = (
            <>
                <ul
                    className="staking-cards-container"
                    style={{
                        width: '325px',
                        marginLeft: '-15px',
                        paddingRight: '15px',
                        paddingTop: '15px',
                    }}
                >
                    <li className="stakeing-cards-text">
                        The staking rewards are calculated for the cycles $
                        {currentCycle[network].currentCycle}- $
                        {currentCycle[network].currentCycle + 2}.
                    </li>
                    <li className="stakeing-cards-text">
                        A fee of 2% on your profits is taken for the usage of
                        the platform.
                    </li>
                    <li className="stakeing-cards-text">
                        If the price of XTZ is in this range at the end of your
                        staking period on ${cycleEndDate}, you will receive your
                        staking amount and a profit. If not, you only get back
                        your staking amount.
                    </li>
                    <li className="stakeing-cards-text">
                        Payout occurs at the end of cycle{' '}
                        {currentCycle[network].currentCycle + 2}
                    </li>
                    <li className="stakeing-cards-text">
                        The expected ROI for the given price range is $
                        {rangeBasedRoi.estimatedRoi.toFixed(3)} ꜩ
                    </li>
                </ul>
                <div
                    className="footer-card"
                    style={{
                        paddingTop: '0px',
                        textAlign: 'center',
                        paddingBottom: '10px',
                    }}
                >
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            this.props.doScrolling();
                            this.props.handleStakingOptionsSelect(
                                `${low}~${high}`
                            );
                            this.setState({ visible: false });
                        }}
                    >
                        Select
                    </button>
                </div>
            </>
        );
        return (
            <Tooltip
                animation="zoom"
                overlay={htmlComponent}
                placement="bottom"
            >
                <li
                    className="stakeing-option-item"
                    id={'card'}
                    data-html={true}
                >
                    <div
                        className="stakeing-option shadow-sm bg-white rounded"
                        style={{ height: '100%' }}
                    >
                        <div className="stakeing-option-img-container">
                            <img
                                src={staking}
                                className="stakeing-option-img"
                                alt="Stakeing Option"
                            />
                        </div>
                        <div className="predicted-price">
                            <p className="pridicted-price-text">{innerText}</p>
                        </div>
                        <div className="dropdown-image-container">
                            <img
                                src={dropdown}
                                className="stakeing-dropdown-img"
                                alt="Stakeing Dropdown"
                            />
                        </div>
                    </div>
                </li>
            </Tooltip>
        );
    }
}
