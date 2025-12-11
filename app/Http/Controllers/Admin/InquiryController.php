<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InquiryController extends Controller
{
    public function index(Request $request)
    {
        $query = Faq::query();

        if ($request->has('type')) {
            // Assuming Faq model has a 'category' relationship and a 'type' field
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->input('type'));
            });
        }

        $inquiries = $query->latest()->paginate(20);

        $faqStatistics = Faq::orderBy('view_count', 'desc')->take(5)->get();

        return Inertia::render('admin/inquiries/index', [
            'inquiries' => $inquiries,
            'filters' => $request->only(['type']),
            'faqStatistics' => $faqStatistics,
        ]);
    }

    public function show(Faq $inquiry)
    {
        return Inertia::render('admin/inquiries/show', [
            'inquiry' => $inquiry
        ]);
    }

    public function update(Request $request, Faq $inquiry)
    {
        $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        $inquiry->update($request->all());

        return redirect()->route('admin.inquiries.index')->with('success', 'Inquiry updated successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:faqs,id',
        ]);

        foreach ($request->order as $index => $faqId) {
            Faq::where('id', $faqId)->update(['display_order' => $index]);
        }

        return response()->json(['status' => 'success']);
    }
}
