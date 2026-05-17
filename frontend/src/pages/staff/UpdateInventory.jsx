import React, { useState, useEffect } from 'react';
import api from "../../services/api";

const UpdateInventory = () => {
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState('');
    const [transactionType, setTransactionType] = useState('Stock In');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, txRes] = await Promise.all([
                api.get('/products'),
                api.get('/inventory')
            ]);
            setProducts(prodRes.data);
            setTransactions(txRes.data.slice(0, 10)); // Just show recent 10
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedProduct || !quantity || quantity <= 0) {
            setError('Please select a product and enter a valid quantity.');
            return;
        }

        setLoadingAction(true);
        try {
            await api.post('/inventory', {
                product_id: selectedProduct,
                type: transactionType,
                quantity: quantity
            });

            setSuccess(`Successfully recorded ${transactionType} of ${quantity} units.`);
            setQuantity('');
            setSelectedProduct('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating inventory');
        } finally {
            setLoadingAction(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    const activeProduct = products.find(p => p.id === parseInt(selectedProduct));

    return (
        <div className="row g-4">
            <div className="col-lg-5">
                <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                        <h4 className="fw-bold mb-0">Record Transaction</h4>
                        <p className="text-muted small">Update stock levels by recording a Stock In or Stock Out.</p>
                    </div>
                    <div className="card-body">
                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        {success && <div className="alert alert-success py-2">{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label text-muted small fw-bold">Select Product</label>
                                <select
                                    className="form-select form-select-lg"
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose a product --</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku || 'N/A'})</option>
                                    ))}
                                </select>
                                {activeProduct && (
                                    <div className="mt-2 text-primary small fw-bold">
                                        Current Stock: {activeProduct.quantity}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-muted small fw-bold">Transaction Type</label>
                                <div className="d-flex gap-3">
                                    <div
                                        className={`flex-grow-1 p-3 border rounded text-center cursor-pointer ${transactionType === 'Stock In' ? 'border-success bg-success bg-opacity-10 text-success fw-bold' : 'bg-light text-muted'}`}
                                        onClick={() => setTransactionType('Stock In')}
                                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        ➕ Stock In
                                    </div>
                                    <div
                                        className={`flex-grow-1 p-3 border rounded text-center cursor-pointer ${transactionType === 'Stock Out' ? 'border-danger bg-danger bg-opacity-10 text-danger fw-bold' : 'bg-light text-muted'}`}
                                        onClick={() => setTransactionType('Stock Out')}
                                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        ➖ Stock Out
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-muted small fw-bold">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control form-control-lg"
                                    placeholder="Enter quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    min="1"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-lg w-100 fw-bold text-white shadow-sm ${transactionType === 'Stock In' ? 'btn-success' : 'btn-danger'}`}
                                disabled={loadingAction}
                            >
                                {loadingAction ? <span className="spinner-border spinner-border-sm"></span> : `Confirm ${transactionType}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="col-lg-7">
                <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                        <h4 className="fw-bold mb-0">Recent Transactions</h4>
                        <p className="text-muted small">Latest inventory movements across the system.</p>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Product</th>
                                        <th>Type</th>
                                        <th>Qty</th>
                                        <th>User</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-4">No recent transactions.</td></tr>
                                    ) : (
                                        transactions.map(tx => (
                                            <tr key={tx.id}>
                                                <td className="small text-muted">{new Date(tx.transaction_date).toLocaleString()}</td>
                                                <td className="fw-bold">{tx.product_name}</td>
                                                <td>
                                                    <span className={`badge ${tx.type === 'Stock In' ? 'bg-success' : 'bg-danger'}`}>
                                                        {tx.type}
                                                    </span>
                                                </td>
                                                <td className="fw-bold">{tx.quantity}</td>
                                                <td className="small">{tx.username}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateInventory;
