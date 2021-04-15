import React, { Fragment, Component } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
const FAQ_DATA = require('./faq-data');

export default class Faq extends Component {
    render() {
        const FAQS = FAQ_DATA.map((elem, index) => (
            <div className="container">
                <div className="faq-header-container">
                    <h4 className="faq-header">Q. {elem.question} ?</h4>
                </div>
                <div className="faq-answer-container">
                    <p className="faq-answer"> {elem.answer}</p>
                </div>
            </div>
        ));
        return (
            <Fragment>
                <div className="main-page-container">
                    <div className="banner">
                        <div className="container">
                            <Header />
                            <div className="stakepool-banner-form-container">
                                {FAQS}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer {...this.props} />
            </Fragment>
        );
    }
}
