import React, { Component } from 'react';
import {
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

export default class NetworkDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            network: this.setNetwork(),
            dropdownOpen: false,
        };
        this.toggle = this.toggle.bind(this);
    }
    componentDidMount() {
        if (localStorage.getItem('network')) {
            var network = localStorage.getItem('network');
            const path = this.props.location.pathname;
            if (path === '/mainnet') {
                network = 'mainnet';
                localStorage.setItem('network', network);
                this.setState({ network });
            }
            if (
                path === '/' &&
                path !== '/mainnet-stats' &&
                path !== '/testnet-stats' &&
                path !== '/staking-orders'
            ) {
                network = 'testnet';
                localStorage.setItem('network', network);
                this.setState({ network });
            }
            this.setState({ network });
        } else {
            this.setState({ network });
        }
    }
    setNetwork = () => {
        if (localStorage.getItem('network')) {
            var network = localStorage.getItem('network');
            const path = this.props.location.pathname;
            if (path === '/mainnet') {
                network = 'mainnet';
                return network;
            }
            if (
                path === '/' &&
                path !== '/mainnet-stats' &&
                path !== '/testnet-stats' &&
                path !== '/staking-orders'
            ) {
                network = 'testnet';
                return network;
            }
            localStorage.setItem('network', network);
            return network;
        } else {
            localStorage.setItem('network', 'testnet');
            return 'testnet';
        }
    };

    toggle(event) {
        const { dropdownOpen } = this.state;
        if (event.target.value) {
            localStorage.setItem('network', event.target.value);
            this.setState({ network: event.target.value });
            const networkLocation =
                event.target.value === 'mainnet' ? '/mainnet' : '/';
            window.location.href = networkLocation;
        }
        this.setState({ dropdownOpen: !dropdownOpen });
    }
    render() {
        const { network, dropdownOpen } = this.state;
        return (
            <ButtonDropdown
                isOpen={dropdownOpen}
                toggle={(e) => this.toggle(e)}
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
}
