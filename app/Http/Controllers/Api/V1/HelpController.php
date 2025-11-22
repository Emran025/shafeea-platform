<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\ContentTypeResource;
use App\Http\Resources\FaqCategoryResource;
use App\Http\Resources\FaqResource;
use App\Http\Resources\PolicyResource;
use App\Http\Resources\TagResource;
use App\Models\ContentType;
use App\Models\Faq;
use App\Models\FaqCategory;
use App\Models\PrivacyPolicy;
use App\Models\Tag;
use App\Models\TermsOfUse;
use App\Models\UserConsent;
use Illuminate\Http\Request;

class HelpController extends ApiController
{
    //region FAQ Methods
    public function getFaqCategories()
    {
        $categories = FaqCategory::where('is_active', true)->orderBy('display_order')->get();
        return $this->success(FaqCategoryResource::collection($categories), 'FAQ categories retrieved successfully.');
    }

    public function getFaqsByCategory($id)
    {
        $category = FaqCategory::findOrFail($id);
        $faqs = $category->faqs()->where('is_active', true)->orderBy('display_order')->paginate(15);
        return $this->success(FaqResource::collection($faqs), 'FAQs retrieved successfully.');
    }

    public function listFaqs(Request $request)
    {
        $query = Faq::where('is_active', true);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $faqs = $query->orderBy('display_order')->paginate(15);
        return $this->success(FaqResource::collection($faqs), 'FAQs retrieved successfully.');
    }

    public function searchFaqs($query)
    {
        $faqs = Faq::where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('question', 'LIKE', "%{$query}%")
                  ->orWhere('answer', 'LIKE', "%{$query}%");
            })
            ->paginate(15);

        return $this->success(FaqResource::collection($faqs), 'Search results retrieved successfully.');
    }

    public function getFaqById($id)
    {
        $faq = Faq::where('is_active', true)->findOrFail($id);
        $faq->increment('view_count');
        $faq->load('category', 'tags');
        return $this->success(new FaqResource($faq), 'FAQ retrieved successfully.');
    }
    //endregion

    //region Policy & Terms Methods
    public function getLatestPrivacyPolicy()
    {
        $latestPolicy = PrivacyPolicy::where('is_active', true)->latest('last_updated')->firstOrFail();
        return $this->success(new PolicyResource($latestPolicy), 'Latest privacy policy retrieved successfully.');
    }

    public function listPrivacyPolicyVersions()
    {
        $versions = PrivacyPolicy::orderBy('last_updated', 'desc')->get(['version', 'last_updated']);
        return $this->success($versions, 'Privacy policy versions retrieved successfully.');
    }

    public function getPrivacyPolicyByVersion($version)
    {
        $policy = PrivacyPolicy::findOrFail($version);
        return $this->success(new PolicyResource($policy), 'Privacy policy retrieved successfully.');
    }

    public function getLatestTermsOfUse()
    {
        $latestTerms = TermsOfUse::where('is_active', true)->latest('last_updated')->firstOrFail();
        return $this->success(new PolicyResource($latestTerms), 'Latest terms of use retrieved successfully.');
    }

    public function listTermsOfUseVersions()
    {
        $versions = TermsOfUse::orderBy('last_updated', 'desc')->get(['version', 'last_updated']);
        return $this->success($versions, 'Terms of use versions retrieved successfully.');
    }

    public function getTermsOfUseByVersion($version)
    {
        $terms = TermsOfUse::findOrFail($version);
        return $this->success(new PolicyResource($terms), 'Terms of use retrieved successfully.');
    }
    //endregion

    //region Content & Tag Methods
    public function listContentTypes()
    {
        $types = ContentType::where('is_active', true)->get();
        return $this->success(ContentTypeResource::collection($types), 'Content types retrieved successfully.');
    }

    public function listTags()
    {
        $tags = Tag::orderBy('usage_count', 'desc')->get();
        return $this->success(TagResource::collection($tags), 'Tags retrieved successfully.');
    }

    public function getPopularTags()
    {
        $tags = Tag::orderBy('usage_count', 'desc')->take(10)->get();
        return $this->success(TagResource::collection($tags), 'Popular tags retrieved successfully.');
    }
    //endregion

    //region User Consent Methods
    public function recordPrivacyConsent(Request $request)
    {
        return $this->recordConsent($request, 'privacy_policy');
    }

    public function recordTermsConsent(Request $request)
    {
        return $this->recordConsent($request, 'terms_of_use');
    }

    protected function recordConsent(Request $request, $policyType)
    {
        $request->validate(['version' => 'required|string|max:50']);

        UserConsent::create([
            'user_id' => $request->user()->id,
            'policy_type' => $policyType,
            'policy_version' => $request->version,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return $this->success(null, 'Consent recorded successfully.');
    }
    //endregion
}
