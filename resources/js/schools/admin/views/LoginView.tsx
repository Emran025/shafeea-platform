import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_LANG } from '../lang/en';
import { login } from '../api/adminClient';
import type { Permission } from '../context/AuthContext';
import Button from '../components/Button';

const L = ADMIN_LANG.login;

interface Props {
    onLogin: () => void;
}

const IconEmail = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const IconLock = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const IconEye = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconEyeOff = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
);

export default function LoginView({ onLogin }: Props) {
    const { setSession } = useAuth();
    const [email,       setEmail]       = useState('');
    const [password,    setPassword]    = useState('');
    const [showPass,    setShowPass]    = useState(false);
    const [error,       setError]       = useState('');
    const [loading,     setLoading]     = useState(false);
    const [emailFocus,  setEmailFocus]  = useState(false);
    const [passFocus,   setPassFocus]   = useState(false);

    const handleSignIn = async () => {
        if (!email.trim() || !password) return;
        try {
            setLoading(true);
            setError('');
            const res = await login(email.trim(), password);
            setSession(res.actor, res.permissions as Permission[]);
            onLogin();
        } catch (e) {
            setError((e as Error).message || 'Sign in failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="adm-login">
            <div className="adm-login__bg" aria-hidden="true">
                <div className="adm-login__bg-grid" />
                <div className="adm-login__bg-glow" />
            </div>

            <div className="adm-login__card">
                {/* Brand */}
                <div className="adm-login__brand">
                    <div className="adm-login__brand-mark"><span>AC</span></div>
                    <div>
                        <div className="adm-login__brand-name">{window.__SCHOOL_DATA__?.name || "منصة شفيع"}</div>
                        <div className="adm-login__brand-sub">Content Engine</div>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="adm-login__heading">{L.heading}</h1>
                <p className="adm-login__sub">{L.subheading}</p>

                {/* Form wrapper */}
                <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }} noValidate>
                {/* Email field */}
                <div className="adm-login__field">
                    <label className="adm-login__label" htmlFor="login-email">Email address</label>
                    <div className={`adm-login__input-wrap${emailFocus ? ' adm-login__input-wrap--focus' : ''}${error ? ' adm-login__input-wrap--error' : ''}`}>
                        <span className="adm-login__input-icon">
                            <IconEmail />
                        </span>
                        <input
                            id="login-email"
                            className="adm-login__input-field"
                            type="email"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                            placeholder="admin@accsystemerp.com"
                        />
                    </div>
                </div>

                {/* Password field */}
                <div className="adm-login__field">
                    <label className="adm-login__label" htmlFor="login-password">Password</label>
                    <div className={`adm-login__input-wrap${passFocus ? ' adm-login__input-wrap--focus' : ''}${error ? ' adm-login__input-wrap--error' : ''}`}>
                        <span className="adm-login__input-icon">
                            <IconLock />
                        </span>
                        <input
                            id="login-password"
                            className="adm-login__input-field"
                            type={showPass ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            onFocus={() => setPassFocus(true)}
                            onBlur={() => setPassFocus(false)}
                            placeholder="Enter your password"
                        />
                        <Button
                            type="button"
                            className="adm-login__input-toggle"
                            onClick={() => setShowPass(v => !v)}
                            tabIndex={-1}
                            aria-label={showPass ? 'Hide password' : 'Show password'}
                        >
                            {showPass ? <IconEyeOff /> : <IconEye />}
                        </Button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="adm-login__error-band">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {error}
                    </div>
                )}

                {/* Submit */}
                <Button
                    type="submit"
                    className="adm-login__submit"
                    disabled={loading || !email.trim() || !password}
                >
                    {loading ? (
                        <><span className="adm-login__spinner" /> Signing in…</>
                    ) : L.submitBtn}
                </Button>
                </form>

                <p className="adm-login__footer">
                    {window.__SCHOOL_DATA__?.name || "منصة شفيع"} · {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
