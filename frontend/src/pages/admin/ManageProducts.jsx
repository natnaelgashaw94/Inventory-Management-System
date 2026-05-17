import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // Initial state for form
    const initialProductState = {
        name: '', sku: '', barcode: '', quantity: 0, minimum_stock: 5,
        purchase_price: '', selling_price: '', category_id: '', supplier_id: '', description: ''
    };
    
    const [currentProduct, setCurrentProduct] = useState(initialProductState);
    const [imageFile, setImageFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes, supRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories'),
                api.get('/suppliers')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
            setSuppliers(supRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleShow = (product = null) => {
        setError('');
        setImageFile(null);
        if (product) {
            setCurrentProduct({
                ...product,
                category_id: product.category_id || '',
                supplier_id: product.supplier_id || ''
            });
            setIsEditing(true);
        } else {
            setCurrentProduct(initialProductState);
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        
        const formData = new FormData();
        Object.keys(currentProduct).forEach(key => {
            if (currentProduct[key] !== null && currentProduct[key] !== '') {
                formData.append(key, currentProduct[key]);
            }
        });
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (isEditing) {
                await api.put(`/products/${currentProduct.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? All related inventory transactions will also be deleted.')) {
            try {
                await api.delete(`/products/${id}`);
                fetchData();
            } catch (err) {
                alert(err.response?.data?.message || 'Error deleting product');
            }
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0">Manage Products</h3>
                <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => handleShow()}>
                    <span>➕</span> Add Product
                </button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>SKU</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr><td colSpan="7" className="text-center py-4">No products found.</td></tr>
                                ) : (
                                    products.map(prod => (
                                        <tr key={prod.id}>
                                            <td>
                                                {prod.image_url ? (
                                                    <img src={`http://localhost:5000${prod.image_url}`} alt={prod.name} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} />
                                                ) : (
                                                    <div className="bg-light text-muted d-flex align-items-center justify-content-center fs-5" style={{width: '40px', height: '40px', borderRadius: '4px'}}>
                                                        🖼️
                                                    </div>
                                                )}
                                            </td>
                                            <td className="fw-bold">{prod.name}</td>
                                            <td>{prod.sku || '-'}</td>
                                            <td>{prod.category_name || '-'}</td>
                                            <td>${prod.selling_price}</td>
                                            <td>
                                                <span className={`badge ${prod.quantity < prod.minimum_stock ? 'bg-danger' : 'bg-success'}`}>
                                                    {prod.quantity}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleShow(prod)}>
                                                    ✎
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(prod.id)}>
                                                    ✖
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered py-4">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold">{isEditing ? 'Edit Product' : 'Add Product'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {error && <div className="alert alert-danger py-2">{error}</div>}
                                <form onSubmit={handleSave}>
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-12">
                                            <label className="form-label text-muted small fw-bold">Product Name *</label>
                                            <input type="text" className="form-control" required value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">SKU</label>
                                            <input type="text" className="form-control" value={currentProduct.sku} onChange={e => setCurrentProduct({...currentProduct, sku: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">Barcode</label>
                                            <input type="text" className="form-control" value={currentProduct.barcode} onChange={e => setCurrentProduct({...currentProduct, barcode: e.target.value})} />
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">Category</label>
                                            <select className="form-select" value={currentProduct.category_id} onChange={e => setCurrentProduct({...currentProduct, category_id: e.target.value})}>
                                                <option value="">Select Category</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">Supplier</label>
                                            <select className="form-select" value={currentProduct.supplier_id} onChange={e => setCurrentProduct({...currentProduct, supplier_id: e.target.value})}>
                                                <option value="">Select Supplier</option>
                                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">Purchase Price *</label>
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input type="number" step="0.01" className="form-control" required value={currentProduct.purchase_price} onChange={e => setCurrentProduct({...currentProduct, purchase_price: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">Selling Price *</label>
                                            <div className="input-group">
                                                <span className="input-group-text">$</span>
                                                <input type="number" step="0.01" className="form-control" required value={currentProduct.selling_price} onChange={e => setCurrentProduct({...currentProduct, selling_price: e.target.value})} />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">Initial Quantity (0 if empty)</label>
                                            <input type="number" className="form-control" value={currentProduct.quantity} onChange={e => setCurrentProduct({...currentProduct, quantity: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">Minimum Stock Alert</label>
                                            <input type="number" className="form-control" value={currentProduct.minimum_stock} onChange={e => setCurrentProduct({...currentProduct, minimum_stock: e.target.value})} />
                                        </div>

                                        <div className="col-md-12">
                                            <label className="form-label text-muted small fw-bold">Product Image</label>
                                            <input type="file" className="form-control" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label text-muted small fw-bold">Description</label>
                                            <textarea className="form-control" rows="2" value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}></textarea>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">{isEditing ? 'Save Changes' : 'Add Product'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
