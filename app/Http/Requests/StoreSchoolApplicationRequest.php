<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSchoolApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalize the admin email to lowercase before validation runs.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('user_email')) {
            $this->merge([
                'user_email' => mb_strtolower(trim((string) $this->input('user_email'))),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            // School Data
            'school_name' => ['required', 'string', 'max:255'],
            'school_logo' => ['required', 'file', 'image', 'max:5120'],
            'school_phone_zone' => ['required', 'string', 'max:10'],
            'school_phone' => ['required', 'string', 'max:255'],
            'school_country' => ['required', 'string', 'max:255'],
            'school_city' => ['required', 'string', 'max:255'],
            'school_location' => ['required', 'string', 'max:255'],
            'school_address' => ['required', 'string', 'max:255'],

            // Admin (User) Data
            'user_name' => ['required', 'string', 'max:255'],
            'user_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'user_phone_zone' => ['required', 'string', 'max:10'],
            'user_phone' => ['required', 'string', 'max:255'],
            'user_whatsapp_zone' => ['nullable', 'string', 'max:10'],
            'user_whatsapp' => ['nullable', 'string', 'max:255'],
            'is_whatsapp_different' => ['boolean'],
            'user_country' => ['required', 'string', 'max:255'],
            'user_residence' => ['required', 'string', 'max:255'],
            'user_city' => ['required', 'string', 'max:255'],
            'user_password' => ['required', 'string', 'min:8', 'confirmed'],

            // Documents
            'documents' => ['nullable', 'array'],
            'documents.*.name' => ['required_with:documents', 'string', 'max:255'],
            'documents.*.certificate_type' => ['required_with:documents', 'string', 'in:شهادة حفظ قران,شهادة إجازة في القران,رخصة,سجل مهني,سيرة ذاتية,Other'],
            'documents.*.certificate_type_other' => ['nullable', 'string', 'max:255'],
            'documents.*.riwayah' => ['required_if:documents.*.certificate_type,شهادة حفظ قران,شهادة إجازة في القران', 'nullable', 'string'],
            'documents.*.issuing_place' => ['nullable', 'string', 'max:255'],
            'documents.*.issuing_date' => ['nullable', 'date'],
            'documents.*.file' => ['required_with:documents', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }

    /**
     * Human-readable field names so validation messages (and anything the
     * frontend surfaces verbatim) read naturally instead of showing raw
     * dot-notation keys like "documents.0.file".
     */
    public function attributes(): array
    {
        $attributes = [
            'school_name' => 'اسم المدرسة',
            'school_logo' => 'شعار المدرسة',
            'school_phone' => 'هاتف المدرسة',
            'school_phone_zone' => 'مفتاح الدولة لهاتف المدرسة',
            'school_country' => 'دولة المدرسة',
            'school_city' => 'مدينة المدرسة',
            'school_location' => 'رابط الموقع',
            'school_address' => 'العنوان',
            'user_name' => 'اسم المدير',
            'user_email' => 'البريد الإلكتروني',
            'user_phone' => 'رقم الهاتف',
            'user_phone_zone' => 'مفتاح الدولة للهاتف',
            'user_whatsapp' => 'رقم الواتساب',
            'user_whatsapp_zone' => 'مفتاح الدولة للواتساب',
            'user_country' => 'الجنسية',
            'user_residence' => 'دولة الإقامة',
            'user_city' => 'المدينة',
            'user_password' => 'كلمة المرور',
            'documents' => 'الوثائق',
        ];

        foreach ($this->input('documents', []) as $index => $document) {
            $attributes["documents.{$index}.name"] = "اسم الوثيقة رقم " . ($index + 1);
            $attributes["documents.{$index}.certificate_type"] = "نوع الوثيقة رقم " . ($index + 1);
            $attributes["documents.{$index}.certificate_type_other"] = "نوع الوثيقة (أخرى) رقم " . ($index + 1);
            $attributes["documents.{$index}.riwayah"] = "الرواية للوثيقة رقم " . ($index + 1);
            $attributes["documents.{$index}.issuing_place"] = "مكان إصدار الوثيقة رقم " . ($index + 1);
            $attributes["documents.{$index}.issuing_date"] = "تاريخ إصدار الوثيقة رقم " . ($index + 1);
            $attributes["documents.{$index}.file"] = "ملف الوثيقة رقم " . ($index + 1);
        }

        return $attributes;
    }
}
