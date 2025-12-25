<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Handle payment webhook.
     * 
     * @param Request $request
     * @param PaymentService $paymentService
     * @return \Illuminate\Http\JsonResponse
     */
    public function handlePayment(Request $request, PaymentService $paymentService)
    {
        Log::info('Payment Webhook Received:', $request->all());

        $transactionId = $request->input('transaction_id');
        $status = $request->input('status');

        $payment = Payment::where('transaction_id', $transactionId)->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        if ($status === 'paid') {
            $paymentService->completePayment($payment, $request->all());
            Log::info("Payment complete for transaction: {$transactionId}");
        } else {
            $payment->update(['status' => 'failed', 'payload' => $request->all()]);
            Log::warning("Payment failed for transaction: {$transactionId}");
        }

        return response()->json(['message' => 'Webhook processed successfully']);
    }
}
