<?php

namespace App\Http\Requests\Halaqah;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreHalaqahRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|string',
            'gender' => ['required', Rule::in(['Male', 'Female', 'Both'])],
            'residence' => 'required|string|max:255',
            'max_students' => 'required|integer|min:1',
            'is_active' => 'sometimes|boolean',
            'teacher_id' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if (is_null($value)) {
                        return;
                    }
                    $exists = DB::table('teachers')
                        ->where('user_id', $value)
                        ->orWhere('username', $value)
                        ->exists();
                    if (! $exists) {
                        $fail('The selected teacher is invalid.');
                    }
                }
            ],
            'school_id' => 'required|exists:schools,id',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'The given data was invalid.',
                'errors'  => $validator->errors(),
            ], 422)
        );
    }
}