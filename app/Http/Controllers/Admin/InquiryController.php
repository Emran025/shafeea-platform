<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class InquiryController extends Controller
{
    public function index(Request $request)
    {
        $query = Faq::query();

        if ($request->has('type') && $request->input('type') != 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->input('type'));
            });
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('question', 'like', '%' . $request->input('search') . '%')
                    ->orWhere('answer', 'like', '%' . $request->input('search') . '%');
            });
        }

        $inquiries = $query->with('category')->latest()->paginate(20);

        $faqStatistics = Faq::orderBy('view_count', 'desc')->take(5)->get();

        return Inertia::render('admin/inquiries/index', [
            'inquiries' => $inquiries,
            'filters' => $request->only(['type', 'search']),
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
        $wasAnswered = !empty($inquiry->answer);

        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required_if:display_order,1|nullable|string',
            'is_active' => 'required|boolean',
            'display_order' => 'required|integer|in:0,1',
        ]);

        $inquiry->update($validated);

        $isNewlyAnswered = !$wasAnswered && !empty($validated['answer']);

        if ($isNewlyAnswered) {
            $user = $inquiry->createdBy;
            if ($user) {
                // As requested, the following line is commented out to prevent actual email sending.
                // \Mail::to($user->email)->send(new \App\Mail\InquiryResponse($inquiry));
            }
        }

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
