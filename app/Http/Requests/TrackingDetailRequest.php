<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackingDetailRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'tracking_type_id' => 'required|integer|exists:tracking_types,id',
            'from_tracking_unit_id' => 'nullable|integer|exists:tracking_units,id',
            'to_tracking_unit_id' => 'nullable|integer|exists:tracking_units,id',
            'actual_amount' => 'nullable|integer',
            'comment' => 'nullable|string',
            'score' => 'nullable|numeric',
            'mistakes' => 'nullable|array',
            'mistakes.*.ayahId_quran' => 'required|integer',
            'mistakes.*.wordIndex' => 'required|integer',
            'mistakes.*.mistakeTypeId' => 'required|integer|between:0,124',
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

        if (isset($validated['mistakes'])) {
            $mistakesMap = [
                'ayahId_quran' => 'ayah_id_quran',
                'wordIndex' => 'word_index',
                'mistakeTypeId' => 'mistake_type_id',
            ];

            foreach ($validated['mistakes'] as $mIndex => $mistake) {
                foreach ($mistakesMap as $camel => $snake) {
                    if (isset($mistake[$camel])) {
                        $mistake[$snake] = $mistake[$camel];
                        unset($mistake[$camel]);
                    }
                }
                $validated['mistakes'][$mIndex] = $mistake;
            }
        }

        return $validated;
    }
}
