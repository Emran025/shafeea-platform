<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalize email to lowercase before validation/authentication, so
     * login never fails purely due to letter casing.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('email')) {
            $this->merge([
                'email' => mb_strtolower(trim((string) $this->input('email'))),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * device_info fields are only required for API (mobile) clients.
     * Web browser logins do not send device_info, so they are nullable there.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isApiRequest = $this->expectsJson() || $this->is('api/*');

        return [
            'email' => 'required|email',
            'password' => 'required',

            // device_info is mandatory for mobile/API clients, optional for web logins
            'device_info' => $isApiRequest ? 'required|array' : 'nullable|array',
            'device_info.device_id' => $isApiRequest ? 'required|string|max:255' : 'nullable|string|max:255',
            'device_info.model' => $isApiRequest ? 'required|string|max:100' : 'nullable|string|max:100',
            'device_info.manufacturer' => $isApiRequest ? 'required|string|max:100' : 'nullable|string|max:100',
            'device_info.os_version' => $isApiRequest ? 'required|string|max:50' : 'nullable|string|max:50',
            'device_info.app_version' => 'nullable|string|max:20',
            'device_info.timezone' => 'nullable|string|max:50',
            'device_info.locale' => 'nullable|string|max:10',
            'device_info.fcm_token' => 'nullable|string|max:255',
        ];
    }
}
