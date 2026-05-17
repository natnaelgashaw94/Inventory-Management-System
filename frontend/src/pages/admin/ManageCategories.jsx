import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ name: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleShow = (category = null) => {
        setError('');
        if (category) {
            setCurrentCategory(category);
            setIsEditing(true);
        } else {
            setCurrentCategory({ name: '' });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.put(`/categories/${currentCategory.id}`, { name: currentCategory.name });
            } else {
                await api.post('/categories', { name: currentCategory.name });
            }
            setShowModal(false);
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving category');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (err) {
                alert(err.response?.data?.message || 'Error deleting category');
            }
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0">Manage Categories</h3>
                <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => handleShow()}>
                    <span>➕</span> Add Category
                </button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Created At</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center py-4">No categories found.</td></tr>
                                ) : (
                                    categories.map(cat => (
                                        <tr key={cat.id}>
                                            <td>{cat.id}</td>
                                            <td className="fw-bold">{cat.name}</td>
                                            <td>{new Date(cat.created_at).toLocaleDateString()}</td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleShow(cat)}>
                                                    ✎
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}>
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
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold">{isEditing ? 'Edit Category' : 'Add Category'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {error && <div className="alert alert-danger py-2">{error}</div>}
                                <form onSubmit={handleSave}>
                                    <div className="mb-4">
                                        <label className="form-label text-muted small fw-bold">Category Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={currentCategory.name}
                                            onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="d-flex justify-content-end gap-2">
                                        <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">{isEditing ? 'Save Changes' : 'Add Category'}</button>
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

export default ManageCategories;
