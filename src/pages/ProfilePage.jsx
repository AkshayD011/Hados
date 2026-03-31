import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Hash, BookOpen, Upload, CheckCircle, Save, Edit2, X, Camera } from 'lucide-react';
import { api } from '../utils/api';

const ProfilePage = () => {
    const { user } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [isVerified, setIsVerified] = useState(user?.isIdVerified || false);
    
    // Inline Bio Edit State
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState(user?.bio || '');
    
    // Avatar Edit State
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [avatarUrlInput, setAvatarUrlInput] = useState('');
    const [avatarPayload, setAvatarPayload] = useState('');

    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef(null);
    const avatarFileInputRef = useRef(null);

    useEffect(() => {
        setIsVerified(user?.isIdVerified || false);
        if (!isEditingBio) setBioText(user?.bio || '');
        if (!isEditingAvatar) {
            setAvatarUrlInput(user?.avatar?.startsWith('http') ? user.avatar : '');
            setAvatarPayload('');
        }
    }, [user, isEditingAvatar, isEditingBio]);

    const handleUploadClick = () => {
        if (!isVerified) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        setIsUploading(true);
        try {
            await api.profile.verifyIdCard(user.uid, file);
            setIsVerified(true);
        } catch (error) {
            console.error("Failed to upload ID card", error);
            alert("Failed to upload ID card. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveBio = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await api.profile.updateProfile(user.uid, { bio: bioText });
            setIsEditingBio(false);
            window.location.reload(); 
        } catch(e) {
            console.error(e);
            alert("Failed to save bio.");
            setIsSaving(false);
        }
    };

    const handleAvatarFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 800000) { // 800KB max to be safe for 1MB Firestore limit
                alert("Image size is too large (must be under 800KB). Please select a smaller file.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPayload(reader.result);
                setAvatarUrlInput(''); // Clear url input
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveAvatar = async () => {
        if (!user) return;
        setIsSaving(true);
        const finalAvatar = avatarPayload || avatarUrlInput;
        try {
            await api.profile.updateProfile(user.uid, { avatar: finalAvatar });
            setIsEditingAvatar(false);
            window.location.reload(); 
        } catch(e) {
            console.error(e);
            alert("Failed to save profile picture.");
            setIsSaving(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await api.profile.updateProfile(user.uid, { avatar: '' });
            setIsEditingAvatar(false);
            window.location.reload(); 
        } catch(e) {
            console.error(e);
            alert("Failed to remove profile picture.");
            setIsSaving(false);
        }
    };

    return (
        <div className="profile-page animate-fade-in" style={{ position: 'relative' }}>
            
            {/* Avatar Edit Modal Overlay */}
            {isEditingAvatar && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="glass card-base" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
                        <button 
                            onClick={() => setIsEditingAvatar(false)}
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                            <X size={20} />
                        </button>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)' }}>Update Profile Picture</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Upload from System</label>
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/webp" 
                                    ref={avatarFileInputRef} 
                                    style={{ display: 'none' }} 
                                    onChange={handleAvatarFileChange}
                                />
                                <button 
                                    onClick={() => avatarFileInputRef.current?.click()}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '2px dashed var(--border)', background: 'var(--surface-hover)', cursor: 'pointer', fontWeight: '600', color: 'var(--text-secondary)' }}
                                >
                                    Select Image File
                                </button>
                                {avatarPayload && <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem' }}>Image selected and encoded.</p>}
                            </div>

                            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600' }}>OR</div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Image URL</label>
                                <input 
                                    type="text" 
                                    value={avatarUrlInput}
                                    onChange={(e) => {
                                        setAvatarUrlInput(e.target.value);
                                        if (e.target.value) setAvatarPayload('');
                                    }}
                                    placeholder="https://example.com/avatar.jpg"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }}
                                />
                            </div>
                        </div>

                        {user?.avatar && (
                            <button 
                                onClick={handleRemoveAvatar}
                                disabled={isSaving}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'none', border: '1px solid var(--error)', color: 'var(--error)', cursor: 'pointer', fontWeight: '600', marginBottom: '1.5rem', opacity: isSaving ? 0.5 : 1 }}
                            >
                                Remove Current Picture
                            </button>
                        )}

                        <button 
                            className="btn-primary" 
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                            onClick={handleSaveAvatar}
                            disabled={isSaving || !(avatarUrlInput || avatarPayload)}
                        >
                            {isSaving ? 'Saving...' : <><Save size={18} /> Save Avatar</>}
                        </button>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    {user?.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt="Avatar" 
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '4px solid white',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                marginBottom: '1rem'
                            }} 
                        />
                    ) : (
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                            border: '4px solid white',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'MD'}
                        </div>
                    )}
                    
                    <button 
                        onClick={() => setIsEditingAvatar(true)}
                        style={{
                            position: 'absolute',
                            bottom: '15px',
                            right: '0',
                            backgroundColor: 'var(--accent)',
                            padding: '0.4rem',
                            borderRadius: '50%',
                            color: 'var(--primary)',
                            border: '2px solid white',
                            cursor: 'pointer'
                        }}
                    >
                        <Camera size={16} />
                    </button>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>{user?.name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user?.dept} • {user?.year}</p>
                
                {/* Inline Bio Section */}
                <div style={{ marginTop: '1.25rem', maxWidth: '400px', margin: '1.25rem auto 0' }}>
                    {isEditingBio ? (
                        <div style={{ 
                            display: 'flex', flexDirection: 'column', gap: '0.75rem', 
                            padding: '1rem', backgroundColor: 'var(--surface-hover)', 
                            borderRadius: '0.75rem', border: '1px solid var(--border)' 
                        }}>
                            <textarea 
                                value={bioText}
                                onChange={(e) => setBioText(e.target.value)}
                                placeholder="Add a short bio..."
                                rows={2}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '0.875rem', resize: 'none', outline: 'none' }}
                                autoFocus
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button 
                                    onClick={() => { setIsEditingBio(false); setBioText(user?.bio || ''); }} 
                                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', padding: '0.25rem 0.5rem', fontWeight: '500' }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveBio} 
                                    disabled={isSaving} 
                                    className="btn-primary"
                                    style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                >
                                    {isSaving ? 'Saving...' : <><Save size={14} /> Save</>}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <p style={{ fontSize: '0.9375rem', color: user?.bio ? 'var(--text-primary)' : 'var(--text-secondary)', fontStyle: 'italic', margin: 0, padding: '0 1rem' }}>
                                {user?.bio ? `"${user.bio}"` : "No bio added yet."}
                            </p>
                            <button 
                                onClick={() => setIsEditingBio(true)} 
                                style={{ 
                                    background: 'none', border: 'none', cursor: 'pointer', 
                                    color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem',
                                    fontSize: '0.8rem', fontWeight: '600', marginTop: '0.2rem'
                                }}
                            >
                                <Edit2 size={12} /> Edit Bio
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="glass card-base" style={{
                padding: '1.5rem',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Personal Information</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Hash size={18} color="var(--text-secondary)" />
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Roll Number</p>
                            <p style={{ fontWeight: '600' }}>{user?.rollNo}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Mail size={18} color="var(--text-secondary)" />
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>University Email</p>
                            <p style={{ fontWeight: '600' }}>{user?.email}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <BookOpen size={18} color="var(--text-secondary)" />
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Department</p>
                            <p style={{ fontWeight: '600' }}>{user?.dept}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass card-base" style={{
                padding: '1.5rem',
                border: isVerified ? '2px solid var(--success)' : undefined
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Student Verification</h3>
                    {isVerified && <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '700' }}>
                        <CheckCircle size={14} /> VERIFIED
                    </span>}
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    Please upload a clear photo of your University ID card to verify your student status.
                </p>

                <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange}
                />

                <div
                    onClick={handleUploadClick}
                    style={{
                        border: '2px dashed var(--border)',
                        borderRadius: '0.75rem',
                        padding: '2rem',
                        textAlign: 'center',
                        cursor: isVerified ? 'default' : 'pointer',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    {isUploading ? (
                        <p>Uploading ID Card...</p>
                    ) : isVerified ? (
                        <div style={{ color: 'var(--success)' }}>
                            <CheckCircle size={40} style={{ margin: '0 auto 0.5rem' }} />
                            <p style={{ fontWeight: '600' }}>ID Card Verified</p>
                        </div>
                    ) : (
                        <>
                            <Upload size={32} style={{ margin: '0 auto 0.5rem', color: 'var(--text-secondary)' }} />
                            <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>Upload ID Proof</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PNG, JPG up to 5MB</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
