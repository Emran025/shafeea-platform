<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\LandingPageSetting;
use App\Models\PrivacyPolicy;
use App\Models\TermsOfUse;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Home / welcome page.
     */
    public function welcome(): Response
    {
        $settings = LandingPageSetting::where('group', 'welcome_page')
            ->get()
            ->pluck('value', 'key');

        return Inertia::render('welcome', [
            'settings' => $settings,
        ]);
    }

    /**
     * About us page.
     */
    public function about(): Response
    {
        return Inertia::render('about');
    }

    /**
     * Privacy policy page.
     */
    public function privacy(): Response
    {
        $privacyPolicy = PrivacyPolicy::where('is_active', true)
            ->latest('last_updated')
            ->first();

        return Inertia::render('privacy', [
            'privacyPolicy' => $privacyPolicy,
        ]);
    }

    /**
     * Terms of use page.
     */
    public function terms(): Response
    {
        $terms = TermsOfUse::where('is_active', true)
            ->latest('last_updated')
            ->first();

        return Inertia::render('terms', [
            'terms' => $terms,
        ]);
    }

    /**
     * FAQ page.
     */
    public function faq(): Response
    {
        $faqs = Faq::with('category', 'tags')
            ->where('is_active', true)
            ->where('display_order', 1)
            ->orderBy('display_order', 'asc')
            ->get();

        return Inertia::render('faq', [
            'faqs' => $faqs,
        ]);
    }
}
