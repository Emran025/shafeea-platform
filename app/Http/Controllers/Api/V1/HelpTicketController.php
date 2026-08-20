<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Content\StoreHelpTicketRequest;
use App\Models\Content\HelpTicket;

class HelpTicketController extends ApiController
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHelpTicketRequest $request)
    {
        HelpTicket::create([
            'user_id' => $request->user()->id,
            'subject' => $request->validated()['subject'],
            'body' => $request->validated()['body'],
        ]);

        return $this->success(null, 'Help ticket created successfully.', 201);
    }
}
