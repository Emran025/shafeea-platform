<?php

namespace App\Http\Requests\Cms;

use App\Models\Cms\Block;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Write-time validation for Block updates.
 *
 * Rules enforced:
 *   SR-005  block type is immutable — rejected if 'type' is included in the request
 *
 * Note: BlockController::update() handles WR-005 (editing a published block
 * creates a draft version) before this request is applied to the model.
 *
 * Field names match actual DB column names so validated() spreads directly
 * into Block::fill().
 */
class UpdateBlockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // type intentionally excluded — SR-005: type is immutable after creation
            'locale_content' => 'sometimes|array',
            'locale_content.*.is_complete' => 'nullable|boolean',
            'locale_content.*.fields' => 'nullable|array',
            'media_id' => 'sometimes|nullable|uuid|exists:media,id',
            'actions' => 'sometimes|array',
            'config_is_decorative' => 'sometimes|boolean',
            'config_is_featured' => 'sometimes|boolean',
            'config_display_weight' => 'sometimes|integer|min:1|max:10',
        ];
    }

    public function withValidator($validator): void
    {
        // SR-005: block type cannot be changed after creation
        $validator->after(function ($v) {
            if ($this->has('type')) {
                $blockId = $this->route('block');
                $block = Block::find($blockId);

                if ($block && $this->get('type') !== $block->type) {
                    $v->errors()->add(
                        'type',
                        "SR-005: Block type cannot be changed after creation. Current type: '{$block->type}'."
                    );
                }
            }
        });
    }
}
