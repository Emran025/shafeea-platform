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
        ], fn($value) => $value !== null));
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
            'memorization_level' => ['required', 'integer', 'min:-604', 'max:604'],

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

        $documents = array_merge(
            is_array($this->input('documents')) ? $this->input('documents') : [],
            is_array($this->file('documents')) ? $this->file('documents') : []
        );

        foreach (array_keys($documents) as $index) {
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

    /**
     * Localized validation messages.
     */
    public function messages(): array
    {
        return [
            'user_name.required' => 'الاسم الكامل مطلوب.',
            'user_email.required' => 'البريد الإلكتروني مطلوب.',
            'user_email.email' => 'يجب إدخال بريد إلكتروني صحيح.',
            'user_email.unique' => 'البريد الإلكتروني مستخدم بالفعل.',
            'username.required' => 'اسم المستخدم مطلوب.',
            'username.unique' => 'اسم المستخدم هذا محجوز بالفعل.',
            'user_phone.required' => 'رقم الهاتف مطلوب.',
            'user_phone_zone.required' => 'مفتاح الدولة للهاتف مطلوب.',
            'user_country.required' => 'الجنسية مطلوبة.',
            'user_residence.required' => 'دولة الإقامة مطلوبة.',
            'user_city.required' => 'المدينة مطلوبة.',
            'user_password.required' => 'كلمة المرور مطلوبة.',
            'user_password.min' => 'كلمة المرور يجب ألا تقل عن 8 أحرف.',
            'user_password.confirmed' => 'تأكيد كلمة المرور غير متطابق.',
            'bio.required' => 'النبذة التعريفية مطلوبة.',
            'qualifications.required' => 'المؤهل الأكاديمي مطلوب.',
            'memorization_level.required' => 'مستوى الحفظ مطلوب.',
            'memorization_level.integer' => 'مستوى الحفظ يجب أن يكون رقماً.',
            'memorization_level.min' => 'مستوى الحفظ لا يمكن أن يكون أقل من 0.',
            'memorization_level.max' => 'مستوى الحفظ لا يمكن أن يزيد عن 604 صفحات.',
            'documents.required' => 'يجب إرفاق وثيقة واحدة على الأقل.',
            'documents.*.name.required' => 'اسم الشهادة/الوثيقة مطلوب.',
            'documents.*.certificate_type.required' => 'نوع الشهادة مطلوب.',
            'documents.*.certificate_type.in' => 'نوع الشهادة المحدد غير صالح.',
            'documents.*.riwayah.required_if' => 'الرواية مطلوبة لهذا النوع من الشهادات.',
            'documents.*.file.required' => 'يجب رفع ملف الشهادة.',
            'documents.*.file.file' => 'الملف المرفوع غير صالح.',
            'documents.*.file.mimes' => 'يجب أن يكون الملف من نوع: pdf, jpg, jpeg, png.',
            'documents.*.file.max' => 'حجم الملف يجب ألا يتجاوز 5 ميجابايت.',
        ];
    }
}
