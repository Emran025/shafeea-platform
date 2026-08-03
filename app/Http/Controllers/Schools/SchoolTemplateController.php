<?php

namespace App\Http\Controllers\Schools;

use App\Http\Controllers\Controller;
use App\Models\School\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class SchoolTemplateController extends Controller
{
    /**
     * Show the main frontend page for a specific school by school_code.
     * URL: shafeea.system360.cloud/school/[school_code]
     */
    public function index(Request $request, string $school_code)
    {
        $school = $this->resolveSchool($school_code);
        $seoData = $this->getSchoolSeoData($school, $school_code);

        return view('schools.template.welcome', [
            'school' => $school,
            'school_code' => $school_code,
            'seo' => $seoData,
        ]);
    }

    /**
     * Render subpages or app interface for a school template.
     * URL: shafeea.system360.cloud/school/[school_code]/[page]
     */
    public function show(Request $request, string $school_code, string $page = 'home')
    {
        $school = $this->resolveSchool($school_code);
        $seoData = $this->getSchoolSeoData($school, $school_code, $page);

        return view('schools.template.app', [
            'school' => $school,
            'school_code' => $school_code,
            'page' => $page,
            'seo' => $seoData,
        ]);
    }

    /**
     * API endpoint returning school metadata and template configuration.
     */
    public function info(Request $request, string $school_code)
    {
        $school = $this->resolveSchool($school_code);

        return response()->json([
            'status' => 'success',
            'school_code' => $school->school_code,
            'name' => $school->name,
            'logo' => $school->getPublicLogoUrl(),
            'phone' => $school->phone,
            'city' => $school->city,
            'country' => $school->country,
            'is_active' => $school->is_active,
        ]);
    }

    /**
     * Dynamic robots.txt per school for search engines.
     * URL: shafeea.system360.cloud/school/[school_code]/robots.txt
     */
    public function robots(Request $request, string $school_code)
    {
        $sitemapUrl = url("/school/{$school_code}/sitemap.xml");

        $content = "User-agent: *\n";
        $content .= "Allow: /school/{$school_code}/\n";
        $content .= "Disallow: /school/{$school_code}/api/admin/\n";
        $content .= "Sitemap: {$sitemapUrl}\n";

        return Response::make($content, 200, ['Content-Type' => 'text/plain']);
    }

    /**
     * Dynamic XML Sitemap per school for search engine indexing.
     * URL: shafeea.system360.cloud/school/[school_code]/sitemap.xml
     */
    public function sitemap(Request $request, string $school_code)
    {
        $school = $this->resolveSchool($school_code);
        $baseUrl = url("/school/{$school_code}");
        $now = date('Y-m-d');

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        $pages = ['', '/page/about', '/page/services', '/page/contact', '/page/faq'];

        foreach ($pages as $p) {
            $loc = htmlspecialchars($baseUrl . $p);
            $xml .= "<url><loc>{$loc}</loc><lastmod>{$now}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>";
        }

        $xml .= '</urlset>';

        return Response::make($xml, 200, ['Content-Type' => 'application/xml']);
    }

    /**
     * Resolve school record or build fallback object.
     */
    private function resolveSchool(string $school_code): School
    {
        $school = School::where('school_code', $school_code)->first();

        if (!$school) {
            $schoolName = 'مدرسة ' . ucfirst(str_replace(['-', '_'], ' ', $school_code));
            $school = new School([
                'name' => $schoolName,
                'school_code' => $school_code,
                'logo' => School::DEFAULT_LOGO,
                'phone' => '+966 50 000 0000',
                'country' => 'السعودية',
                'city' => 'الرياض',
                'address' => 'المقر الرئيسي',
                'is_active' => true,
            ]);
        }

        return $school;
    }

    /**
     * Build SEO metadata and JSON-LD structured data for search engine identification.
     */
    private function getSchoolSeoData(School $school, string $school_code, string $page = 'home'): array
    {
        $canonicalUrl = url("/school/{$school_code}" . ($page !== 'home' ? "/page/{$page}" : ''));
        $title = "{$school->name} - البوابة الإلكترونية المعتمدة";
        $description = "البوابة الإلكترونية الرسمية لـ {$school->name} في {$school->city}، {$school->country}. نظام متكامل لمتابعة الحلقات والطلاب والدروس وتفاصيل التواصل.";
        $logoUrl = asset($school->logo);

        $jsonLd = [
            '@context' => 'https://schema.org',
            '@type' => 'EducationalOrganization',
            'name' => $school->name,
            'url' => $canonicalUrl,
            'logo' => $logoUrl,
            'telephone' => $school->phone ?? '',
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => $school->city ?? 'Riyadh',
                'addressCountry' => $school->country ?? 'Saudi Arabia',
                'streetAddress' => $school->address ?? '',
            ],
        ];

        return [
            'title' => $title,
            'description' => $description,
            'canonical_url' => $canonicalUrl,
            'og_image' => $logoUrl,
            'json_ld' => json_encode($jsonLd, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
        ];
    }
}
