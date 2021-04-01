import React from 'react';
import Header from '../../Header/Header';


const Banner = (props) => {
  return(
    <div className="banner">
      <div className="container">
        <Header />

        <div className="banner-content-container">
          <h1 className="banner-heading">Earn a little extra on your staking rewards</h1>
          <div className="stakepool-banner-form-container">

            <div className="stakepool-banner-input-wrapper">
              <label className="stakepool-banner-input-label">The current Cycle 333 will be concluded in:</label>
              <input className="stakepool-banner-input" disabled="disabled" type="text" placeholder="00:03:17" />
            </div>

            <div className="stakepool-banner-input-wrapper">
              <label className="stakepool-banner-input-label">Current price of XTZ/USD:</label>
              <input className="stakepool-banner-input" type="text" disabled="disabled" placeholder="$3.35" />
            </div>

            <div className="stakepool-banner-input-wrapper">
              <label className="stakepool-banner-input-label">I want to stake:</label>
              <input className="stakepool-banner-input" type="text" placeholder="000010" />
            </div>

            <div className="stakepool-banner-input-wrapper">
              <label className="stakepool-banner-input-label">I predict the price of XTZ to be:</label>
              <input className="stakepool-banner-input" type="text" placeholder="Price of XTZ" />
            </div>

            <p className="form-footer-text">By submitting this form you agree to our terms and conditions and our Privacy Policy which explains how we may collect, use and disclose your personal information including to third parties.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner;