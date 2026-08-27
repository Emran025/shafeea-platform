<?php

namespace App\Mail\Admins;

use App\Models\School\School;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NewSchoolApplicationAlertMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public function __construct(public readonly School $school) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[شفيع] طلب انضمام مؤسسة جديدة: '.$this->school->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admins.new-school-alert',
            with: ['school' => $this->school],
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
