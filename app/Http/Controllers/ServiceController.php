<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
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
        ]);
    }
}
