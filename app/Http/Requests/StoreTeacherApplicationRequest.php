<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalize email/username to lowercase before validation runs, so
     * uniqueness checks and stored values are consistent regardless of
     * how the user typed them.
     */
    protected function prepareForValidation(): void
    {
        $this->merge(array_filter([
            'user_email' => $this->has('user_email') ? mb_strtolower(trim((string) $this->input('user_email'))) : null,
            'username' => $this->has('username') ? mb_strtolower(trim((string) $this->input('username'))) : null,
        ], fn ($value) => $value !== null));
    }

    public function rules(): array
    {
        return [
            // User Data
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

            // Applicant Data
            'school_id' => ['nullable', 'exists:schools,id'],
            'bio' => ['required', 'string'],
            'qualifications' => ['required', 'string'],
            'memorization_level' => ['required', 'integer', 'min:0', 'max:30'],

            // Documents
            'documents' => ['required', 'array'],
            'documents.*.name' => ['required', 'string', 'max:255'],
            'documents.*.certificate_type' => ['required', 'string', 'in:شهادة حفظ قران,شهادة إجازة في القران,سيرة ذاتية,Other'],
            'documents.*.certificate_type_other' => ['nullable', 'string', 'max:255'],
            'documents.*.riwayah' => ['required_if:documents.*.certificate_type,شهادة حفظ قران,شهادة إجازة في القران', 'nullable', 'string'],
            'documents.*.issuing_place' => ['nullable', 'string', 'max:255'],
            'documents.*.issuing_date' => ['nullable', 'date'],
            'documents.*.file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],

            // Username
            'username' => ['required', 'string', 'max:255', new \App\Rules\UniqueUsername],
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
            'user_name' => 'الاسم الكامل',
            'user_email' => 'البريد الإلكتروني',
            'username' => 'اسم المستخدم',
            'user_phone' => 'رقم الهاتف',
            'user_phone_zone' => 'مفتاح الدولة للهاتف',
            'user_whatsapp' => 'رقم الواتساب',
            'user_whatsapp_zone' => 'مفتاح الدولة للواتساب',
            'user_country' => 'الجنسية',
            'user_residence' => 'دولة الإقامة',
            'user_city' => 'المدينة',
            'user_password' => 'كلمة المرور',
            'school_id' => 'المدرسة',
            'bio' => 'النبذة التعريفية',
            'qualifications' => 'المؤهل الأكاديمي',
            'memorization_level' => 'مستوى الحفظ',
            'documents' => 'الوثائق',
        ];

        foreach ($this->input('documents', []) as $index => $document) {
            $attributes["documents.{$index}.name"] = "اسم الشهادة رقم " . ($index + 1);
            $attributes["documents.{$index}.certificate_type"] = "نوع الشهادة رقم " . ($index + 1);
            $attributes["documents.{$index}.certificate_type_other"] = "نوع الشهادة (أخرى) رقم " . ($index + 1);
            $attributes["documents.{$index}.riwayah"] = "الرواية للشهادة رقم " . ($index + 1);
            $attributes["documents.{$index}.issuing_place"] = "مكان إصدار الشهادة رقم " . ($index + 1);
            $attributes["documents.{$index}.issuing_date"] = "تاريخ إصدار الشهادة رقم " . ($index + 1);
            $attributes["documents.{$index}.file"] = "ملف الشهادة رقم " . ($index + 1);
        }

        return $attributes;
    }
}
