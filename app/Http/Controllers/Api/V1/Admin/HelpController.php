<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use App\Models\Category;
use App\Models\PrivacyPolicy;
use App\Models\Tag;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\StoreFaqRequest;
use App\Http\Requests\Admin\StorePolicyRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Http\Requests\Admin\UpdateFaqRequest;
use App\Models\TermsOfUse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HelpController extends ApiController
{
    //region FAQ Category Management
    public function createCategory(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());
        return $this->success(new CategoryResource($category), 'FAQ category created successfully.', 201);
    }

    public function updateCategory(UpdateCategoryRequest $request, $id)
    {
        $category = Category::findOrFail($id);
        $category->update($request->validated());
        return $this->success(new CategoryResource($category), 'FAQ category updated successfully.');
    }

    public function deleteCategory($id)
    {
        Category::findOrFail($id)->delete();
        return $this->success(null, 'FAQ category deleted successfully.');
    }
    //endregion

    //region FAQ Management
    public function createFaq(StoreFaqRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $faq = Faq::create($data);
        return $this->success(new FaqResource($faq), 'FAQ created successfully.', 201);
    }

    public function updateFaq(UpdateFaqRequest $request, $id)
    {
        $faq = Faq::findOrFail($id);
        $faq->update($request->validated());
        return $this->success(new FaqResource($faq), 'FAQ updated successfully.');
    }

    public function deleteFaq($id)
    {
        Faq::findOrFail($id)->delete();
        return $this->success(null, 'FAQ deleted successfully.');
    }

    public function attachTagsToFaq(Request $request, $id)
    {
        $request->validate(['tags' => 'required|array']);
        $faq = Faq::findOrFail($id);
        $faq->tags()->syncWithoutDetaching($request->tags);
        return $this->success(null, 'Tags attached successfully.');
    }

    public function detachTagFromFaq($id, $tagId)
    {
        $faq = Faq::findOrFail($id);
        $faq->tags()->detach($tagId);
        return $this->success(null, 'Tag detached successfully.');
    }
    //endregion

    //region Policy Management
    public function createOrUpdatePrivacyPolicy(StorePolicyRequest $request)
    {
        $policy = PrivacyPolicy::updateOrCreate(
            ['version' => $request->version],
            $request->validated()
        );
        return $this->success($policy, 'Privacy policy saved successfully.');
    }

    public function createOrUpdateTermsOfUse(StorePolicyRequest $request)
    {
        $terms = TermsOfUse::updateOrCreate(
            ['version' => $request->version],
            $request->validated()
        );
        return $this->success($terms, 'Terms of use saved successfully.');
    }
    //endregion
}
