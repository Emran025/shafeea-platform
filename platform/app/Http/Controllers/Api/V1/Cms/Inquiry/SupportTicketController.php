<?php

namespace App\Http\Controllers\Api\V1\Cms\Inquiry;

use App\Http\Controllers\Controller;
use App\Models\Cms\SupportTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Manages support panel tickets.
 * Guarded by require.permission:manage_support_tickets
 *
 * GET    /api/admin/inquiry/support-tickets                - list with filters
 * GET    /api/admin/inquiry/support-tickets/{ticket}       - single ticket
 * PATCH  /api/admin/inquiry/support-tickets/{ticket}       - assign / update status / escalate
 * DELETE /api/admin/inquiry/support-tickets/{ticket}       - close ticket
 */
class SupportTicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SupportTicket::query()->with('assignedTo:id,name,email');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($priority = $request->query('priority')) {
            $query->where('priority', $priority);
        }
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }
        if ($assigned = $request->query('assigned_to')) {
            $query->where('assigned_to', $assigned);
        }

        $items = $query->orderByDesc('created_at')->paginate(30);

        return response()->json($items);
    }

    public function show(SupportTicket $supportTicket): JsonResponse
    {
        return response()->json($supportTicket->load('assignedTo:id,name,email'));
    }

    public function update(Request $request, SupportTicket $supportTicket): JsonResponse
    {
        $data = $request->validate([
            'status'      => ['sometimes', Rule::in(SupportTicket::STATUSES)],
            'priority'    => ['sometimes', Rule::in(SupportTicket::PRIORITIES)],
            'assigned_to' => ['sometimes', 'nullable', 'exists:users,id'],
            'category'    => ['sometimes', 'string', 'max:64'],
        ]);

        $supportTicket->fill($data)->save();

        return response()->json(['ok' => true]);
    }

    public function destroy(SupportTicket $supportTicket): JsonResponse
    {
        $supportTicket->update(['status' => 'closed']);
        return response()->json(['ok' => true]);
    }
}
