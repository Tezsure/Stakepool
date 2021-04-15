import React, { Component } from 'react';
import staking from '../../../assets/images/stakeing.png';
import dropdown from '../../../assets/images/down.jpeg';
import Skeleton from 'react-loading-skeleton';
import { PopoverHeader, PopoverBody, UncontrolledPopover } from 'reactstrap';

export default class StakingCards extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }
    doScrolling = () => {
        var startingY = window.pageYOffset;
        var duration = 1000;
        var elementY = 0;
        // If element is close to page's bottom then window will scroll only to some position above the element.
        var targetY =
            document.body.scrollHeight - elementY < window.innerHeight
                ? document.body.scrollHeight - window.innerHeight
                : elementY;
        var diff = targetY - startingY;
        // Easing function: easeInOutCubic
        // From: https://gist.github.com/gre/1650294
        var easing = function (t) {
            return t < 0.5
                ? 4 * t * t * t
                : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };
        var start;

        if (!diff) return;

        // Bootstrap our animation - it will get called right before next frame shall be rendered.
        window.requestAnimationFrame(function step(timestamp) {
            if (!start) start = timestamp;
            // Elapsed miliseconds since start of scrolling.
            var time = timestamp - start;
            // Get percent of completion in range [0, 1].
            var percent = Math.min(time / duration, 1);
            // Apply the easing.
            // It can cause bad-looking slow frames in browser performance tool, so be careful.
            percent = easing(percent);

            window.scrollTo(0, startingY + diff * percent);

            // Proceed with animation as long as we wanted it to.
            if (time < duration) {
                window.requestAnimationFrame(step);
            }
        });
    };

    render() {
        const {
            network,
            currentCycle,
            currentXTZPrice,
            currentPriceRanges,
            fetchingCurrentPriceRanges,
        } = this.props;
        let cards = [];
        let i = 0;
        if (!fetchingCurrentPriceRanges) {
            while (
                i < currentPriceRanges[network].length &&
                i < this.props.showOptions
            ) {
                let elem = currentPriceRanges[network][i];
                let innerText;
                if (elem.low !== elem.high) {
                    innerText = `Price prediction between $ ${(
                        (currentXTZPrice * 100 + elem.low / 100) /
                        100
                    ).toFixed(2)} - $ ${(
                        (currentXTZPrice * 100 + elem.high / 100) /
                        100
                    ).toFixed(2)}`;
                }
                if (elem.low === elem.high && elem.low < 0) {
                    innerText = `Price prediction below $ ${(
                        (currentXTZPrice * 100 + elem.low / 100) /
                        100
                    ).toFixed(2)}`;
                }
                if (elem.low === elem.high && elem.low > 0) {
                    innerText = `Price prediction above $ ${(
                        (currentXTZPrice * 100 + elem.low / 100) /
                        100
                    ).toFixed(2)}`;
                }
                cards.push(
                    <React.Fragment key={innerText}>
                        <li
                            className="stakeing-option-item"
                            id={'card' + i.toString()}
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
                                    <p className="pridicted-price-text">
                                        {innerText}
                                    </p>
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
                        <UncontrolledPopover
                            placement="bottom-start"
                            hideArrow={true}
                            trigger="legacy"
                            flip={false}
                            target={'card' + i.toString()}
                            container={'card' + i.toString()}
                        >
                            <PopoverHeader
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                {innerText}
                                <br />
                            </PopoverHeader>
                            <PopoverBody>
                                <ul
                                    style={{
                                        paddingLeft: '0.6333333333vmax',
                                        color: '#748093',
                                        fontSize: '0.9652778vmax',
                                    }}
                                >
                                    <li
                                        style={{
                                            paddingBottom: '1vmax',
                                        }}
                                    >
                                        The staking rewards is calculated for
                                        the cycles{' '}
                                        {currentCycle[network].currentCycle}-
                                        {currentCycle[network].currentCycle + 2}
                                        .
                                    </li>
                                    <li
                                        style={{
                                            paddingBottom: '1vmax',
                                        }}
                                    >
                                        A fee of 2% inclusive on your winning
                                        returns is taken for the usage of the
                                        platform.
                                    </li>
                                    <li
                                        style={{
                                            paddingBottom: '1vmax',
                                        }}
                                    >
                                        If, at the completion of your staking
                                        period on Fri Apr 09 2021,the price of
                                        XTZ is in this range, then you get back
                                        your returns along with your staking
                                        betAmountment.Else you would lose your
                                        staking returns and only get back your
                                        staking betAmountment.
                                    </li>
                                    <li
                                        style={{
                                            paddingBottom: '1vmax',
                                        }}
                                    >
                                        You shall get back your staked amount
                                        (plus the winning rewards if applicable)
                                        at the conclusion of cycle{' '}
                                        {currentCycle[network].currentCycle}
                                    </li>
                                    <div align="center">
                                        <button
                                            onClick={() => {
                                                this.doScrolling();
                                                this.props.handleStakingOptionsSelect(
                                                    `${elem.low}~${elem.high}`
                                                );
                                            }}
                                            style={{
                                                fontFamily:
                                                    'OpenSans-Bold, sans-serif',
                                                color: '#1565D8',
                                                backgroundColor: '#FFFFFF',
                                                textAlign: 'center',
                                                fontSize: '1.277778vmax',
                                                border:
                                                    '0.06944vmax solid #1565D8',
                                                borderRadius: '0.556vmax',
                                                width: '9.4444444vmax',
                                                height: '2.5555555vmax',
                                                padding:
                                                    '0.13889vmax 0.13889vmax ',
                                            }}
                                        >
                                            Select
                                        </button>
                                    </div>
                                </ul>
                            </PopoverBody>
                        </UncontrolledPopover>
                    </React.Fragment>
                );
                ++i;
            }
        } else {
            while (i < this.props.showOptions) {
                cards.push(
                    <li className="stakeing-option-item" key={i}>
                        <div
                            className="stakeing-option shadow-sm bg-white rounded"
                            style={{ height: '100%' }}
                        >
                            <div className="stakeing-option-img-container">
                                <Skeleton />
                            </div>
                            <Skeleton count={5} />
                        </div>
                    </li>
                );
                ++i;
            }
        }
        return cards;
    }
}
