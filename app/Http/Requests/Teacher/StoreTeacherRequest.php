<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'avatar' => 'nullable|string',
            'gender' => 'required|in:Male,Female',
            'birthDate' => 'required|date',
            'phoneZone' => 'required|string',
            'phone' => 'required|string',
            'whatsappZone' => 'nullable|string',
            'whatsappPhone' => 'nullable|string',
            'country' => 'required|string',
            'residence' => 'required|string',
            'city' => 'required|string',
            'bio' => 'nullable|string',
            'experienceYears' => 'nullable|integer|min:0',
        ];
    }

    /**
     * Get the validated data from the request and map to snake_case.
     *
     * @param  string|null  $key
     * @param  mixed  $default
     * @return array
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated();

        $map = [
            'birthDate' => 'birth_date',
            'phoneZone' => 'phone_zone',
            'whatsappZone' => 'whatsapp_zone',
            'whatsappPhone' => 'whatsapp',
            'experienceYears' => 'experience_years',
        ];

        foreach ($map as $camel => $snake) {
            if (isset($validated[$camel])) {
                $validated[$snake] = $validated[$camel];
                unset($validated[$camel]);
            }
        }

        return $validated;
    }
}
