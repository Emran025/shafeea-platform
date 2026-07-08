<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
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
        ];
    }
}
