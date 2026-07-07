<?php

namespace App\Mail\Students;

use App\Mail\CategorizedMailable;
use App\Models\Applicant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class StudentApprovedMail extends CategorizedMailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected string $emailCategory = 'noreply';

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(public readonly Applicant $applicant) {}

    public function envelope(): Envelope
    {
        $base = parent::envelope();
        return new Envelope(
            from: $base->from,
            subject: 'مرحباً ' . ($this->applicant->user->name ?? '') . ' — تم قبولك في ' . ($this->applicant->school->name ?? 'المؤسسة'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.students.approved',
            with: ['applicant' => $this->applicant],
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
