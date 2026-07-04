<?php

namespace App\Http\Controllers\Public;

use App\Events\ContactInquirySubmittedEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreContactRequest;
use App\Models\HelpTicket;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
