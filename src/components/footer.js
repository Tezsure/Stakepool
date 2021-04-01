/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { Container, Row, Col, NavLink } from 'reactstrap';
import heart from './icons/Heart.svg';
import tezsure from './icons/tezsure.jpg';
import youtube from './icons/youtube.svg';
import telegram from './icons/telegram.svg';
import linkedin from './icons/linkedin.svg';
import twitter from './icons/twitter.svg';
import { animateScroll as scroll } from 'react-scroll';

export default class footer extends Component {
    render() {
        return (
            <>
                <Container
                    fluid="xs"
                    style={{
                        backgroundColor: '#2C7DF7',
                        'padding-left': '9.0888888889vmax',
                        'padding-right': '7.6vmax',
                        width: '100vmax',
                    }}
                >
                    <Row
                        xs="2"
                        style={{
                            'padding-top': '5vmax',
                            'padding-bottom': '5vmax',
                        }}
                    >
                        <Col>
                            <label
                                style={{
                                    color: '#FFFFFF',
                                }}
                                className="try-stakepool"
                            >
                                Try Stakepool now for smart prediction
                            </label>
                        </Col>
                        <Col
                            style={{
                                'text-align': 'right',
                                'padding-top': '1.26778vmax',
                            }}
                        >
                            <NavLink>
                                <button
                                    onClick={() => {
                                        scroll.scrollToTop();
                                    }}
                                    style={{
                                        color: '#1565D8',
                                        backgroundColor: '#F2F5F8',
                                        'text-align': 'center',
                                        'font-size': '2.4305555556vmax',
                                        border: '0.06944vmax solid #1565D8',
                                        'border-radius': '0.5555556vmax',
                                        width: '24.5138888888889vmax',
                                        height: '5.55555556vmax',
                                        'line-height': '5.55555556vmax',
                                    }}
                                    className="stake-button"
                                >
                                    Stake
                                </button>
                            </NavLink>
                        </Col>
                    </Row>
                </Container>
                <Container
                    fluid="xs"
                    id="contact"
                    align="center"
                    style={{
                        backgroundColor: '#F9FBFE',
                        height: '100%',
                        width: '100vmax',
                        'padding-top': '3.333333vmax',
                        'padding-bottom': '3.333333vmax',
                    }}
                >
                    <img
                        src={heart}
                        style={{ width: '8.8vmax', height: '8.8vmax' }}
                    />
                    <p
                        style={{
                            color: '#5A7184',
                            'font-family': 'OpenSans-SemiBold, sans-serif',
                            'font-size': '1.34027778vmax',
                        }}
                    >
                        <strong>
                            Copyright © 2021 Tezsure. Crafted with love.
                        </strong>
                    </p>
                    <a
                        href="https://tezsure.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={tezsure}
                            style={{
                                width: '1.2vmax',
                                height: '1.2vmax',
                                'margin-left': '1.3888888889vmax',
                            }}
                        />
                    </a>
                    <a
                        href="https://twitter.com/tezsure"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={twitter}
                            style={{
                                width: '1.25vmax',
                                height: '1.25vmax',
                                'margin-left': '1.3888888889vmax',
                            }}
                        />
                    </a>
                    <a
                        href="https://www.linkedin.com/company/tezsure/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={linkedin}
                            style={{
                                width: '1.25vmax',
                                height: '1.25vmax',
                                'margin-left': '1.3888888889vmax',
                            }}
                        />
                    </a>
                    <a
                        href="https://www.youtube.com/channel/UCZg7LT1bFWeFiKwGBLcLfLQ"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={youtube}
                            style={{
                                width: '1.25vmax',
                                height: '1.25vmax',
                                'margin-left': '1.3888888889vmax',
                            }}
                        />
                    </a>
                    <a
                        href="https://web.telegram.org/#/im?p=@Indiatezos"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={telegram}
                            style={{
                                width: '1.25vmax',
                                height: '1.25vmax',
                                'margin-left': '1.3888888889vmax',
                            }}
                        />
                    </a>
                </Container>
            </>
        );
    }
}
