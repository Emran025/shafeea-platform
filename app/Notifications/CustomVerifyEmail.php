<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * Custom email verification notification for the Shafeea platform.
 *
 * Extends Laravel's built-in VerifyEmail to:
 *  - Use the branded Blade master layout (emails.layout.master)
 *  - Send from the dedicated verify@ alias (MAIL_VERIFY_ADDRESS)
 *  - Display Arabic copy consistent with the platform's voice
 */
class CustomVerifyEmail extends VerifyEmail
{
    /**
     * Build the mail representation of the notification.
     */
    public function toMail(mixed $notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->from(
                config('mail.verify_email', config('mail.from.address')),
                config('app.name', 'منصة شفيع')
            )
            ->subject('تأكيد بريدك الإلكتروني — منصة شفيع')
            ->view('emails.auth.verify-email', [
                'verificationUrl' => $verificationUrl,
                'userName'        => $notifiable->name,
            ]);
    }
}
