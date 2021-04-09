import React, { Fragment, Component } from 'react';
import Banner from './Banner/Banner';
import StackeingOptions from './StakeingOptions/StakeingOptions';
import Footer from '../Footer/Footer';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Fragment>
                <div className="main-page-container">
                    <Banner {...this.props} />
                    <StackeingOptions {...this.props} />
                    <Footer {...this.props} />
                </div>
            </Fragment>
        );
    }
}
