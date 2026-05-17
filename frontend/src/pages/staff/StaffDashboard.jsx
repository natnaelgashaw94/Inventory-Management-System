import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const StaffDashboard = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                // Fetch products and transactions in parallel
                const [productsRes, txRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/inventory')
                ]);
                
                setProducts(productsRes.data);
                
                // Filter transactions by the current user
                const userTxs = txRes.data.filter(tx => tx.user_id === user.id).slice(0, 5);
                setTransactions(userTxs);
            } catch (error) {
                console.error("Error fetching staff dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStaffData();
    }, [user.id]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    const lowStockCount = products.filter(p => p.quantity < p.minimum_stock).length;

    return (
        <div>
            <div className="mb-4">
                <h3 className="fw-bold m-0">Welcome back, {user.username}!</h3>
                <p className="text-muted">Here is an overview of your inventory operations.</p>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-primary text-white h-100">
                        <div className="card-body d-flex align-items-center">
                            <div className="rounded-circle bg-white bg-opacity-25 p-3 me-3 fs-4">
                                📦
                            </div>
                            <div>
                                <h6 className="mb-1 text-white-50">Total Products Available</h6>
                                <h3 className="mb-0 fw-bold">{products.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-warning text-dark h-100">
                        <div className="card-body d-flex align-items-center">
                            <div className="rounded-circle bg-white bg-opacity-50 p-3 me-3 fs-4">
                                ⚡
                            </div>
                            <div>
                                <h6 className="mb-1 text-dark-50">Items Needing Attention</h6>
                                <h3 className="mb-0 fw-bold">{lowStockCount}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                    <h5 className="mb-0 fw-bold">Your Recent Updates</h5>
                </div>
                <div className="card-body">
                    {transactions.length === 0 ? (
                        <p className="text-muted">You haven't made any inventory updates recently.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Product</th>
                                        <th>Type</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td>{new Date(tx.transaction_date).toLocaleString()}</td>
                                            <td>{tx.product_name}</td>
                                            <td>
                                                <span className={`badge ${tx.type === 'Stock In' ? 'bg-success' : 'bg-danger'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="fw-bold">{tx.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
