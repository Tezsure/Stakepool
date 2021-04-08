import React from 'react';

import logo from '../../assets/images/Group 35964@2x.png';

const Header = (props) => {
    return (
        <header className="site-header">
            <div className="site-logo">
                <a href="/" className="site-header-link">
                    <img src={logo} alt="logo" className="logo-image" />
                </a>
            </div>

            <ul className="site-menu-wrapper">
                <li className="site-menu-item">
                    <a href="#" className="site-menu-item-link">
                        Documentation
                    </a>
                </li>
                <li className="site-menu-item">
                    <a href="#" className="site-menu-item-link">
                        Github
                    </a>
                </li>
                <li className="site-menu-item">
                    <button className="contact-btn">Get in Touch</button>
                </li>
            </ul>
        </header>
    );
};

export default Header;
