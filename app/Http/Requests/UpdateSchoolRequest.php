<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSchoolRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'logo' => 'nullable|url',
            'country' => 'sometimes|required|string',
            'city' => 'sometimes|required|string',
            'location' => 'sometimes|required|string',
        ];
    }
}
