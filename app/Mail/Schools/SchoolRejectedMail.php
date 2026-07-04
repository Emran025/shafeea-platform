<?php

namespace App\Mail\Schools;

use App\Models\School;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SchoolRejectedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        public readonly School $school,
        public readonly ?string $rejectionReason = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'بخصوص طلب انضمام ' . $this->school->name . ' إلى منصة شفيع',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.schools.rejected',
            with: [
                'school'          => $this->school,
                'rejectionReason' => $this->rejectionReason,
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
            'mail'  => static::class,
            'error' => $e->getMessage(),
        ]);
    }
}
