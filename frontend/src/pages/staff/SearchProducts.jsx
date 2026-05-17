import React, { useState, useEffect } from 'react';
import api from "../../services/api";

const SearchProducts = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
        (p.barcode && p.barcode.toLowerCase().includes(search.toLowerCase())) ||
        (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase())) ||
        (p.supplier_name && p.supplier_name.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div>
            <div className="mb-4">
                <h3 className="fw-bold m-0">Search Products</h3>
                <p className="text-muted">Find products quickly by name, SKU, barcode, category or supplier.</p>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="input-group input-group-lg">
                        <span className="input-group-text bg-white border-end-0 text-muted">🔍</span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search inventory..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {filteredProducts.length === 0 ? (
                    <div className="col-12"><div className="alert alert-info">No products match your search.</div></div>
                ) : (
                    filteredProducts.map(prod => (
                        <div className="col-md-6 col-xl-4" key={prod.id}>
                            <div className="card border-0 shadow-sm h-100 hover-shadow">
                                <div className="d-flex align-items-center p-3 border-bottom">
                                    {prod.image_url ? (
                                        <img src={`http://localhost:5000${prod.image_url}`} alt={prod.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                    ) : (
                                        <div className="bg-light text-muted d-flex align-items-center justify-content-center fs-3" style={{ width: '60px', height: '60px', borderRadius: '8px' }}>
                                            🖼️
                                        </div>
                                    )}
                                    <div className="ms-3">
                                        <h5 className="fw-bold mb-1">{prod.name}</h5>
                                        <span className="badge bg-light text-dark border">{prod.category_name || 'No Category'}</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted small">SKU:</div>
                                        <div className="col-6 text-end fw-bold">{prod.sku || '-'}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted small">Barcode:</div>
                                        <div className="col-6 text-end fw-bold">{prod.barcode || '-'}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6 text-muted small">Supplier:</div>
                                        <div className="col-6 text-end">{prod.supplier_name || '-'}</div>
                                    </div>
                                    <div className="row mt-3 pt-3 border-top">
                                        <div className="col-6">
                                            <div className="text-muted small">Price</div>
                                            <div className="fw-bold text-success fs-5">${prod.selling_price}</div>
                                        </div>
                                        <div className="col-6 text-end">
                                            <div className="text-muted small">In Stock</div>
                                            <div className={`fw-bold fs-5 ${prod.quantity < prod.minimum_stock ? 'text-danger' : 'text-primary'}`}>
                                                {prod.quantity}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SearchProducts;
