import React, { useState, useEffect } from 'react';
import api from "../../services/api";

const InventoryTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/inventory');
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0">Inventory Transactions</h3>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Type</th>
                                    <th>Quantity</th>
                                    <th>User</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-4">No transactions found.</td></tr>
                                ) : (
                                    transactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td>{new Date(tx.transaction_date).toLocaleString()}</td>
                                            <td className="fw-bold">{tx.product_name}</td>
                                            <td>{tx.product_sku || '-'}</td>
                                            <td>
                                                <span className={`badge ${tx.type === 'Stock In' ? 'bg-success' : 'bg-danger'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="fw-bold">{tx.quantity}</td>
                                            <td className="text-muted">{tx.username}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryTransactions;
