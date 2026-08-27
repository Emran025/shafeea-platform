<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Content\Service;
use App\Models\Subscription\SubscriptionPlan;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display the services page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $services = Service::active()
            ->ordered()
            ->get();

        return Inertia::render('services', [
            'services' => $services,
            'subscriptionPlans' => SubscriptionPlan::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }
}
