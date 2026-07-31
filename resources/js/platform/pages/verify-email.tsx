import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { SharedData } from '../types';
import { Mail, RefreshCw, LogOut, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function VerifyEmail() {
    const { auth } = usePage<SharedData>().props;
    const [resent, setResent] = useState(false);

    const { post: postResend, processing: resending } = useForm({});
    const { post: postLogout, processing: loggingOut } = useForm({});

    function handleResend(e: React.FormEvent) {
        e.preventDefault();
        postResend(route('verification.send'), {
            onSuccess: () => setResent(true),
        });
    }

    function handleLogout(e: React.FormEvent) {
        e.preventDefault();
        postLogout(route('logout'));
    }

    return (
        <>
            <Head title="تأكيد البريد الإلكتروني — منصة شفيع" />

            {/* Full-page gradient background */}
            <div
                className="min-h-screen flex items-center justify-center p-4"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
                    fontFamily: "'Cairo', sans-serif",
                }}
                dir="rtl"
            >
                {/* Decorative background circles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                </div>

                <div className="relative w-full max-w-md">
                    {/* Card */}
                    <div
                        className="rounded-2xl p-8 shadow-2xl border"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
                            >
                                <Mail className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-white text-center mb-2">
                            تأكيد بريدك الإلكتروني
                        </h1>
                        <p className="text-slate-400 text-center text-sm mb-6 leading-relaxed">
                            أرسلنا رابط التفعيل إلى{' '}
                            <span className="text-sky-400 font-semibold">{auth.user.email}</span>
                            .{' '}انقر على الرابط في البريد للوصول إلى لوحة التحكم.
                        </p>

                        {/* Status indicator */}
                        <div
                            className="flex items-center gap-3 rounded-xl p-4 mb-6"
                            style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}
                        >
                            <Clock className="w-5 h-5 text-sky-400 shrink-0" />
                            <p className="text-sky-300 text-sm">
                                في انتظار التأكيد — تحقق من صندوق الوارد والبريد المزعج
                            </p>
                        </div>

                        {/* Success message after resend */}
                        {resent && (
                            <div
                                className="flex items-center gap-3 rounded-xl p-4 mb-6"
                                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
                            >
                                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                <p className="text-emerald-300 text-sm">تم إرسال رابط التفعيل مجدداً إلى بريدك.</p>
                            </div>
                        )}

                        {/* Resend button */}
                        <form onSubmit={handleResend} className="mb-4">
                            <button
                                type="submit"
                                disabled={resending || resent}
                                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50"
                                style={{
                                    background: resent
                                        ? 'rgba(34,197,94,0.2)'
                                        : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                                    boxShadow: resent ? 'none' : '0 4px 14px rgba(14,165,233,0.35)',
                                }}
                            >
                                <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                                {resent ? 'تم الإرسال ✓' : resending ? 'جارٍ الإرسال…' : 'إعادة إرسال رابط التفعيل'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-slate-500 text-xs">أو</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Logout */}
                        <form onSubmit={handleLogout}>
                            <button
                                type="submit"
                                disabled={loggingOut}
                                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-slate-400 hover:text-white transition-colors duration-200 border border-white/10 hover:border-white/20 disabled:opacity-50"
                            >
                                <LogOut className="w-4 h-4" />
                                {loggingOut ? 'جارٍ تسجيل الخروج…' : 'تسجيل الخروج'}
                            </button>
                        </form>
                    </div>

                    {/* Footer note */}
                    <p className="text-center text-slate-600 text-xs mt-6">
                        يُرجى الانتظار بضع دقائق — قد تتأخر بعض رسائل البريد في الوصول.
                    </p>
                </div>
            </div>
        </>
    );
}
