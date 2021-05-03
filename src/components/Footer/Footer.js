import React, { Fragment, Component } from 'react';
import heart from '../../assets/images/heart.png';
import linkedInIcon from '../../assets/linkedin.svg';
import telegramIcon from '../../assets/telegram.svg';
import discordIcon from '../../assets/discord.svg';
import twitterIcon from '../../assets/twitter.svg';
import githubIcon from '../../assets/github.svg';

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

                <footer
                    className="site-footer"
                    id="contact"
                    style={{ marginTop: '8%' }}
                >
                    {/* <h4 className="footer-heading">Get involved</h4> */}
                    <div
                        className="container-footer shadow-lg"
                        style={{ width: '100%' }}
                    >
                        <div className="copyright">
                            <p
                                className="banner-heading"
                                style={{
                                    maxWidth: '100%',
                                    paddingTop: '20px',
                                }}
                            >
                                Join our growing community
                            </p>
                            <p className="subtext-of-footer">
                                Make your contribution or get community support
                                24/7
                            </p>
                        </div>
                        <div className="container-social">
                            <a
                                href="https://www.linkedin.com/company/tezsure"
                                className={'footer-image-conatiner shadow-lg'}
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
                                href="https://telegram.me/tezster"
                                className={'footer-image-conatiner shadow-lg'}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <img
                                    src={telegramIcon}
                                    alt="none"
                                    className="footer-icons"
                                />
                            </a>
                            <a
                                href="https://discord.gg/fJEpBQef"
                                className={'footer-image-conatiner shadow-lg'}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <img
                                    src={discordIcon}
                                    alt="none"
                                    className="footer-icons"
                                />
                            </a>
                            <a
                                href="https://github.com/Tezsure/Stakepool"
                                className={'footer-image-conatiner shadow-lg'}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <img
                                    src={githubIcon}
                                    alt="none"
                                    className="footer-icons"
                                />
                            </a>
                            <a
                                href="https://twitter.com/tezsure"
                                className={'footer-image-conatiner shadow-lg'}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <img
                                    src={twitterIcon}
                                    alt="none"
                                    className="footer-icons"
                                />
                            </a>
                        </div>
                    </div>
                </footer>
            </Fragment>
        );
    }
}
