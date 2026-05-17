import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState({ name: '', email: '', phone: '', address: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/suppliers');
            setSuppliers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleShow = (supplier = null) => {
        setError('');
        if (supplier) {
            setCurrentSupplier(supplier);
            setIsEditing(true);
        } else {
            setCurrentSupplier({ name: '', email: '', phone: '', address: '' });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.put(`/suppliers/${currentSupplier.id}`, currentSupplier);
            } else {
                await api.post('/suppliers', currentSupplier);
            }
            setShowModal(false);
            fetchSuppliers();
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving supplier');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this supplier? (Will fail if there are linked products)')) {
            try {
                await api.delete(`/suppliers/${id}`);
                fetchSuppliers();
            } catch (err) {
                alert(err.response?.data?.message || 'Error deleting supplier');
            }
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0">Manage Suppliers</h3>
                <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => handleShow()}>
                    <span>➕</span> Add Supplier
                </button>
            </div>

            <div className="row g-4">
                {suppliers.length === 0 ? (
                    <div className="col-12"><div className="alert alert-info border-0 shadow-sm">No suppliers found. Add one to get started!</div></div>
                ) : (
                    suppliers.map(supplier => (
                        <div className="col-md-6 col-lg-4" key={supplier.id}>
                            <div className="card border-0 shadow-sm h-100 hover-shadow" style={{ transition: 'all 0.3s' }}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="fw-bold mb-0 text-primary">{supplier.name}</h5>
                                        <div className="dropdown">
                                            <button className="btn btn-sm btn-light rounded-circle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                &#8942;
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end border-0 shadow">
                                                <li><button className="dropdown-item d-flex align-items-center gap-2" onClick={() => handleShow(supplier)}><span>✎</span> Edit</button></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={() => handleDelete(supplier.id)}><span>✖</span> Delete</button></li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex flex-column gap-2 text-muted small">
                                        <div className="d-flex align-items-center gap-2"><span>✉</span> {supplier.email || 'N/A'}</div>
                                        <div className="d-flex align-items-center gap-2"><span>☎</span> {supplier.phone || 'N/A'}</div>
                                        <div className="d-flex align-items-start gap-2"><span>📍</span> <span>{supplier.address || 'N/A'}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold">{isEditing ? 'Edit Supplier' : 'Add Supplier'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {error && <div className="alert alert-danger py-2">{error}</div>}
                                <form onSubmit={handleSave}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold">Company Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={currentSupplier.name}
                                            onChange={(e) => setCurrentSupplier({...currentSupplier, name: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-muted small fw-bold">Email</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                value={currentSupplier.email}
                                                onChange={(e) => setCurrentSupplier({...currentSupplier, email: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label text-muted small fw-bold">Phone</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={currentSupplier.phone}
                                                onChange={(e) => setCurrentSupplier({...currentSupplier, phone: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label text-muted small fw-bold">Address</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="2"
                                            value={currentSupplier.address}
                                            onChange={(e) => setCurrentSupplier({...currentSupplier, address: e.target.value})}
                                        ></textarea>
                                    </div>
                                    <div className="d-flex justify-content-end gap-2">
                                        <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">{isEditing ? 'Save Changes' : 'Add Supplier'}</button>
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

export default ManageSuppliers;
