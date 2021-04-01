import React, { Fragment } from 'react';

import heart from '../../assets/images/heart.png';

const Footer = (props) => {
  return(
    <Fragment>
      <section className="try-stakepool-section">
        <div className="container try-stakepool-container">
          <h2 className="footer-section-heading">Try Stakepool now for smart prediction</h2>
          <button className="try-stake-btn">Stake</button>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <img src={heart} alt="heart" />
        </div>
        <div className="copyright">Copyright © 2020. Crafted with love.</div>
      </footer>
    </Fragment>
  )
}

export default Footer;