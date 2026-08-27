<?php

namespace App\Mail\Contacts;

use App\Models\Content\HelpTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NewContactInquiryAlertMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(public readonly HelpTicket $ticket) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[شفيع] استفسار جديد: '.$this->ticket->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contacts.new-inquiry-alert',
            with: ['ticket' => $this->ticket],
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
