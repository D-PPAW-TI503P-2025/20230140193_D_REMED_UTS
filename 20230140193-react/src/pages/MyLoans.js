import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { borrowService } from '../services/api';
import { BookOpen, Calendar, MapPin, Inbox } from 'lucide-react';

const MyLoans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMyLoans();
    }, []);

    const loadMyLoans = async () => {
        try {
            const { data } = await borrowService.getMyLogs();
            setLoans(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-container animate-fade-in"
            style={{ paddingBottom: '120px' }}
        >
            <header style={{ marginBottom: '48px' }}>
                <h1 className="ios-title">Buku Saya</h1>
                <p style={{ color: 'var(--ios-secondary-label)', fontWeight: '500' }}>Daftar buku yang sedang atau pernah Anda pinjam.</p>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="ios-subtitle">Memuat riwayat...</div>
                </div>
            ) : loans.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    {loans.map((loan) => (
                        <motion.div
                            key={loan.id}
                            whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.05)' }}
                            className="glass-morphism"
                            style={{ padding: '24px', border: 'none', background: 'white', display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{
                                    background: 'var(--primary-gradient)',
                                    width: '48px', height: '48px',
                                    borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 8px 16px rgba(0, 113, 227, 0.2)'
                                }}>
                                    <BookOpen size={24} color="white" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontWeight: '700', fontSize: '18px', color: 'var(--ios-label)', marginBottom: '2px' }}>{loan.Book?.title}</h3>
                                    <p style={{ color: 'var(--ios-secondary-label)', fontSize: '14px' }}>{loan.Book?.author}</p>
                                </div>
                            </div>

                            <div style={{ height: '1px', background: '#f2f2f7' }} />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Calendar size={16} color="var(--ios-gray)" />
                                    <span style={{ fontSize: '14px', color: 'var(--ios-secondary-label)' }}>
                                        Dipinjam pada: <strong>{new Date(loan.borrowDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <MapPin size={16} color="var(--ios-red)" />
                                    <span style={{ fontSize: '13px', color: 'var(--ios-gray)', fontFamily: 'monospace' }}>
                                        {loan.latitude.toFixed(6)}, {loan.longitude.toFixed(6)}
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                marginTop: '8px',
                                background: 'rgba(52, 199, 89, 0.1)',
                                color: 'var(--ios-green)',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                fontSize: '12px',
                                fontWeight: '700',
                                textAlign: 'center',
                                alignSelf: 'flex-start'
                            }}>
                                STATUS: AKTIF
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div style={{
                        width: '80px', height: '80px',
                        background: '#f5f5f7',
                        borderRadius: '24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px'
                    }}>
                        <Inbox size={40} color="var(--ios-gray)" style={{ opacity: 0.3 }} />
                    </div>
                    <h3 style={{ color: 'var(--ios-label)', fontWeight: '700', marginBottom: '8px' }}>Belum Ada Pinjaman</h3>
                    <p style={{ color: 'var(--ios-gray)', fontSize: '15px' }}>Anda belum melakukan peminjaman buku apapun.</p>
                </div>
            )}
        </motion.div>
    );
};

export default MyLoans;
