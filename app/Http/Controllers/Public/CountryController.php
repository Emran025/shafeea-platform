<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Content\Country;
use Illuminate\Support\Facades\Cache;

class CountryController extends Controller
{
    public function index()
    {
        $countries = Cache::rememberForever('countries_list', function () {
            return Country::all();
        });

        return response()->json($countries);
    }
}
