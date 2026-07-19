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

        // Normalize school_code: lowercase, trim whitespace, replace spaces with hyphens
        if ($this->has('school_code')) {
            $this->merge([
                'school_code' => strtolower(trim((string) $this->input('school_code'))),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            // School Data
            'school_name'     => ['required', 'string', 'max:255'],
            'school_code'     => [
                'required',
                'string',
                'min:3',
                'max:40',
                'regex:/^[a-z0-9][a-z0-9\-]*[a-z0-9]$/',
                'unique:schools,school_code',
            ],
            'school_logo'     => ['required', 'file', 'image', 'max:5120'],
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
            'school_code' => 'رمز المدرسة',
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

        $documents = array_merge(
            is_array($this->input('documents')) ? $this->input('documents') : [],
            is_array($this->file('documents')) ? $this->file('documents') : []
        );

        foreach (array_keys($documents) as $index) {
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

    /**
     * Localized validation messages.
     */
    public function messages(): array
    {
        return [
            'school_name.required'    => 'اسم المدرسة مطلوب.',
            'school_code.required'    => 'رمز المدرسة مطلوب.',
            'school_code.min'         => 'رمز المدرسة يجب ألا يقل عن 3 أحرف.',
            'school_code.max'         => 'رمز المدرسة يجب ألا يتجاوز 40 حرفاً.',
            'school_code.regex'       => 'رمز المدرسة يجب أن يحتوي فقط على أحرف إنجليزية صغيرة وأرقام وشرطات، ولا يبدأ أو ينتهي بشرطة.',
            'school_code.unique'      => 'رمز المدرسة هذا مستخدم بالفعل. يرجى اختيار رمز آخر.',
            'school_logo.required'    => 'شعار المدرسة مطلوب.',
            'school_logo.file' => 'شعار المدرسة المرفوع غير صالح.',
            'school_logo.image' => 'يجب أن يكون الشعار صورة.',
            'school_logo.max' => 'حجم الشعار يجب ألا يتجاوز 5 ميجابايت.',
            'school_phone.required' => 'هاتف المدرسة مطلوب.',
            'school_phone_zone.required' => 'مفتاح الدولة لهاتف المدرسة مطلوب.',
            'school_country.required' => 'دولة المدرسة مطلوبة.',
            'school_city.required' => 'مدينة المدرسة مطلوبة.',
            'school_location.required' => 'رابط الموقع مطلوب.',
            'school_address.required' => 'العنوان مطلوب.',
            'user_name.required' => 'اسم المدير مطلوب.',
            'user_email.required' => 'البريد الإلكتروني للمدير مطلوب.',
            'user_email.email' => 'يجب إدخال بريد إلكتروني صحيح.',
            'user_email.unique' => 'البريد الإلكتروني مستخدم بالفعل.',
            'user_phone.required' => 'رقم هاتف المدير مطلوب.',
            'user_phone_zone.required' => 'مفتاح الدولة لهاتف المدير مطلوب.',
            'user_country.required' => 'جنسية المدير مطلوبة.',
            'user_residence.required' => 'دولة إقامة المدير مطلوبة.',
            'user_city.required' => 'مدينة المدير مطلوبة.',
            'user_password.required' => 'كلمة المرور مطلوبة.',
            'user_password.min' => 'كلمة المرور يجب ألا تقل عن 8 أحرف.',
            'user_password.confirmed' => 'تأكيد كلمة المرور غير متطابق.',
            'documents.*.name.required_with' => 'اسم الوثيقة مطلوب.',
            'documents.*.certificate_type.required_with' => 'نوع الوثيقة مطلوب.',
            'documents.*.certificate_type.in' => 'نوع الوثيقة المحدد غير صالح.',
            'documents.*.riwayah.required_if' => 'الرواية مطلوبة لهذا النوع من الوثائق.',
            'documents.*.file.required_with' => 'يجب رفع ملف الوثيقة.',
            'documents.*.file.file' => 'الملف المرفوع غير صالح.',
            'documents.*.file.mimes' => 'يجب أن يكون الملف من نوع: pdf, jpg, jpeg, png.',
            'documents.*.file.max' => 'حجم الملف يجب ألا يتجاوز 5 ميجابايت.',
        ];
    }
}
