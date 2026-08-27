<?php

namespace App\Http\Controllers\Public;

use App\Events\ContactInquirySubmittedEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreContactRequest;
use App\Models\Content\HelpTicket;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('contact');
    }

    public function store(StoreContactRequest $request)
    {
        $validated = $request->validated();

        $ticketData = $validated;
        $ticketData['body'] = $validated['message']; // Map message to body
        unset($ticketData['message']);

        if (Auth::check()) {
            $ticketData['user_id'] = Auth::id();
        }

        $ticket = HelpTicket::create($ticketData);

        ContactInquirySubmittedEvent::dispatch($ticket);

        return redirect()->back()->with('success', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    }
}
