<?php

namespace App\Http\Requests\Halaqah;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UpdateHalaqahRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'avatar' => 'sometimes|nullable|string',
            'gender' => ['sometimes', 'required', Rule::in(['Male', 'Female', 'Both'])],
            'residence' => 'sometimes|required|string|max:255',
            'max_students' => 'sometimes|required|integer|min:1',
            'is_active' => 'sometimes|boolean',
            'teacher_id' => [
                'sometimes',
                'nullable',
                function ($attribute, $value, $fail) {
                    // إذا كانت القيمة null لا نتحقق (لأنها nullable)
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
                },
            ],
            'school_id' => 'sometimes|required|exists:schools,id',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
