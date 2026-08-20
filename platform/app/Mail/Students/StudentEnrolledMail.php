<?php

namespace App\Mail\Students;

use App\Mail\CategorizedMailable;
use App\Models\Student\Enrollment;
use App\Models\Halaqah\Halaqah;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class StudentEnrolledMail extends CategorizedMailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected string $emailCategory = 'noreply';

    public int $tries = 3;
    public int $backoff = 60;

    public Halaqah $halaqah;

    public function __construct(public readonly Enrollment $enrollment)
    {
        $this->halaqah = $enrollment->halaqah()->with(['school', 'teachers.user', 'schedules'])->firstOrFail();
    }

    public function envelope(): Envelope
    {
        $base = parent::envelope();
        return new Envelope(
            from: $base->from,
            subject: 'تم تسجيلك في حلقة "' . $this->halaqah->name . '"',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.students.enrolled',
            with: [
                'enrollment' => $this->enrollment,
                'halaqah'    => $this->halaqah,
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
