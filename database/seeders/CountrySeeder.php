<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = file_get_contents(database_path('data/countries.json'));
        $countries = json_decode($json, true);

        foreach ($countries as $country) {
            \App\Models\Content\Country::updateOrCreate(
                ['iso2' => $country['alpha2']],
                [
                    'name_en'    => $country['Country_EN'],
                    'name_ar'    => $country['Country_AR'],
                    'phone_code' => $country['Phone_Code'],
                    'iso3'       => $country['alpha3'],
                    'flag_url'   => $country['flag_url'] ?? null,
                    'flag_svg'   => $country['flag_svg_content'] ?? null,
                ]
            );
        }
    }
}
