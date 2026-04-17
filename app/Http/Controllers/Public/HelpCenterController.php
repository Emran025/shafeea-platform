<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HelpCenterController extends Controller
{
    public function index()
    {
        return Inertia::render('help/index');
    }
}
