import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { User, Lock, ArrowRight, Library } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('userRole');
        if (userId) {
            navigate(role === 'admin' ? '/admin' : '/home');
        }
    }, [navigate]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                const response = await authService.login({ username, password });
                const { user } = response.data;

                localStorage.setItem('userRole', user.role);
                localStorage.setItem('userId', user.id);
                localStorage.setItem('username', user.username);

                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            } else {
                await authService.register({ username, password });
                setIsLogin(true);
                alert('Registrasi berhasil! Silakan login.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'var(--mesh-gradient)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="glass-morphism"
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    padding: '48px',
                    background: 'rgba(255, 255, 255, 0.8)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            width: '64px',
                            height: '64px',
                            background: 'var(--primary-gradient)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 10px 20px rgba(0, 113, 227, 0.2)'
                        }}
                    >
                        <Library size={32} color="white" />
                    </motion.div>
                    <h2 className="ios-title" style={{ fontSize: '32px', marginBottom: '12px' }}>
                        {isLogin ? 'Selamat Datang' : 'Buat Akun'}
                    </h2>
                    <p style={{ color: 'var(--ios-secondary-label)', fontSize: '16px' }}>
                        {isLogin ? 'Masuk ke Library GeoSystem Anda' : 'Daftar untuk akses ribuan buku digital'}
                    </p>
                </div>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ios-secondary-label)', marginLeft: '4px' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--ios-gray)' }} />
                            <input
                                className="ios-input"
                                placeholder="nama pengguna"
                                style={{ paddingLeft: '48px' }}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ios-secondary-label)', marginLeft: '4px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--ios-gray)' }} />
                            <input
                                className="ios-input"
                                type="password"
                                placeholder="kata sandi"
                                style={{ paddingLeft: '48px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                key="auth-error"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    background: 'rgba(255, 59, 48, 0.1)',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    color: 'var(--ios-red)',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    border: '1px solid rgba(255, 59, 48, 0.2)'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button className="ios-btn ios-btn-primary" style={{ marginTop: '10px', height: '54px', fontSize: '17px' }}>
                        {isLogin ? 'Masuk' : 'Daftar Sekarang'}
                        <ArrowRight size={20} />
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <span style={{ color: 'var(--ios-secondary-label)', fontSize: '15px' }}>
                        {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                    </span>
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        style={{
                            border: 'none',
                            background: 'none',
                            color: 'var(--ios-blue)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginLeft: '8px',
                            fontSize: '15px'
                        }}
                    >
                        {isLogin ? 'Daftar di sini' : 'Masuk sekarang'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
