<?php

namespace App\Mail\Contacts;

use App\Models\Content\HelpTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ContactInquiryResponseMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public readonly HelpTicket $ticket,
        public readonly string $responseMessage
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.contact_email', config('mail.from.address')),
                config('app.name')
            ),
            subject: 'ردًّا على استفسارك: '.$this->ticket->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contacts.inquiry-response',
            with: [
                'ticket' => $this->ticket,
                'responseMessage' => $this->responseMessage,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }

    public function failed(\Throwable $e): void
    {
        Log::error('Email dispatch failed', [
            'mail' => static::class,
            'error' => $e->getMessage(),
        ]);
    }
}
