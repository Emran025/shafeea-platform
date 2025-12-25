<?php

namespace App\Http\Controllers;

use App\Models\HelpTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('contact');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message_type' => 'required|string|in:support,sales,partnership,feedback,other',
            'message' => 'required|string|max:4000',
            'organization' => 'nullable|string|max:255',
        ]);

        $ticketData = $validated;
        $ticketData['body'] = $validated['message']; // Map message to body
        unset($ticketData['message']);
        
        if (Auth::check()) {
            $ticketData['user_id'] = Auth::id();
        }

        HelpTicket::create($ticketData);

        return redirect()->back()->with('success', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    }
}
