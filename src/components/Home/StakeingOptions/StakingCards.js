import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import Slider from 'react-slick';
import Cards from './Cards';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
            currentPriceRanges,
            fetchingCurrentPriceRanges,
        } = this.props;
        let cards = [];
        let i = 0;
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
        };
        if (!fetchingCurrentPriceRanges) {
            while (i < currentPriceRanges[network].length) {
                let elem = currentPriceRanges[network][i];
                let innerText;
                if (elem.low !== elem.high) {
                    if (elem.high < 0 || elem.low < 0) {
                        if (elem.high === 0) {
                            innerText = `Down to ${(-1 * elem.low) / 100}%`;
                        } else {
                            innerText = `Down ${(-1 * elem.high) / 100}% - ${
                                (-1 * elem.low) / 100
                            }%`;
                        }
                    } else {
                        if (elem.low === 0) {
                            innerText = `Up to ${elem.high / 100}%`;
                        } else {
                            innerText = `Up ${elem.low / 100}% - ${
                                elem.high / 100
                            }%`;
                        }
                    }
                }
                if (elem.low === elem.high && elem.low < 0) {
                    innerText = `Down ${(-1 * elem.low) / 100}% or More`;
                }
                if (elem.low === elem.high && elem.low > 0) {
                    innerText = `Up ${elem.high / 100}% or More`;
                }
                const cycleEndDate = new Date(
                    currentCycle[network].cycletime
                ).toDateString();
                cards.push(
                    <React.Fragment key={innerText}>
                        <Cards
                            currentCycle={currentCycle}
                            cycleEndDate={cycleEndDate}
                            rangeBasedRoi={elem.rangeBasedRoi}
                            network={network}
                            innerText={innerText}
                            low={elem.low}
                            high={elem.high}
                            handleStakingOptionsSelect={
                                this.props.handleStakingOptionsSelect
                            }
                            doScrolling={this.doScrolling}
                            key={innerText}
                        />
                    </React.Fragment>
                );
                ++i;
            }
        } else {
            while (i < 4) {
                cards.push(
                    <Slider key={i}>
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
                    </Slider>
                );
                ++i;
            }
        }
        return <Slider {...settings}>{cards}</Slider>;
    }
}
