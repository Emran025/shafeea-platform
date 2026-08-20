import React, { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

/**
 * NewsletterBanner — compact inline sign-up form for the newsroom.
 * Submits to POST /api/newsletter/subscribe.
 * Handles: success, already-subscribed, validation errors, server errors.
 */
export default function NewsletterBanner() {
    const [name,   setName]   = useState('');
    const [email,  setEmail]  = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [errMsg, setErrMsg] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (status === 'loading' || status === 'success') return;

        setStatus('loading');
        setErrMsg('');

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body:    JSON.stringify({ name: name.trim() || undefined, email: email.trim(), source: 'newsroom' }),
            });

            if (res.status === 201) {
                setStatus('success');
                return;
            }
            if (res.status === 409) {
                setStatus('duplicate');
                return;
            }
            const json = await res.json().catch(() => ({}));
            setErrMsg(json.message ?? 'Something went wrong. Please try again.');
            setStatus('error');
        } catch {
            setErrMsg('Network error. Please check your connection and try again.');
            setStatus('error');
        }
    }

    function reset() {
        setName('');
        setEmail('');
        setStatus('idle');
        setErrMsg('');
    }

    return (
        <div className="nl-banner">
            <div className="nl-banner__left">
                <p className="nl-banner__eyebrow">Stay in the loop</p>
                <h3 className="nl-banner__heading">
                    تحديثات المدرسة مباشرة في بريدك.
                </h3>
                <p className="nl-banner__sub">
                    Product launches, company news, and ecosystem insights — no spam, unsubscribe anytime.
                </p>
            </div>

            <div className="nl-banner__right">
                {status === 'success' ? (
                    <div className="nl-banner__success">
                        <span className="nl-banner__success-icon">✓</span>
                        <div>
                            <p className="nl-banner__success-title">You're subscribed!</p>
                            <p className="nl-banner__success-sub">
                                مرحباً بكم في الأخبار والفعاليات. We'll be in touch soon.
                            </p>
                        </div>
                    </div>
                ) : status === 'duplicate' ? (
                    <div className="nl-banner__success">
                        <span className="nl-banner__success-icon">✓</span>
                        <div>
                            <p className="nl-banner__success-title">Already subscribed</p>
                            <p className="nl-banner__success-sub">
                                That email is already on the list — you're all set.{' '}
                                <button className="nl-banner__link-btn" onClick={reset}>Use a different email?</button>
                            </p>
                        </div>
                    </div>
                ) : (
                    <form className="nl-banner__form" onSubmit={handleSubmit} noValidate>
                        <div className="nl-banner__fields">
                            <input
                                className="nl-banner__input"
                                type="text"
                                placeholder="Your name (optional)"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoComplete="name"
                                disabled={status === 'loading'}
                            />
                            <input
                                className="nl-banner__input"
                                type="email"
                                placeholder="Work email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                disabled={status === 'loading'}
                            />
                        </div>

                        {status === 'error' && (
                            <p className="nl-banner__error">{errMsg}</p>
                        )}

                        <button
                            className={`nl-banner__btn${status === 'loading' ? ' nl-banner__btn--loading' : ''}`}
                            type="submit"
                            disabled={status === 'loading' || !email.trim()}
                        >
                            {status === 'loading' ? (
                                <span className="nl-banner__spinner" aria-hidden="true" />
                            ) : null}
                            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
                        </button>

                        <p className="nl-banner__privacy">
                            No spam. Unsubscribe at any time.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
