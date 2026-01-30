import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookService, borrowService } from '../services/api';
import { Search, MapPin, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const BookCard = ({ book, onBorrow }) => (
    <motion.div
        layout
        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
        className="glass-morphism"
        style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'white',
            border: 'none'
        }}
    >
        <div style={{
            background: 'linear-gradient(135deg, #f5f5f7, #e5e5ea)',
            borderRadius: '16px',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: book.stock > 0 ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                color: book.stock > 0 ? 'var(--ios-green)' : 'var(--ios-red)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700'
            }}>
                {book.stock > 0 ? 'TERSEDIA' : 'HABIS'}
            </div>
            <BookOpen size={64} color="#a1a1a6" />
        </div>
        <div>
            <h3 style={{ fontWeight: '700', fontSize: '19px', color: 'var(--ios-label)', marginBottom: '4px' }}>{book.title}</h3>
            <p style={{ color: 'var(--ios-secondary-label)', fontSize: '14px', fontWeight: '500' }}>Oleh {book.author}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', color: 'var(--ios-gray)', fontWeight: '600' }}>STOK</span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--ios-blue)' }}>{book.stock}</span>
            </div>
            {localStorage.getItem('userRole') !== 'admin' ? (
                <button
                    className="ios-btn ios-btn-primary"
                    style={{ padding: '10px 20px', fontSize: '14px', height: '40px' }}
                    disabled={book.stock <= 0}
                    onClick={() => onBorrow(book)}
                >
                    {book.stock > 0 ? 'Pinjam Buku' : 'Stok Habis'}
                </button>
            ) : (
                <div style={{
                    padding: '8px 16px',
                    background: '#f5f5f7',
                    color: 'var(--ios-gray)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textAlign: 'center'
                }}>
                    MODE ADMIN
                </div>
            )}
        </div>
    </motion.div>
);

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [loading, setLoading] = useState(false);
    const [coords, setCoords] = useState(null);
    const [borrowed, setBorrowed] = useState(false);


    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const { data } = await bookService.getBooks();
            setBooks(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInitiateBorrow = (book) => {
        setLoading(true);
        setSelectedBook(book); // Set book early for context

        navigator.geolocation.getCurrentPosition((pos) => {
            setCoords({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            });
            setLoading(false);
        }, (err) => {
            alert('Mohon aktifkan lokasi untuk meminjam buku.');
            setLoading(false);
            setSelectedBook(null);
        });
    };

    const handleBorrow = async () => {
        if (!selectedBook || !coords) return;
        setLoading(true);

        try {
            await borrowService.borrow({
                bookId: selectedBook.id,
                latitude: coords.lat,
                longitude: coords.lng
            });

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#007aff', '#58d68d', '#f1c40f']
            });

            setBorrowed(true);
            loadBooks();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal meminjam buku');
        } finally {
            setLoading(false);
        }
    };

    const closeBorrowModal = () => {
        setSelectedBook(null);
        setCoords(null);
        setBorrowed(false);
    };

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page-container animate-fade-in">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '50px',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <div>
                    <h1 className="ios-title" style={{ marginBottom: '8px' }}>Jelajahi Koleksi</h1>
                    <p style={{ color: 'var(--ios-secondary-label)', fontWeight: '500' }}>Temukan inspirasi baru dari ribuan buku kami.</p>
                </div>
                <div style={{ position: 'relative', width: '340px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--ios-gray)' }} />
                    <input
                        className="ios-input"
                        placeholder="Cari judul, penulis, genre..."
                        style={{ paddingLeft: '50px', background: 'white' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
                {filteredBooks.length > 0 ? filteredBooks.map(book => (
                    <BookCard key={book.id} book={book} onBorrow={handleInitiateBorrow} />
                )) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
                        <BookOpen size={64} color="var(--ios-gray)" style={{ opacity: 0.3, marginBottom: '20px' }} />
                        <h3 style={{ color: 'var(--ios-gray)', fontWeight: '600' }}>Tidak ada buku yang ditemukan.</h3>
                    </div>
                )}
            </div>

            {/* Borrow Modal */}
            <AnimatePresence>
                {selectedBook && (
                    <motion.div
                        key="borrow-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.4)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="glass-morphism"
                            style={{
                                width: '100%',
                                maxWidth: '440px',
                                padding: '40px',
                                background: 'white',
                                border: 'none',
                                textAlign: 'center'
                            }}
                        >
                            {!borrowed ? (
                                <>
                                    <div style={{ marginBottom: '32px' }}>
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'var(--primary-gradient)',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 20px'
                                        }}>
                                            <BookOpen size={32} color="white" />
                                        </div>
                                        <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Konfirmasi Pinjaman</h3>
                                        <p style={{ color: 'var(--ios-secondary-label)', fontSize: '15px' }}>Anda akan meminjam buku: <br /><strong style={{ color: 'var(--ios-label)' }}>{selectedBook.title}</strong></p>
                                    </div>

                                    {coords && (
                                        <div style={{ marginBottom: '32px' }}>
                                            <div style={{ borderRadius: '18px', overflow: 'hidden', height: '180px', marginBottom: '16px', border: '1px solid #eee', position: 'relative' }}>
                                                <iframe
                                                    title="Location Map"
                                                    width="100%"
                                                    height="100%"
                                                    frameBorder="0"
                                                    src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
                                                    style={{ filter: 'grayscale(0.2)' }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(52, 199, 89, 0.1)', padding: '12px', borderRadius: '12px' }}>
                                                <MapPin size={18} color="var(--ios-green)" />
                                                <div style={{ textAlign: 'left' }}>
                                                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--ios-green)' }}>LOKASI ANDA TERDETEKSI</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--ios-secondary-label)', fontFamily: 'monospace' }}>{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="ios-btn ios-btn-primary" style={{ flex: 1, height: '54px' }} onClick={handleBorrow} disabled={loading || !coords}>
                                            {loading ? 'Memproses...' : 'Konfirmasi Sekarang'}
                                        </button>
                                        <button className="ios-btn" style={{ flex: 1, height: '54px', background: '#f5f5f7', color: 'var(--ios-label)' }} onClick={closeBorrowModal}>
                                            Batal
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ padding: '20px 0' }}>
                                    <div style={{
                                        background: 'rgba(52, 199, 89, 0.1)',
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 24px'
                                    }}>
                                        <CheckCircle color="#34c759" size={48} />
                                    </div>
                                    <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>Peminjaman Berhasil!</h3>
                                    <p style={{ color: 'var(--ios-secondary-label)', marginBottom: '32px', fontSize: '16px', lineHeight: '1.6' }}>
                                        Buku <strong>{selectedBook.title}</strong> telah ditambahkan ke daftar pinjaman Anda. Silakan ambil di konter perpustakaan.
                                    </p>
                                    <button className="ios-btn ios-btn-primary" style={{ width: '100%', height: '54px' }} onClick={closeBorrowModal}>
                                        Selesai
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

// Internal Import helper
function BookOpen(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
    )
}

export default BookList;
