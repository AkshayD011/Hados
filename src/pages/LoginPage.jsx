import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, GraduationCap, Mail, RefreshCcw, LogOut, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FieldError, inputBorderStyle, PasswordStrengthBar } from '../components/ui/FormField';
import useFormValidation, { required, minLength, isEmail, isUniversityEmail, combine, passwordStrength } from '../hooks/useFormValidation';

import { ROLES } from '../utils/roles';
import { getDocument } from '../services/firebase/firestore';

// ─── Base input style reused across all fields ─────────────────────────────
const baseInput = {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--border)',
    width: '100%',
    fontSize: '0.9375rem',
    backgroundColor: 'var(--surface)',
    color: 'var(--text-primary)',
};

const LoginPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginMode, setLoginMode] = useState('user'); // 'user' or 'admin'

    // Form states
    const [name, setName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [dept, setDept] = useState('');
    const [year, setYear] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({});

    const [loading, setLoading] = useState(false);

    const { login, register, logout, resendVerification, checkVerification, isAuthenticated, verificationPending, user, resetPassword } = useAuth();
    const navigate = useNavigate();

    // ─── Validation rules ───────────────────────────────────────────────────
    const loginRules = {
        email: combine(required('Email'), isEmail, isUniversityEmail),
        password: required('Password'),
    };

    const registerRules = {
        name: combine(required('Full name'), minLength('Full name', 3)),
        rollNo: combine(required('Roll number'), (v) =>
            v && !/^BL\.EN\.[A-Z][0-9][A-Z]+[0-9]+$/i.test(v)
                ? 'Enter a valid roll number (e.g. BL.EN.U4CSE21001).'
                : null
        ),
        dept: required('Department'),
        year: required('Year'),
        email: combine(required('Email'), isEmail, isUniversityEmail),
        password: combine(required('Password'), passwordStrength),
    };

    const { errors, validate, clearFieldError, clearErrors } = useFormValidation(
        isRegistering ? registerRules : loginRules
    );

    useEffect(() => {
        // Only auto-redirect if we aren't in the middle of a login process
        if (isAuthenticated && !loading) {
            if (user?.role === ROLES.ADMIN && loginMode === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, user, navigate, loading, loginMode]);

    const markTouched = (field) => setTouched(prev => ({ ...prev, [field]: true }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        const values = isRegistering
            ? { name, rollNo, dept, year, email, password }
            : { email, password };

        const isValid = validate(values);
        if (!isValid) return; // Stop — inline errors already shown

        setLoading(true);
        try {
            if (isRegistering) {
                await register(email, password, rollNo, name, dept, year);
                toast.success('Registration successful! Please check your university email.');
                setIsRegistering(false);
            } else {
                const firebaseUser = await login(email, password);

                // If in Admin mode, we must verify role immediately
                if (loginMode === 'admin') {
                    const userDoc = await getDocument('users', firebaseUser.uid);
                    if (userDoc.role !== ROLES.ADMIN) {
                        await logout();
                        toast.error('Access Denied: This account does not have administrative privileges.', { icon: '🛡️' });
                        setLoading(false);
                        return;
                    }
                    toast.success('Admin authenticated successfully!');
                    navigate('/admin/dashboard');
                } else {
                    toast.success('Signed in successfully!');
                    navigate('/');
                }
            }
        } catch (err) {
            let errorMsg = err.message || 'Something went wrong';
            if (errorMsg.includes('auth/invalid-credential') || errorMsg.includes('auth/wrong-password')) {
                errorMsg = 'Email or password is incorrect.';
            } else if (errorMsg.includes('auth/user-not-found')) {
                errorMsg = 'No account found with this email.';
            } else if (errorMsg.includes('auth/email-already-in-use')) {
                errorMsg = 'An account already exists with this email.';
            } else if (errorMsg.includes('auth/weak-password')) {
                errorMsg = 'Password should be at least 8 characters.';
            } else if (errorMsg.includes('auth/network-request-failed')) {
                errorMsg = 'Network error. Please check your connection.';
            } else if (errorMsg.includes('auth/too-many-requests')) {
                errorMsg = 'Too many attempts. Please wait a moment and try again.';
            }
            toast.error(errorMsg, { duration: 5000 });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        const emailErr = combine(required('Email'), isEmail)(email);
        if (emailErr) {
            toast.error('Enter your university email above first.');
            return;
        }
        try {
            setLoading(true);
            await resetPassword(email);
            toast.success('Password reset link sent! Check your inbox.');
        } catch (err) {
            toast.error(err.message || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsRegistering(!isRegistering);
        setName(''); setRollNo(''); setDept(''); setYear('');
        setEmail(''); setPassword('');
        setTouched({});
        clearErrors();
    };

    // ─── Shared input+error block ───────────────────────────────────────────
    const Field = ({ id, label, required: req, hint, children }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor={id} style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {label}{req && <span style={{ color: 'var(--error)', marginLeft: '2px' }}>*</span>}
            </label>
            {children}
            <FieldError error={errors[id]} />
            {hint && !errors[id] && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{hint}</span>
            )}
        </div>
    );

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
                <div style={{
                    position: 'absolute', top: '-50px', right: '-50px',
                    width: '150px', height: '150px', borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)',
                    opacity: 0.1, pointerEvents: 'none'
                }} />

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        display: 'inline-flex', padding: '1rem',
                        backgroundColor: loginMode === 'admin' ? 'var(--text-primary)' : 'var(--primary)', 
                        borderRadius: '1rem',
                        marginBottom: '1rem', color: 'white',
                        transition: 'background-color 0.3s ease'
                    }}>
                        <GraduationCap size={40} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: loginMode === 'admin' ? 'var(--text-primary)' : 'var(--primary)' }}>Hados</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {isRegistering ? 'Create your university account' : 
                         loginMode === 'admin' ? 'Admin Control Center' : 'Sign in to Mailer Daemon'}
                    </p>
                </div>

                {/* Role Toggle */}
                {!isRegistering && !verificationPending && (
                    <div style={{ 
                        display: 'flex', 
                        backgroundColor: 'var(--surface-hover)', 
                        padding: '0.25rem', 
                        borderRadius: '0.75rem', 
                        marginBottom: '1.5rem',
                        position: 'relative'
                    }}>
                        <button
                            type="button"
                            onClick={() => setLoginMode('user')}
                            style={{ 
                                flex: 1, padding: '0.625rem', borderRadius: '0.5rem', border: 'none', 
                                background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '700',
                                color: loginMode === 'user' ? 'var(--primary)' : 'var(--text-tertiary)',
                                position: 'relative', zIndex: 2, transition: 'color 0.2s'
                            }}
                        >
                            User Portal
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMode('admin')}
                            style={{ 
                                flex: 1, padding: '0.625rem', borderRadius: '0.5rem', border: 'none', 
                                background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '700',
                                color: loginMode === 'admin' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                                position: 'relative', zIndex: 2, transition: 'color 0.2s'
                            }}
                        >
                            Admin Access
                        </button>
                        
                        {/* Sliding background */}
                        <motion.div
                            animate={{ x: loginMode === 'user' ? 0 : '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            style={{
                                position: 'absolute', top: '0.25rem', left: '0.25rem',
                                width: 'calc(50% - 0.25rem)', height: 'calc(100% - 0.5rem)',
                                backgroundColor: 'var(--surface)',
                                borderRadius: '0.5rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                zIndex: 1
                            }}
                        />
                    </div>
                )}

                {verificationPending ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                        <div style={{
                            backgroundColor: 'rgba(52, 152, 219, 0.1)', padding: '2rem',
                            borderRadius: '1rem', marginBottom: '2rem',
                            border: '1px dashed var(--primary-light)'
                        }}>
                            <Mail size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Verify your email</h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                We've sent a verification link to:<br />
                                <strong style={{ color: 'var(--text-primary)' }}>{user?.email}</strong>
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button onClick={async () => { setLoading(true); await checkVerification(); setLoading(false); }}
                                disabled={loading} className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                                I've verified my email
                            </button>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={async () => { await resendVerification(); toast.success('Verification email resent!'); }}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'transparent', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>
                                    Resend Email
                                </button>
                                <button onClick={logout}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--error)', background: 'transparent', color: 'var(--error)', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Wrong email?
                                <button onClick={() => { logout(); setIsRegistering(true); }}
                                    style={{ marginLeft: '0.5rem', color: 'var(--primary)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                    Register again
                                </button>
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* ── Register-only fields ─────────────────────── */}
                            <AnimatePresence>
                                {isRegistering && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="grid-1-col-md"
                                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}
                                    >
                                        <Field id="name" label="Full Name" required hint="As it appears on your ID card">
                                            <input
                                                id="name" type="text" placeholder="e.g. John Doe"
                                                value={name}
                                                onChange={(e) => { setName(e.target.value); clearFieldError('name'); }}
                                                onBlur={() => markTouched('name')}
                                                style={{ ...baseInput, ...inputBorderStyle(errors.name, touched.name, name.length >= 3) }}
                                            />
                                        </Field>

                                        <Field id="rollNo" label="Roll Number" required hint="e.g. BL.EN.U4CSE21001">
                                            <input
                                                id="rollNo" type="text" placeholder="BL.EN.U4..."
                                                value={rollNo}
                                                onChange={(e) => { setRollNo(e.target.value.toUpperCase()); clearFieldError('rollNo'); }}
                                                onBlur={() => markTouched('rollNo')}
                                                style={{ ...baseInput, ...inputBorderStyle(errors.rollNo, touched.rollNo, rollNo.length > 5) }}
                                            />
                                        </Field>

                                        <Field id="dept" label="Department" required>
                                            <select
                                                id="dept" value={dept}
                                                onChange={(e) => { setDept(e.target.value); clearFieldError('dept'); }}
                                                onBlur={() => markTouched('dept')}
                                                style={{ ...baseInput, ...inputBorderStyle(errors.dept, touched.dept, !!dept), backgroundColor: 'var(--surface)' }}
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
                                        </Field>

                                        <Field id="year" label="Year" required>
                                            <select
                                                id="year" value={year}
                                                onChange={(e) => { setYear(e.target.value); clearFieldError('year'); }}
                                                onBlur={() => markTouched('year')}
                                                style={{ ...baseInput, ...inputBorderStyle(errors.year, touched.year, !!year), backgroundColor: 'var(--surface)' }}
                                            >
                                                <option value="">Select Year</option>
                                                <option value="1st Year">1st Year</option>
                                                <option value="2nd Year">2nd Year</option>
                                                <option value="3rd Year">3rd Year</option>
                                                <option value="4th Year">4th Year</option>
                                            </select>
                                        </Field>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ── Email ───────────────────────────────────── */}
                            <Field id="email" label="University Email" required hint="e.g. bl.en.u4cse21@bl.students.amrita.edu">
                                <input
                                    id="email" type="email"
                                    placeholder="bl.en.u4...@bl.students.amrita.edu"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                                    onBlur={() => markTouched('email')}
                                    style={{ ...baseInput, ...inputBorderStyle(errors.email, touched.email, email.includes('@amrita')) }}
                                />
                            </Field>

                            {/* ── Password ────────────────────────────────── */}
                            <Field id="password" label="Password" required>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
                                        onBlur={() => markTouched('password')}
                                        style={{ ...baseInput, ...inputBorderStyle(errors.password, touched.password, password.length >= 8), paddingRight: '2.75rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: '0.75rem', top: '50%',
                                            transform: 'translateY(-50%)', background: 'none',
                                            border: 'none', cursor: 'pointer',
                                            color: 'var(--text-secondary)', padding: '0.25rem'
                                        }}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {/* Strength bar only on registration */}
                                {isRegistering && <PasswordStrengthBar password={password} />}

                                {/* Forgot password link on login */}
                                {!isRegistering && (
                                    <button type="button" onClick={handleForgotPassword}
                                        style={{ alignSelf: 'flex-end', fontSize: '0.8rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', marginTop: '-0.1rem' }}>
                                        Forgot Password?
                                    </button>
                                )}
                            </Field>

                            {/* ── Submit ──────────────────────────────────── */}
                            <button
                                type="submit" disabled={loading} className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem', opacity: loading ? 0.8 : 1 }}
                            >
                                {loading
                                    ? <><div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite' }} /> Processing…</>
                                    : isRegistering
                                    ? <><UserPlus size={20} /> Create Account</>
                                    : <><LogIn size={20} /> Sign In</>}
                            </button>
                        </form>

                        {/* Toggle mode */}
                        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                            <button onClick={switchMode}
                                style={{ color: 'var(--primary)', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
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