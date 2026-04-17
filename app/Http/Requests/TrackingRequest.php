<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackingRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'date' => 'required|date',
            'note' => 'nullable|string',
            'behaviorNote' => 'nullable|integer',
            'attendanceTypeId' => 'nullable|integer|exists:attendance_types,id',
            'details' => 'sometimes|array',
            'details.*.id' => 'nullable|integer|exists:tracking_details,id',
            'details.*.trackingTypeId' => 'required|integer|exists:tracking_types,id',
            'details.*.fromTrackingUnitId' => 'nullable|integer|exists:tracking_units,id',
            'details.*.toTrackingUnitId' => 'nullable|integer|exists:tracking_units,id',
            'details.*.actualAmount' => 'nullable|integer',
            'details.*.comment' => 'nullable|string',
            'details.*.score' => 'nullable|numeric',
            'details.*.mistakes' => 'nullable|array',
            'details.*.mistakes.*.ayahId_quran' => 'required|integer',
            'details.*.mistakes.*.wordIndex' => 'required|integer',
            'details.*.mistakes.*.mistakeTypeId' => 'required|integer|between:0,124',
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
            'behaviorNote' => 'behavior_note',
            'attendanceTypeId' => 'attendance_type_id',
        ];

        foreach ($map as $camel => $snake) {
            if (isset($validated[$camel])) {
                $validated[$snake] = $validated[$camel];
                unset($validated[$camel]);
            }
        }

        if (isset($validated['details'])) {
            $detailsMap = [
                'trackingTypeId' => 'tracking_type_id',
                'fromTrackingUnitId' => 'from_tracking_unit_id',
                'toTrackingUnitId' => 'to_tracking_unit_id',
                'actualAmount' => 'actual_amount',
            ];

            $mistakesMap = [
                'ayahId_quran' => 'ayah_id_quran',
                'wordIndex' => 'word_index',
                'mistakeTypeId' => 'mistake_type_id',
            ];

            foreach ($validated['details'] as $index => $detail) {
                foreach ($detailsMap as $camel => $snake) {
                    if (isset($detail[$camel])) {
                        $detail[$snake] = $detail[$camel];
                        unset($detail[$camel]);
                    }
                }

                if (isset($detail['mistakes'])) {
                    foreach ($detail['mistakes'] as $mIndex => $mistake) {
                        foreach ($mistakesMap as $camel => $snake) {
                            if (isset($mistake[$camel])) {
                                $mistake[$snake] = $mistake[$camel];
                                unset($mistake[$camel]);
                            }
                        }
                        $detail['mistakes'][$mIndex] = $mistake;
                    }
                }

                $validated['details'][$index] = $detail;
            }
        }

        return $validated;
    }
}
