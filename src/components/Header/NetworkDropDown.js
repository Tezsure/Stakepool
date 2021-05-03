import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import {
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

export default function NetworkDropDown(props) {
    const [dropdownOpen, setOpen] = useState(false);
    const [network, setNetwork] = useState('testnet');

    useEffect(() => {
        const path = props.location.pathname;
        const network = path === '/mainnet' ? 'mainnet' : 'testnet';
        setNetwork(network);
    }, []);

    const toggle = (event) => {
        if (event.target.value) {
            setNetwork(event.target.value);
            const networkLocation =
                event.target.value === 'mainnet' ? '/mainnet' : '/';
            window.location.href = networkLocation;
        }
        return setOpen(!dropdownOpen);
    };
    return (
        <ButtonDropdown
            isOpen={dropdownOpen}
            toggle={toggle}
            className="network-dropdown"
        >
            <DropdownToggle
                caret
                color="primary"
                style={{ textTransform: 'capitalize', fontWeight: 600 }}
                className="contact-btn"
            >
                {network}
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem value={'mainnet'}>Mainnet</DropdownItem>
                <DropdownItem value={'testnet'}>Testnet</DropdownItem>
            </DropdownMenu>
        </ButtonDropdown>
    );
}
