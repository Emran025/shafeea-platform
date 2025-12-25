<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\School;
use App\Models\Subscription;
use Illuminate\Support\Str;

class PaymentService
{
    /**
     * Initiate an online payment.
     * 
     * @param School $school
     * @param float $amount
     * @param int|null $subscriptionId
     * @return array
     */
    public function initiateOnlinePayment(School $school, float $amount, ?int $subscriptionId = null): array
    {
        $transactionId = 'TXN_' . Str::random(12);
        
        $payment = Payment::create([
            'school_id' => $school->id,
            'subscription_id' => $subscriptionId,
            'transaction_id' => $transactionId,
            'payment_method' => 'online',
            'amount' => $amount,
            'status' => 'pending',
        ]);

        // Simulating a payment gateway response
        return [
            'success' => true,
            'payment_id' => $payment->id,
            'transaction_id' => $transactionId,
            'checkout_url' => route('register.index'), // In real app, this would be a URL from the gateway
            'message' => 'تم بدء عملية الدفع الرقمي بنجاح.'
        ];
    }

    /**
     * Generate a reference number for bank transfer/offline payment.
     * 
     * @param School $school
     * @param float $amount
     * @param int|null $subscriptionId
     * @return array
     */
    public function generateReferenceNumber(School $school, float $amount, ?int $subscriptionId = null): array
    {
        $referenceNumber = 'REF-' . strtoupper(Str::random(8));

        $payment = Payment::create([
            'school_id' => $school->id,
            'subscription_id' => $subscriptionId,
            'payment_method' => 'reference_number',
            'reference_number' => $referenceNumber,
            'amount' => $amount,
            'status' => 'pending',
        ]);

        return [
            'success' => true,
            'payment_id' => $payment->id,
            'reference_number' => $referenceNumber,
            'message' => 'تم إصدار رقم مرجعي للتحويل البنكي.'
        ];
    }

    /**
     * Mark a payment as paid and activate/update subscription.
     * 
     * @param Payment $payment
     * @param array $payload
     * @return bool
     */
    public function completePayment(Payment $payment, array $payload = []): bool
    {
        if ($payment->status === 'paid') {
            return true;
        }

        $payment->update([
            'status' => 'paid',
            'payload' => $payload,
        ]);

        $school = $payment->school;
        $plan = $school->currentPlan;

        if ($plan) {
            // Create or update subscription
            $subscription = Subscription::create([
                'school_id' => $school->id,
                'plan_id' => $plan->id,
                'starts_at' => now(),
                'ends_at' => $plan->billing_period === 'yearly' ? now()->addYear() : now()->addMonth(),
                'price_paid' => $payment->amount,
                'status' => 'active',
            ]);

            $payment->update(['subscription_id' => $subscription->id]);

            $school->update([
                'subscription_status' => 'active',
                'subscription_ends_at' => $subscription->ends_at,
            ]);

            // Send Welcome Email
            try {
                \Illuminate\Support\Facades\Mail::to($school->users()->first()->email)
                    ->send(new \App\Mail\WelcomeSchoolMail($school));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Failed to send welcome email: " . $e->getMessage());
            }
        }

        return true;
    }
}
