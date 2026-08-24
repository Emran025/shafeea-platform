<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AssignTeacherRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'teacher_id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $exists = DB::table('teachers')
                        ->where('user_id', $value)
                        ->orWhere('username', $value)
                        ->exists();

                    if (! $exists) {
                        $fail('The selected teacher is invalid.');
                    }
                }
            ],
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
