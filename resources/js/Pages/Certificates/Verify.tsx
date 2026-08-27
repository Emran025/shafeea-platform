import React from 'react';
import { Head } from '@inertiajs/react';

interface VerifyProps {
    valid: boolean;
    certificate?: {
        uuid: string;
        recipient_name: string;
        created_at: string;
    };
    school_name?: string;
}

export default function CertificateVerify({ valid, certificate, school_name }: VerifyProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Head title="التحقق من الشهادة" />
            
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-6">نظام التحقق من الشهادات</h1>
                
                {valid && certificate ? (
                    <div>
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl text-green-600 font-bold mb-2">شهادة موثقة وصحيحة</h2>
                        
                        <div className="text-right bg-gray-50 p-4 rounded mt-4">
                            <p className="mb-2"><span className="font-semibold text-gray-600">المدرسة/الجهة:</span> {school_name}</p>
                            <p className="mb-2"><span className="font-semibold text-gray-600">اسم الحاصل على الشهادة:</span> {certificate.recipient_name}</p>
                            <p className="mb-2"><span className="font-semibold text-gray-600">رقم الشهادة:</span> <span className="text-xs text-gray-500">{certificate.uuid}</span></p>
                            <p><span className="font-semibold text-gray-600">تاريخ الإصدار:</span> {new Date(certificate.created_at).toLocaleDateString('ar-SA')}</p>
                        </div>
                        
                        <div className="mt-6 text-sm text-gray-500">
                            هذه الشهادة موقعة إلكترونياً ولا يمكن تزوير بياناتها.
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl text-red-600 font-bold mb-2">شهادة غير صالحة</h2>
                        <p className="text-gray-600">لم يتم العثور على هذه الشهادة أو أن التوقيع الإلكتروني غير متطابق.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
