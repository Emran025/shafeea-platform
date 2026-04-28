<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSchoolApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // School Data
            'school_name' => ['required', 'string', 'max:255'],
            'school_logo' => ['required', 'file', 'image', 'max:5120'],
            'school_phone' => ['required', 'string', 'max:255'],
            'school_country' => ['required', 'string', 'max:255'],
            'school_city' => ['required', 'string', 'max:255'],
            'school_location' => ['required', 'string', 'max:255'],
            'school_address' => ['required', 'string', 'max:255'],

            // Admin (User) Data
            'user_name' => ['required', 'string', 'max:255'],
            'user_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'user_phone' => ['required', 'string', 'max:255'],
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
}
