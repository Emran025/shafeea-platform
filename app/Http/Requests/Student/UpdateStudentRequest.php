<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'avatar' => 'nullable|string',
            'gender' => 'sometimes|required|in:Male,Female',
            'birthDate' => 'sometimes|required|date',
            'phoneZone' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'whatsappZone' => 'nullable|string',
            'whatsappPhone' => 'nullable|string',
            'country' => 'sometimes|required|string',
            'residence' => 'sometimes|required|string',
            'city' => 'sometimes|required|string',
            'qualification' => 'sometimes|required|string',
            'memorizationLevel' => 'sometimes|required|integer|between:0,30',
            'status' => 'sometimes|string',
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
            'memorizationLevel' => 'memorization_level',
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
