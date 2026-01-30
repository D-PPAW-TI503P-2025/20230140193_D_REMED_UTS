import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookService, borrowService } from '../services/api';
import { Plus, Trash2, Edit, Save, X, History, MapPin } from 'lucide-react';


const AdminDashboard = () => {
    const [books, setBooks] = useState([]);
    const [logs, setLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('books');
    const [isEditing, setIsEditing] = useState(null);
    const [newBook, setNewBook] = useState({ title: '', author: '', initialStock: 10 });
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        loadBooks();
        loadLogs();
    }, []);

    const loadBooks = async () => {
        try {
            const { data } = await bookService.getBooks();
            setBooks(data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadLogs = async () => {
        try {
            const { data } = await borrowService.getLogs();
            setLogs(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async () => {
        try {
            await bookService.createBook(newBook);
            setNewBook({ title: '', author: '', initialStock: 10 });
            setShowAdd(false);
            loadBooks();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal tambah buku');
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            if (data.stock < 0) return alert('Stok tidak boleh negatif');
            await bookService.updateBook(id, data);
            setIsEditing(null);
            loadBooks();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal update buku');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus buku ini?')) return;
        try {
            await bookService.deleteBook(id);
            loadBooks();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal hapus buku');
        }
    };

    const StockDropdown = ({ value, onChange, label }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {label && <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--ios-gray)', textTransform: 'uppercase' }}>{label}</label>}
            <div style={{ position: 'relative' }}>
                <select
                    className="ios-input"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    style={{
                        appearance: 'none',
                        padding: '10px 35px 10px 15px',
                        fontSize: '14px',
                        background: 'white'
                    }}
                >
                    {[...Array(101).keys()].map(i => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Plus size={14} color="var(--ios-gray)" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="page-container animate-fade-in" style={{ paddingBottom: '100px' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '48px',
                background: 'white',
                padding: '32px',
                borderRadius: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
                <div>
                    <h1 className="ios-title" style={{ marginBottom: '16px', fontSize: '32px' }}>Admin Panel</h1>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <button
                            onClick={() => setActiveTab('books')}
                            style={{
                                border: 'none', background: 'none', padding: '8px 0',
                                color: activeTab === 'books' ? 'var(--ios-blue)' : 'var(--ios-gray)',
                                borderBottom: activeTab === 'books' ? '3px solid var(--ios-blue)' : '3px solid transparent',
                                fontWeight: '700', cursor: 'pointer', fontSize: '15px', transition: 'all 0.3s'
                            }}
                        >
                            Koleksi Buku
                        </button>
                        <button
                            onClick={() => setActiveTab('logs')}
                            style={{
                                border: 'none', background: 'none', padding: '8px 0',
                                color: activeTab === 'logs' ? 'var(--ios-blue)' : 'var(--ios-gray)',
                                borderBottom: activeTab === 'logs' ? '3px solid var(--ios-blue)' : '3px solid transparent',
                                fontWeight: '700', cursor: 'pointer', fontSize: '15px', transition: 'all 0.3s'
                            }}
                        >
                            Riwayat Peminjaman
                        </button>
                    </div>
                </div>
                {activeTab === 'books' && (
                    <button
                        className="ios-btn ios-btn-primary"
                        style={{ height: '48px', padding: '0 24px' }}
                        onClick={() => setShowAdd(true)}
                    >
                        <Plus size={18} /> Tambah Buku
                    </button>
                )}
            </header>

            <AnimatePresence mode="wait">
                {activeTab === 'books' ? (
                    <motion.div
                        key="books"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-morphism"
                        style={{ overflow: 'hidden', border: 'none', background: 'white' }}
                    >
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#fbfbfd', borderBottom: '1px solid #f2f2f7' }}>
                                    <th style={{ textAlign: 'left', padding: '20px 24px', color: 'var(--ios-gray)', fontSize: '13px', fontWeight: '600' }}>DETAIL BUKU</th>
                                    <th style={{ textAlign: 'center', padding: '20px 24px', color: 'var(--ios-gray)', fontSize: '13px', fontWeight: '600' }}>STATUS STOK</th>
                                    <th style={{ textAlign: 'right', padding: '20px 24px', color: 'var(--ios-gray)', fontSize: '13px', fontWeight: '600' }}>AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map(book => (
                                    <motion.tr
                                        key={book.id}
                                        style={{ borderBottom: '1px solid #f2f2f7' }}
                                        whileHover={{ background: '#fdfdfd' }}
                                    >
                                        <td style={{ padding: '20px 24px' }}>
                                            {isEditing === book.id ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    <input className="ios-input" value={book.title} onChange={(e) => setBooks(books.map(b => b.id === book.id ? { ...b, title: e.target.value } : b))} placeholder="Judul Buku" />
                                                    <input className="ios-input" value={book.author} onChange={(e) => setBooks(books.map(b => b.id === book.id ? { ...b, author: e.target.value } : b))} placeholder="Penulis" />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--ios-label)', marginBottom: '4px' }}>{book.title}</div>
                                                    <div style={{ fontSize: '13px', color: 'var(--ios-secondary-label)', fontWeight: '500' }}>{book.author}</div>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                                            {isEditing === book.id ? (
                                                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                                    <StockDropdown label="Total" value={book.initialStock} onChange={(val) => setBooks(books.map(b => b.id === book.id ? { ...b, initialStock: val } : b))} />
                                                    <StockDropdown label="Ready" value={book.stock} onChange={(val) => setBooks(books.map(b => b.id === book.id ? { ...b, stock: val } : b))} />
                                                </div>
                                            ) : (
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(0, 113, 227, 0.05)', padding: '8px 16px', borderRadius: '12px' }}>
                                                    <span style={{ fontWeight: '800', color: 'var(--ios-blue)', fontSize: '15px' }}>{book.stock}</span>
                                                    <span style={{ color: 'var(--ios-gray)', fontSize: '12px' }}>Tersedia dari</span>
                                                    <span style={{ fontWeight: '700', color: 'var(--ios-label)' }}>{book.initialStock}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                                {isEditing === book.id ? (
                                                    <>
                                                        <button onClick={() => handleUpdate(book.id, book)} className="ios-btn" style={{ padding: '8px', background: 'rgba(52, 199, 89, 0.1)', color: 'var(--ios-green)' }}><Save size={18} /></button>
                                                        <button onClick={() => setIsEditing(null)} className="ios-btn" style={{ padding: '8px', background: 'rgba(255, 59, 48, 0.1)', color: 'var(--ios-red)' }}><X size={18} /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => setIsEditing(book.id)} className="ios-btn" style={{ padding: '8px', background: '#f5f5f7', color: 'var(--ios-gray)' }}><Edit size={18} /></button>
                                                        <button onClick={() => handleDelete(book.id)} className="ios-btn" style={{ padding: '8px', background: 'rgba(255, 59, 48, 0.05)', color: 'var(--ios-red)' }}><Trash2 size={18} /></button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                ) : (
                    <motion.div
                        key="logs"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                    >
                        {logs.length === 0 ? (
                            <div className="glass-morphism" style={{ padding: '80px', textAlign: 'center', background: 'white' }}>
                                <History size={48} color="var(--ios-gray)" style={{ opacity: 0.2, marginBottom: '20px' }} />
                                <p style={{ color: 'var(--ios-gray)', fontWeight: '600' }}>Belum ada riwayat peminjaman yang tercatat.</p>
                            </div>
                        ) : logs.map(log => (
                            <motion.div
                                key={log.id}
                                whileHover={{ scale: 1.01 }}
                                className="glass-morphism"
                                style={{
                                    padding: '24px 32px',
                                    display: 'grid',
                                    gridTemplateColumns: '1.2fr 1.5fr 1.2fr auto',
                                    gap: '32px',
                                    alignItems: 'center',
                                    border: 'none',
                                    background: 'white'
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--ios-gray)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>PEMINJAM</div>
                                    <div style={{ fontWeight: '700', color: 'var(--ios-blue)', fontSize: '17px' }}>{log.User?.username || 'User ID: ' + log.userId}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--ios-gray)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>BUKU</div>
                                    <div style={{ fontWeight: '700', fontSize: '17px', color: 'var(--ios-label)' }}>{log.Book?.title || 'Book ID: ' + log.bookId}</div>
                                    {log.Book?.author && <div style={{ fontSize: '13px', color: 'var(--ios-secondary-label)', fontWeight: '500' }}>Oleh {log.Book.author}</div>}
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--ios-gray)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>LOKASI & WAKTU</div>
                                    <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <MapPin size={14} color="var(--ios-red)" />
                                        <span style={{ fontWeight: '600', color: 'var(--ios-label)' }}>{log.latitude.toFixed(4)}, {log.longitude.toFixed(4)}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--ios-gray)', fontWeight: '500' }}>
                                        {new Date(log.borrowDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        display: 'inline-flex',
                                        background: 'rgba(52, 199, 89, 0.1)',
                                        color: '#34c759',
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: '800',
                                        letterSpacing: '0.5px'
                                    }}>TERKONFIRMASI</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Book Modal */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        key="admin-modal-overlay"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="glass-morphism" style={{ width: '100%', maxWidth: '440px', padding: '40px', background: 'white', border: 'none' }}
                        >
                            <h3 style={{ marginBottom: '32px', fontSize: '24px', fontWeight: '800', textAlign: 'center' }}>Tambah Koleksi Baru</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ios-secondary-label)', marginLeft: '4px' }}>Judul Buku</label>
                                    <input className="ios-input" placeholder="Masukkan judul..." value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ios-secondary-label)', marginLeft: '4px' }}>Penulis</label>
                                    <input className="ios-input" placeholder="Nama penulis..." value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
                                </div>
                                <StockDropdown label="Stok Tersedia" value={newBook.initialStock} onChange={(val) => setNewBook({ ...newBook, initialStock: val })} />
                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button className="ios-btn ios-btn-primary" style={{ flex: 1, height: '54px' }} onClick={handleCreate}>Simpan Buku</button>
                                    <button className="ios-btn" style={{ flex: 1, height: '54px', background: '#f5f5f7' }} onClick={() => setShowAdd(false)}>Batal</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
