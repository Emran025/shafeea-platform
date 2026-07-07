<?php

namespace App\Mail\Schools;

use App\Mail\CategorizedMailable;
use App\Models\School;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SchoolApprovedMail extends CategorizedMailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected string $emailCategory = 'noreply';

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(public readonly School $school) {}

    public function envelope(): Envelope
    {
        $base = parent::envelope();
        return new Envelope(
            from: $base->from,
            subject: 'مبروك! تم قبول ' . $this->school->name . ' في منصة شفيع',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.schools.approved',
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
            'mail'  => static::class,
            'error' => $e->getMessage(),
        ]);
    }
}
