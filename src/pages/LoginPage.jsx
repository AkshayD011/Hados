import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, GraduationCap, AlertCircle, Mail, RefreshCcw, LogOut, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [dept, setDept] = useState('');
    const [year, setYear] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register, logout, resendVerification, checkVerification, isAuthenticated, verificationPending, user } = useAuth();
    const navigate = useNavigate();

    // ✅ FIXED: useEffect imported
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            if (isRegistering) {
                await register(email, password, rollNo, name, dept, year);
                setSuccessMessage('Registration successful! Please check your university email for verification.');
                setIsRegistering(false);
            } else {
                await login(email, password);
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="login-container"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1rem',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)'
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-card glass card-base"
                style={{
                    width: '100%',
                    maxWidth: isRegistering ? '550px' : '420px',
                    padding: '2.5rem 2rem',
                    color: 'var(--text-primary)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'max-width 0.3s ease'
                }}
            >
                {/* Background glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)',
                        opacity: 0.1
                    }}
                />

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            padding: '1rem',
                            backgroundColor: 'var(--primary)',
                            borderRadius: '1rem',
                            marginBottom: '1rem',
                            color: 'white'
                        }}
                    >
                        <GraduationCap size={40} />
                    </div>

                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>
                        Hados
                    </h1>

                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isRegistering
                            ? 'Create your university account'
                            : 'Sign in to Mailer Daemon'}
                    </p>
                </div>

                {verificationPending ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center' }}
                    >
                        <div style={{ 
                            backgroundColor: 'rgba(52, 152, 219, 0.1)', 
                            padding: '2rem', 
                            borderRadius: '1rem',
                            marginBottom: '2rem',
                            border: '1px dashed var(--primary-light)'
                        }}>
                            <Mail size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Verify your email</h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                We've sent a verification link to:<br/>
                                <strong style={{ color: 'var(--text-primary)' }}>{user?.email}</strong>
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button 
                                onClick={async () => {
                                    setLoading(true);
                                    await checkVerification();
                                    setLoading(false);
                                }}
                                disabled={loading}
                                className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                                I've verified my email
                            </button>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button 
                                    onClick={async () => {
                                        await resendVerification();
                                        setSuccessMessage('Verification email resent!');
                                    }}
                                    style={{ 
                                        flex: 1,
                                        padding: '0.75rem', 
                                        borderRadius: '0.5rem', 
                                        border: '1px solid var(--border)',
                                        background: 'transparent',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Resend Email
                                </button>

                                <button 
                                    onClick={logout}
                                    style={{ 
                                        flex: 1,
                                        padding: '0.75rem', 
                                        borderRadius: '0.5rem', 
                                        border: '1px solid var(--error)',
                                        background: 'transparent',
                                        color: 'var(--error)',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>

                            <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Wrong email? 
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsRegistering(true);
                                    }}
                                    style={{ 
                                        marginLeft: '0.5rem',
                                        color: 'var(--primary)', 
                                        fontWeight: '600', 
                                        background: 'none', 
                                        border: 'none', 
                                        cursor: 'pointer', 
                                        padding: 0 
                                    }}
                                >
                                    Register again
                                </button>
                            </p>
                        </div>

                        {successMessage && (
                            <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                <CheckCircle size={14} /> {successMessage}
                            </p>
                        )}
                    </motion.div>
                ) : (
                    <>
                        {/* Success Message */}
                {successMessage && (
                    <div
                        style={{
                            padding: '1rem',
                            backgroundColor: 'rgba(40, 167, 69, 0.1)',
                            color: 'green',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}
                    >
                        {successMessage}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                >
                    {/* Register Fields */}
                    <AnimatePresence>
                        {isRegistering && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '1.25rem'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Roll No</label>
                                    <input
                                        type="text"
                                        placeholder="AM.EN.U4C..."
                                        value={rollNo}
                                        onChange={(e) => setRollNo(e.target.value)}
                                        required
                                        style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Department</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. CSE / AI"
                                        value={dept}
                                        onChange={(e) => setDept(e.target.value)}
                                        required
                                        style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Year</label>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        required
                                        style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', backgroundColor: 'white' }}
                                    >
                                        <option value="">Year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Common Fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>University Email</label>
                        <input
                            type="email"
                            placeholder="name@bl.students.amrita.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ color: 'red', display: 'flex', gap: '0.5rem' }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
                    >
                        {loading
                            ? 'Processing...'
                            : isRegistering
                            ? <><UserPlus size={20} /> Register</>
                            : <><LogIn size={20} /> Sign In</>}
                    </button>
                </form>

                {/* Toggle */}
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError('');
                            setSuccessMessage('');
                        }}
                        style={{ color: 'var(--primary)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        {isRegistering ? 'Sign In' : 'Register'}
                    </button>
                </div>
            </>
        )}
            </motion.div>
        </div>
    );
};

export default LoginPage;