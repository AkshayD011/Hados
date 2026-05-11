import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, GraduationCap, Mail, RefreshCcw, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [dept, setDept] = useState('');
    const [year, setYear] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const { login, register, logout, resendVerification, checkVerification, isAuthenticated, verificationPending, user, resetPassword } = useAuth();
    const navigate = useNavigate();

    // ✅ FIXED: useEffect imported
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegistering) {
                await register(email, password, rollNo, name, dept, year);
                toast.success('Registration successful! Please check your university email.');
                setIsRegistering(false);
            } else {
                await login(email, password);
                toast.success('Signed in successfully!');
            }
        } catch (err) {
            let errorMsg = err.message || "Something went wrong";
            if (errorMsg.includes('auth/invalid-credential')) {
                errorMsg = "Email or Password is incorrect.";
            } else if (errorMsg.includes('auth/user-not-found')) {
                errorMsg = "No account found with this email.";
            } else if (errorMsg.includes('auth/wrong-password')) {
                errorMsg = "Password is incorrect.";
            } else if (errorMsg.includes('auth/email-already-in-use')) {
                errorMsg = "An account already exists with this email.";
            } else if (errorMsg.includes('auth/weak-password')) {
                errorMsg = "Password should be at least 6 characters.";
            } else if (errorMsg.includes('auth/network-request-failed')) {
                errorMsg = "Network error. Please check your internet connection.";
            }
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your university email first to reset your password.");
            return;
        }
        try {
            setLoading(true);
            await resetPassword(email);
            toast.success("A password reset link has been sent to your email.");
        } catch (err) {
            toast.error(err.message || "Failed to send reset email.");
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
                                        toast.success('Verification email resent!');
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
                    </motion.div>
                ) : (
                    <>
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
                                className="grid-1-col-md"
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
                                        placeholder="ex: John Doe"
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
                                        placeholder="ex: BL.EN.U4C..."
                                        value={rollNo}
                                        onChange={(e) => setRollNo(e.target.value)}
                                        required
                                        style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600' }}>Department</label>
                                    <select
                                        value={dept}
                                        onChange={(e) => setDept(e.target.value)}
                                        required
                                        style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', backgroundColor: 'white' }}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="AID">AID</option>
                                        <option value="AIE">AIE</option>
                                        <option value="CSE">CSE</option>
                                        <option value="EAC">EAC</option>
                                        <option value="ECE">ECE</option>
                                        <option value="EEE">EEE</option>
                                        <option value="ELC">ELC</option>
                                        <option value="MEE">MEE</option>
                                        <option value="RAE">RAE</option>
                                    </select>
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
                            placeholder=" ex: bl.en.u4...@bl.students.amrita.edu"
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
                            required={!isRegistering} // allow required only if not clicking forgot password
                            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }}
                        />
                        {!isRegistering && (
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                style={{
                                    alignSelf: 'flex-end',
                                    fontSize: '0.8rem',
                                    color: 'var(--primary)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    marginTop: '-0.25rem'
                                }}
                            >
                                Forgot Password?
                            </button>
                        )}
                    </div>

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