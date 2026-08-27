import React from 'react';
import { Head } from '@inertiajs/react';

interface VerifyProps {
    isValid: boolean;
    message?: string;
    certificate?: {
        id: string;
        recipient_name: string;
        issue_date: string;
        file_url_jpg: string;
    };
}

export default function Verify({ isValid, message, certificate }: VerifyProps) {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            <Head title="التحقق من الشهادة" />
            
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900">أكاديمية شفيع</h1>
                    <p className="mt-2 text-lg text-gray-600">بوابة التحقق من الشهادات الرقمية</p>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    {isValid && certificate ? (
                        <div className="px-4 py-5 sm:p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">شهادة موثقة وصحيحة</h2>
                            <p className="text-gray-600 mb-8">تم التحقق من التوقيع الرقمي للشهادة بنجاح.</p>
                            
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 text-right border-t border-gray-200 pt-6">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">اسم صاحب الشهادة</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">{certificate.recipient_name}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">تاريخ الإصدار</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">{certificate.issue_date}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">الرقم المرجعي</dt>
                                    <dd className="mt-1 text-sm text-gray-900 font-mono">{certificate.id}</dd>
                                </div>
                            </dl>

                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <img src={certificate.file_url_jpg} alt="صورة الشهادة" className="max-w-full h-auto rounded-lg shadow-md mx-auto" />
                            </div>
                        </div>
                    ) : (
                        <div className="px-4 py-5 sm:p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                                <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">الشهادة غير صالحة</h2>
                            <p className="text-red-600">{message || 'تعذر التحقق من صحة هذه الشهادة أو التوقيع الرقمي غير متطابق.'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
