import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Book, MapPin, ShieldCheck, ChevronRight, BookOpen, Library } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate]);

    const features = [
        {
            icon: <Book size={32} color="white" />,
            title: "Digital Library",
            desc: "Akses ribuan koleksi buku digital kapan saja dengan satu sentuhan jari.",
            bg: 'linear-gradient(135deg, #0071e3, #47a1ff)'
        },
        {
            icon: <MapPin size={32} color="white" />,
            title: "Geo Borrowing",
            desc: "Peminjaman cerdas berbasis lokasi real-time untuk efisiensi maksimal.",
            bg: 'linear-gradient(135deg, #34c759, #30b14d)'
        },
        {
            icon: <ShieldCheck size={32} color="white" />,
            title: "Secure System",
            desc: "Keamanan data peminjaman yang terjamin dengan enkripsi standar industri.",
            bg: 'linear-gradient(135deg, #ff9500, #ffcc00)'
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-container animate-fade-in"
        >
            <header style={{ marginBottom: '80px', textAlign: 'center' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                    style={{ marginBottom: '32px' }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'white',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }}>
                        <Library size={40} color="var(--ios-blue)" />
                    </div>
                </motion.div>
                <h1 className="ios-title">Halo, {username || 'Pembaca'}!</h1>
                <p className="ios-subtitle">Selamat datang kembali di Library GeoSystem. Apa yang ingin Anda baca hari ini?</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '60px' }}>
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        className="glass-morphism"
                        style={{ padding: '40px', border: 'none', background: 'white' }}
                    >
                        <div style={{
                            background: f.bg,
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '24px',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }}>
                            {f.icon}
                        </div>
                        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: 'var(--ios-label)' }}>{f.title}</h3>
                        <p style={{ color: 'var(--ios-secondary-label)', lineHeight: '1.6', fontSize: '15px' }}>{f.desc}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate('/books')}
                className="glass-morphism"
                style={{
                    padding: '32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: 'var(--primary-gradient)',
                    border: 'none',
                    boxShadow: '0 20px 40px rgba(0, 113, 227, 0.2)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '14px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                        <BookOpen color="white" size={24} />
                    </div>
                    <div>
                        <h4 style={{ color: 'white', fontSize: '20px', fontWeight: '700' }}>Eksplorasi Koleksi</h4>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Temukan buku favorit Anda dari ribuan judul yang tersedia.</p>
                    </div>
                </div>
                <div style={{ background: 'white', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight color="var(--ios-blue)" size={24} />
                </div>
            </motion.div>

        </motion.div>
    );
};

export default Home;
