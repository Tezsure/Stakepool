import React, { Fragment } from 'react';
import Banner from './Banner/Banner';
import StackeingOptions from './StakeingOptions/StakeingOptions';
import Footer from '../Footer/Footer';

const Home = (props) => {
    return (
        <Fragment>
            <div className="main-page-container">
                <Banner />
                <StackeingOptions />
                <Footer />
            </div>
        </Fragment>
    )
}

export default Home;