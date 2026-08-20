<?php

namespace App\Http\Controllers\Api\V1\Cms\Inquiry;

use App\Http\Controllers\Controller;
use App\Models\Cms\EmailInquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Manages inbound email inquiries.
 * Guarded by require.permission:manage_email_inquiries
 *
 * GET    /api/admin/inquiry/emails                  - list with filters
 * GET    /api/admin/inquiry/emails/{inquiry}        - single inquiry
 * PATCH  /api/admin/inquiry/emails/{inquiry}        - assign / update status / notes
 * DELETE /api/admin/inquiry/emails/{inquiry}        - archive (soft status change)
 */
class EmailInquiryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = EmailInquiry::query()->with('assignedTo:id,name,email');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($from = $request->query('from')) {
            $query->where('received_at', '>=', $from);
        }
        if ($to = $request->query('to')) {
            $query->where('received_at', '<=', $to);
        }
        if ($assigned = $request->query('assigned_to')) {
            $query->where('assigned_to', $assigned);
        }

        $items = $query->orderByDesc('received_at')->paginate(30);

        return response()->json($items);
    }

    public function show(EmailInquiry $emailInquiry): JsonResponse
    {
        return response()->json($emailInquiry->load('assignedTo:id,name,email'));
    }

    public function update(Request $request, EmailInquiry $emailInquiry): JsonResponse
    {
        $data = $request->validate([
            'status'      => ['sometimes', Rule::in(EmailInquiry::STATUSES)],
            'assigned_to' => ['sometimes', 'nullable', 'exists:users,id'],
            'notes'       => ['sometimes', 'nullable', 'string'],
        ]);

        if (isset($data['status']) && $data['status'] === 'resolved' && ! $emailInquiry->resolved_at) {
            $data['resolved_at'] = now();
        }

        $emailInquiry->fill($data)->save();

        return response()->json(['ok' => true]);
    }

    public function destroy(EmailInquiry $emailInquiry): JsonResponse
    {
        $emailInquiry->update(['status' => 'archived']);
        return response()->json(['ok' => true]);
    }
}
