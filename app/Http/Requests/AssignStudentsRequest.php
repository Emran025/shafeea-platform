<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AssignStudentsRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'studentUserIds' => 'required|array',
            'studentUserIds.*' => [
                'required',
                function ($attribute, $value, $fail) {
                    $exists = DB::table('students')
                        ->where('user_id', $value)
                        ->orWhere('username', $value)
                        ->exists();

                    if (! $exists) {
                        $fail('The selected student is invalid.');
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