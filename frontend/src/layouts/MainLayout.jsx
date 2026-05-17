import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './MainLayout.css';

const MainLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminLinks = [
        { path: '/admin', icon: '🏠', label: 'Dashboard' },
        { path: '/admin/products', icon: '📦', label: 'Products' },
        { path: '/admin/categories', icon: '📁', label: 'Categories' },
        { path: '/admin/suppliers', icon: '🚚', label: 'Suppliers' },
        { path: '/admin/inventory', icon: '📈', label: 'Inventory' },
        { path: '/admin/users', icon: '👥', label: 'Users' },
    ];

    const staffLinks = [
        { path: '/staff', icon: '🏠', label: 'Dashboard' },
        { path: '/staff/products', icon: '🔍', label: 'Search Products' },
        { path: '/staff/inventory', icon: '🔄', label: 'Update Inventory' },
    ];

    const links = user?.role === 'Admin' ? adminLinks : staffLinks;

    return (
        <div className="d-flex" style={{ height: '100vh', backgroundColor: '#f4f6f9' }}>
            {/* Sidebar */}
            <div className="sidebar bg-white shadow-sm d-flex flex-column" style={{ width: '250px', transition: 'all 0.3s' }}>
                <div className="p-4 border-bottom">
                    <h4 className="text-primary fw-bold mb-0">IMS Pro</h4>
                    <small className="text-muted">Inventory Management</small>
                </div>
                <div className="flex-grow-1 p-3">
                    <ul className="nav flex-column gap-2">
                        {links.map((link) => (
                            <li className="nav-item" key={link.path}>
                                <Link 
                                    to={link.path} 
                                    className={`nav-link d-flex align-items-center gap-3 px-3 py-2 rounded ${location.pathname === link.path ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}
                                    style={{ transition: 'all 0.2s' }}
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-3 border-top">
                    <button onClick={handleLogout} className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2 text-danger fw-bold">
                        <span>🚪</span> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                {/* Navbar */}
                <nav className="navbar navbar-expand bg-white shadow-sm px-4 py-3">
                    <div className="container-fluid d-flex justify-content-end">
                        <div className="d-flex align-items-center gap-3">
                            <div className="text-end">
                                <p className="mb-0 fw-bold">{user?.username}</p>
                                <small className="text-muted">{user?.role}</small>
                            </div>
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="p-4 flex-grow-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
