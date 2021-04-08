import React, { Component } from 'react';
import Header from '../../Header/Header';

export default class Banner extends Component {
    getElementY = (query) => {
        return (
            window.pageYOffset +
            document.getElementById(query).getBoundingClientRect().top
        );
    };

    doScrolling = (element, duration) => {
        var startingY = window.pageYOffset;
        var elementY = this.getElementY(element);
        // If element is close to page's bottom then window will scroll only to some position above the element.
        var targetY =
            document.body.scrollHeight - elementY < window.innerHeight
                ? document.body.scrollHeight - window.innerHeight
                : elementY;
        var diff = targetY - startingY;

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
        return (
            <div className="banner">
                <div className="container">
                    <Header />
                    <div className="banner-content-container">
                        <h1 className="banner-heading">
                            Earn a little extra on your staking rewards
                        </h1>
                        <div className="stakepool-banner-form-container ">
                            <div className="stakepool-banner-input-wrapper">
                                <label className="stakepool-banner-input-label">
                                    The current Cycle 333 will be concluded in:
                                </label>
                                <input
                                    className="stakepool-banner-input"
                                    disabled="disabled"
                                    type="text"
                                    placeholder="00:03:17"
                                />
                            </div>

                            <div className="stakepool-banner-input-wrapper">
                                <label className="stakepool-banner-input-label">
                                    Current price of XTZ/USD:
                                </label>
                                <input
                                    className="stakepool-banner-input"
                                    type="text"
                                    disabled="disabled"
                                    placeholder="$3.35"
                                />
                            </div>

                            <div className="stakepool-banner-input-wrapper">
                                <label className="stakepool-banner-input-label">
                                    I want to stake:
                                </label>
                                <input
                                    className="stakepool-banner-input"
                                    type="text"
                                    placeholder="000010"
                                />
                            </div>

                            <div className="stakepool-banner-input-wrapper">
                                <label className="stakepool-banner-input-label">
                                    I predict the price of XTZ to be:
                                </label>
                                <input
                                    className="stakepool-banner-input"
                                    type="text"
                                    placeholder="Price of XTZ"
                                />
                            </div>

                            <p className="form-footer-text">
                                By submitting this form you agree to our terms
                                and conditions and our Privacy Policy which
                                explains how we may collect, use and disclose
                                your personal information including to third
                                parties.
                            </p>

                            <div className="row" style={{ width: '100%' }}>
                                <div
                                    className="col-md-6 "
                                    style={{ textAlign: 'right' }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-lg staking-options-button banner-button"
                                        onClick={() =>
                                            this.doScrolling(
                                                'stakeing-options',
                                                1000
                                            )
                                        }
                                    >
                                        Staking Options
                                    </button>
                                </div>
                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg banner-button"
                                    >
                                        Stake now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
