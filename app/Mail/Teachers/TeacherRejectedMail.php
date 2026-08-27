<?php

namespace App\Mail\Teachers;

use App\Models\Applicant\Applicant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class TeacherRejectedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(
        public readonly Applicant $applicant,
        public readonly ?string $rejectionReason = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'تحديث بخصوص طلبك في '.($this->applicant->school->name ?? 'المؤسسة'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.teachers.rejected',
            with: [
                'applicant' => $this->applicant,
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
            'mail' => static::class,
            'error' => $e->getMessage(),
        ]);
    }
}
