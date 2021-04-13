import React, { Component } from 'react';

export default class OrdersForm extends Component {
    render() {
        const { accountAddress, activeTab } = this.props;
        const currentAddress = accountAddress[activeTab];
        return (
            <div className="container-fluid">
                <div className="container-account-details">
                    <div className="account-details">
                        {currentAddress ? (
                            <span className="wallet-address-des">
                                Account address: &nbsp;
                                <span className="wallet-address">
                                    {currentAddress}
                                </span>
                            </span>
                        ) : (
                            ''
                        )}
                    </div>
                    <div className="account-details-button">
                        <button
                            type="button"
                            className="btn btn-primary shadow-sm rounded"
                            onClick={() => this.props.ConnectWallet()}
                        >
                            Connect wallet
                        </button>
                    </div>
                </div>

                <table className="table">
                    <thead className="thead-dark">
                        <tr className="table-head-container">
                            <th scope="col">Staking period</th>
                            <th scope="col">Predicted price range</th>
                            <th scope="col">
                                Price at conclusion of staking period
                            </th>
                            <th scope="col">Staked roi</th>
                            <th scope="col">Staking reward won</th>
                            <th scope="col">Staked status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>Mark</td>
                            <td>
                                <span className="warning-badge" />
                            </td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                            <td>Mark</td>
                            <td>
                                <span className="sucess-badge" />
                            </td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                            <td>Mark</td>
                            <td>
                                <span className="error-badge" />
                            </td>
                            <td>@mdo</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
