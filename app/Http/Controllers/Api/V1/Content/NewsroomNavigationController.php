<?php

namespace App\Http\Controllers\Api\V1\Content;

use App\Http\Controllers\Controller;
use App\Models\Cms\NewsroomLink;
use Illuminate\Http\JsonResponse;

class NewsroomNavigationController extends Controller
{
    public function index(): JsonResponse
    {
        $links = NewsroomLink::query()
            ->where('is_active', true)
            ->orderBy('position')
            ->get(['label', 'href'])
            ->map(fn(NewsroomLink $link) => [
                'label' => $link->label,
                'href' => $link->href,
            ]);

        return response()->json($links);
    }
}
