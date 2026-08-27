<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Envelope;

/**
 * Abstract base mailable that automatically sets the "From" address
 * based on a declared email category.
 *
 * Usage: extend this class and set the $emailCategory property:
 *
 *   protected string $emailCategory = 'noreply'; // verify | noreply | contact | info
 */
abstract class CategorizedMailable extends Mailable
{
    /**
     * The email alias category. Determines which configured address is used
     * as the "From" header for the outgoing message.
     *
     * Supported values:
     *   'verify'  → MAIL_VERIFY_ADDRESS  (account security & onboarding)
     *   'noreply' → MAIL_NOREPLY_ADDRESS (automated system notifications)
     *   'contact' → MAIL_CONTACT_ADDRESS (human-led support & inquiries)
     *   'info'    → MAIL_INFO_ADDRESS    (general inquiries)
     */
    protected string $emailCategory = 'noreply';

    /**
     * Resolve the "From" address for the given category.
     */
    protected function resolveFromAddress(): Address
    {
        $appName = config('app.name', 'منصة شفيع');

        $map = [
            'verify' => config('mail.verify_email', config('mail.from.address')),
            'noreply' => config('mail.noreply_email', config('mail.from.address')),
            'contact' => config('mail.contact_email', config('mail.from.address')),
            'info' => config('mail.info_email', config('mail.from.address')),
        ];

        $address = $map[$this->emailCategory] ?? config('mail.from.address');

        return new Address($address, $appName);
    }

    /**
     * Override the envelope to inject the correct "From" address automatically.
     * Child classes should call parent::envelope() and then add their own subject.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: $this->resolveFromAddress(),
        );
    }
}
