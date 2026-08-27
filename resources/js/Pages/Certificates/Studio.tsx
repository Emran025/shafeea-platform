import React, { useState } from 'react';
import { Head } from '@inertiajs/react';

export default function CertificateStudio() {
    const [templateImage, setTemplateImage] = useState<string | null>(null);
    const [fields, setFields] = useState<any[]>([]);
    
    // Mock logic for drag and drop fields over image
    const addField = () => {
        setFields([...fields, { id: Date.now(), name: 'New Field', x: 50, y: 50, size: 24, color: '#000000' }]);
    };

    return (
        <div className="p-6">
            <Head title="استوديو الشهادات" />
            <h1 className="text-2xl font-bold mb-4">استوديو تصميم الشهادات</h1>
            
            <div className="flex gap-4">
                {/* Sidebar Controls */}
                <div className="w-1/4 bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">1. رفع القالب والخط</h3>
                    <input type="file" className="mb-4 w-full" accept="image/*" onChange={(e) => {
                        if (e.target.files?.[0]) {
                            setTemplateImage(URL.createObjectURL(e.target.files[0]));
                        }
                    }} />
                    
                    <h3 className="font-semibold mb-2">2. استيراد البيانات (Excel)</h3>
                    <input type="file" className="mb-4 w-full" accept=".xlsx,.csv" />

                    <h3 className="font-semibold mb-2">3. الحقول الديناميكية</h3>
                    <button onClick={addField} className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2">
                        + إضافة حقل جديد
                    </button>

                    <h3 className="font-semibold mb-2 mt-4">4. التصدير</h3>
                    <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
                        توليد الشهادات
                    </button>
                </div>

                {/* Canvas Area */}
                <div className="w-3/4 bg-gray-100 rounded shadow p-4 min-h-[600px] relative overflow-hidden">
                    {templateImage ? (
                        <div className="relative inline-block border border-dashed border-gray-400">
                            <img src={templateImage} alt="Template" className="max-w-full" />
                            {fields.map(field => (
                                <div 
                                    key={field.id}
                                    className="absolute border-2 border-blue-500 bg-white/50 px-2 py-1 cursor-move"
                                    style={{ left: `${field.x}px`, top: `${field.y}px`, color: field.color, fontSize: `${field.size}px` }}
                                >
                                    {field.name}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            يرجى رفع صورة قالب الشهادة للبدء
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
