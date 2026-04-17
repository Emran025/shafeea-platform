<?php

namespace App\Http\Controllers\Public;

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

        HelpTicket::create($ticketData);

        return redirect()->back()->with('success', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    }
}
