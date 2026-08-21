<?php

namespace App\Mail\Admins;

use App\Models\Applicant\Applicant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NewTeacherApplicationAlertMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(public readonly Applicant $applicant) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[شفيع] طلب انضمام معلم جديد: ' . $this->applicant->user->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admins.new-teacher-alert',
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
