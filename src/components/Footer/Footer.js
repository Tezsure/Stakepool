import React, { Fragment, Component } from 'react';
import heart from '../../assets/images/heart.png';
import linkedInIcon from '../../assets/images/linkedin.png';
import telegramIcon from '../../assets/images/telegram.png';
import youtubeIcon from '../../assets/images/youtube.png';
import twitterIcon from '../../assets/images/twitter.png';
import tezsureIcon from '../../assets/images/tezsure.jpg';

export default class Footer extends Component {
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

    handleStakeEvent = () => {
        const path = this.props.location.pathname;
        if (path === '/mainnet' || path === '/') {
            this.doScrolling();
        } else {
            this.doScrolling();
            this.props.history.push('/');
        }
    };
    render() {
        return (
            <Fragment>
                <section className="try-stakepool-section">
                    <div className="container try-stakepool-container">
                        <h2 className="footer-section-heading">
                            Try Stakepool now for smart prediction
                        </h2>
                        <button
                            className="try-stake-btn shadow-lg bg-white rounded"
                            onClick={() => this.handleStakeEvent()}
                        >
                            Stake
                        </button>
                    </div>
                </section>

                <footer className="site-footer" id="contact">
                    <div>
                        <img src={heart} alt="heart" />
                    </div>
                    <div className="copyright">
                        Copyright © 2021 Tezsure. Crafted with love.
                    </div>
                    <div className="site-footer-2">
                        <a
                            href="https://tezsure.com/"
                            className={'footer-image-conatiner'}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <img
                                src={tezsureIcon}
                                alt="none"
                                className="footer-icons"
                                style={{ width: '18px' }}
                            />
                        </a>
                        <a
                            href="https://twitter.com/tezsure"
                            className={'footer-image-conatiner'}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <img
                                src={twitterIcon}
                                alt="none"
                                className="footer-icons"
                            />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/tezsure"
                            className={'footer-image-conatiner'}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <img
                                src={linkedInIcon}
                                alt="none"
                                className="footer-icons"
                            />
                        </a>
                        <a
                            href="https://www.youtube.com/channel/UCZg7LT1bFWeFiKwGBLcLfLQ"
                            className={'footer-image-conatiner'}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <img
                                src={youtubeIcon}
                                alt="none"
                                className="footer-icons"
                            />
                        </a>
                        <a
                            href="https://telegram.me/tezster"
                            className={'footer-image-conatiner'}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <img
                                src={telegramIcon}
                                alt="none"
                                className="footer-icons"
                            />
                        </a>
                    </div>
                </footer>
            </Fragment>
        );
    }
}
