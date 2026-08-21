<?php

namespace App\Mail\Students;

use App\Mail\CategorizedMailable;
use App\Models\Applicant\Applicant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class StudentRejectedMail extends CategorizedMailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected string $emailCategory = 'noreply';

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        public readonly Applicant $applicant,
        public readonly ?string $rejectionReason = null,
    ) {}

    public function envelope(): Envelope
    {
        $base = parent::envelope();
        return new Envelope(
            from: $base->from,
            subject: 'تحديث بخصوص طلب الانضمام في ' . ($this->applicant->school->name ?? 'المؤسسة'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.students.rejected',
            with: [
                'applicant'       => $this->applicant,
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
