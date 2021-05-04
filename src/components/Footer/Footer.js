import React, { Fragment, Component } from 'react';
import linkedInIcon from '../../assets/linkedin.svg';
import telegramIcon from '../../assets/telegram.svg';
import discordIcon from '../../assets/discord.svg';
import twitterIcon from '../../assets/twitter.svg';
import githubIcon from '../../assets/github.svg';

export default class Footer extends Component {
    render() {
        return (
            <Fragment>
                <footer
                    className="site-footer"
                    id="contact"
                    style={{ marginTop: '22px' }}
                >
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
                                href="https://discord.gg/DWFnm77qDw"
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
