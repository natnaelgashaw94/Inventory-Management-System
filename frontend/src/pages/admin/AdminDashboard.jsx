import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
    }

    if (!stats) return <div className="alert alert-danger">Failed to load dashboard data.</div>;

    const statCards = [
        { title: 'Total Products', value: stats.stats.totalProducts, icon: '📦', color: 'primary' },
        { title: 'Total Categories', value: stats.stats.totalCategories, icon: '📁', color: 'success' },
        { title: 'Total Suppliers', value: stats.stats.totalSuppliers, icon: '🚚', color: 'info' },
        { title: 'Total Users', value: stats.stats.totalUsers, icon: '👥', color: 'warning' },
    ];

    // Find the max quantity for relative sizing of progress bars
    const maxQuantity = stats.inventoryOverview && stats.inventoryOverview.length > 0 
        ? Math.max(...stats.inventoryOverview.map(item => item.quantity)) 
        : 1;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0">Admin Dashboard</h3>
            </div>

            {/* Stats Row */}
            <div className="row g-4 mb-4">
                {statCards.map((card, index) => (
                    <div className="col-md-3" key={index}>
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className={`rounded-circle bg-${card.color} bg-opacity-10 text-${card.color} p-3 me-3 fs-4`}>
                                    {card.icon}
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1">{card.title}</h6>
                                    <h3 className="mb-0 fw-bold">{card.value}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Inventory Overview using Bootstrap Progress Bars */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                            <h5 className="mb-0 fw-bold">Inventory Overview (Top 10)</h5>
                        </div>
                        <div className="card-body">
                            {stats.inventoryOverview && stats.inventoryOverview.length > 0 ? (
                                stats.inventoryOverview.map((item, idx) => (
                                    <div key={idx} className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="fw-bold">{item.name}</span>
                                            <span className="text-muted">{item.quantity} in stock</span>
                                        </div>
                                        <div className="progress" style={{ height: '10px' }}>
                                            <div 
                                                className="progress-bar bg-primary" 
                                                role="progressbar" 
                                                style={{ width: `${(item.quantity / maxQuantity) * 100}%` }} 
                                                aria-valuenow={item.quantity} 
                                                aria-valuemin="0" 
                                                aria-valuemax={maxQuantity}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No inventory data.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Low Stock Alerts */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex align-items-center gap-2">
                            <span className="text-danger fs-5">⚠️</span>
                            <h5 className="mb-0 fw-bold">Low Stock Alerts</h5>
                        </div>
                        <div className="card-body">
                            {stats.lowStockAlerts.length === 0 ? (
                                <p className="text-muted">No low stock items.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Product</th>
                                                <th>SKU</th>
                                                <th>Quantity</th>
                                                <th>Min Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.lowStockAlerts.map(item => (
                                                <tr key={item.id} className="table-danger">
                                                    <td>{item.name}</td>
                                                    <td>{item.sku}</td>
                                                    <td className="fw-bold">{item.quantity}</td>
                                                    <td>{item.minimum_stock}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex align-items-center gap-2">
                            <span className="text-primary fs-5">⚡</span>
                            <h5 className="mb-0 fw-bold">Recent Inventory Activity</h5>
                        </div>
                        <div className="card-body">
                            {stats.recentActivity.length === 0 ? (
                                <p className="text-muted">No recent activity.</p>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {stats.recentActivity.map(activity => (
                                        <li key={activity.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="fw-bold">{activity.product_name}</div>
                                                <small className="text-muted">By {activity.username} • {new Date(activity.transaction_date).toLocaleString()}</small>
                                            </div>
                                            <span className={`badge ${activity.type === 'Stock In' ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                                                {activity.type === 'Stock In' ? '+' : '-'}{activity.quantity}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
