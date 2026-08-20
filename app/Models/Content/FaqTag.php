<?php

namespace App\Models\Content;

use Illuminate\Database\Eloquent\Relations\Pivot;

class FaqTag extends Pivot
{
    protected $table = 'faq_tag';
}
