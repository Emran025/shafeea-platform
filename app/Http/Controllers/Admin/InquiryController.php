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
        // Fetch FAQs (Existing Inquiries)
        $query = Faq::query();

        if ($request->has('type') && $request->input('type') != 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->input('type'));
            });
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('question', 'like', '%'.$request->input('search').'%')
                    ->orWhere('answer', 'like', '%'.$request->input('search').'%');
            });
        }

        $inquiries = $query->with('category')->orderBy('display_order', 'asc')->latest()->paginate(20);

        // Fetch New Tickets (HelpTickets)
        $ticketsQuery = \App\Models\HelpTicket::where('status', 'pending');
         if ($request->has('search')) {
            $ticketsQuery->where(function ($q) use ($request) {
                $q->where('subject', 'like', '%'.$request->input('search').'%')
                  ->orWhere('body', 'like', '%'.$request->input('search').'%')
                  ->orWhere('name', 'like', '%'.$request->input('search').'%')
                  ->orWhere('email', 'like', '%'.$request->input('search').'%');
            });
        }
        $newTickets = $ticketsQuery->latest()->get();

        $faqStatistics = Faq::orderBy('view_count', 'desc')->take(5)->get();
        $categories = \App\Models\Category::all(); // Assuming Category model exists and is used for FAQs

        return Inertia::render('admin/inquiries/index', [
            'inquiries' => $inquiries,
            'newTickets' => $newTickets,
            'categories' => $categories, // Pass categories for dropdown implementation
            'filters' => $request->only(['type', 'search']),
            'faqStatistics' => $faqStatistics,
        ]);
    }

    public function show(\App\Models\Faq $inquiry)
    {
        return Inertia::render('admin/inquiries/show', [
            'inquiry' => $inquiry,
        ]);
    }

    public function convertToFaq(Request $request, \App\Models\HelpTicket $ticket)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        Faq::create([
            'question' => $validated['question'],
            'answer' => $validated['answer'],
            'category_id' => $validated['category_id'],
            'is_active' => true,
            'display_order' => 0, // Default to 0, admin can reorder later
        ]);

        $ticket->update(['status' => 'converted_to_faq']);

        return redirect()->back()->with('success', 'Ticket converted to FAQ successfully.');
    }

    public function update(Request $request, Faq $inquiry)
    {
        $wasAnswered = ! empty($inquiry->answer);

        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required_if:display_order,1|nullable|string',
            'is_active' => 'required|boolean',
            'display_order' => 'required|integer', // Removed specific values restriction to allow reordering logic
        ]);

        $inquiry->update($validated);

        $isNewlyAnswered = ! $wasAnswered && ! empty($validated['answer']);


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
