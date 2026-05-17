import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Staff');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(username, password, role);
            navigate(`/${data.user.role.toLowerCase()}`);
        } catch (err) {
            if (!err.response) {
                setError('Cannot connect to the server. Please ensure the backend is running.');
            } else {
                setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center">
            <div className="card shadow-lg border-0 login-card">
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-primary mb-2">Ahadu IMS</h2>
                        <p className="text-muted">Welcome back to <span className="fw-bold text-primary">Ahadu IMS</span> ! </p>
                        <p>Please login to your account.</p>
                    </div>

                    {error && <div className="alert alert-danger py-2">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-bold">Username</label>
                            <input
                                type="text"
                                className="form-control form-control-lg bg-light"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-muted small fw-bold">Password</label>
                            <input
                                type="password"
                                className="form-control form-control-lg bg-light"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-muted small fw-bold">Login As</label>
                            <select
                                className="form-select form-select-lg bg-light"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="Admin">Admin</option>
                                <option value="Staff">Staff</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                            disabled={loading}
                        >
                            {loading ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
