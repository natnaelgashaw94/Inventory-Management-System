import React, { useState, useEffect, useContext } from 'react';
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const ManageUsers = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'Staff' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/users', newUser);
            setShowModal(false);
            setNewUser({ username: '', password: '', role: 'Staff' });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating user');
        }
    };

    const handleRoleChange = async (userId, currentRole) => {
        if (currentUser.id === userId) {
            alert('You cannot change your own role.');
            return;
        }

        const newRole = currentRole === 'Admin' ? 'Staff' : 'Admin';
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating role');
        }
    };

    const handleDelete = async (id) => {
        if (currentUser.id === id) {
            alert('You cannot delete yourself.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (err) {
                alert(err.response?.data?.message || 'Error deleting user');
            }
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0">Manage Users</h3>
                <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowModal(true)}>
                    <span>➕</span> Add User
                </button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Created At</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td className="fw-bold">{u.username} {currentUser.id === u.id && <span className="badge bg-primary ms-2">You</span>}</td>
                                        <td>
                                            <span className={`badge ${u.role === 'Admin' ? 'bg-danger' : 'bg-info'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-2"
                                                title="Toggle Role"
                                                onClick={() => handleRoleChange(u.id, u.role)}
                                                disabled={currentUser.id === u.id}
                                            >
                                                {u.role === 'Admin' ? '👤✖️' : '👤✔️'}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(u.id)}
                                                disabled={currentUser.id === u.id}
                                            >
                                                ✖
                                            </button>
                                        </td>
                                    </tr>
                                ))}
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
                                <h5 className="modal-title fw-bold">Add New User</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {error && <div className="alert alert-danger py-2">{error}</div>}
                                <form onSubmit={handleCreateUser}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newUser.username}
                                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            required
                                            minLength="6"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label text-muted small fw-bold">Role</label>
                                        <select
                                            className="form-select"
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        >
                                            <option value="Staff">Staff</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="d-flex justify-content-end gap-2">
                                        <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Add User</button>
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

export default ManageUsers;
