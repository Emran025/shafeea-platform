<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Traits\FormatsPagination;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiController extends Controller
{
    use FormatsPagination;

    /**
     * Return a successful JSON response.
     *
     * @param  mixed  $data
     * @param  string|null  $message
     * @param  int  $code
     * @return JsonResponse
     */
    protected function success($data = null, string $message = null, int $code = 200): JsonResponse
    {
        $response = [
            'success' => true,
        ];

        if ($message) {
            $response['message'] = $message;
        }

        if ($data instanceof AnonymousResourceCollection && $data->resource instanceof LengthAwarePaginator) {
            $paginator = $data->resource;
            $response['data'] = $data->collection;
            $response['pagination'] = $this->formatPagination($paginator);
        } elseif ($data instanceof LengthAwarePaginator) {
            $response['data'] = $data->items();
            $response['pagination'] = $this->formatPagination($data);
        } elseif (!is_null($data)) {
            $response['data'] = $data;
        }

        return response()->json($response, $code);
    }

    /**
     * Return an error JSON response.
     *
     * @param  string|null  $message
     * @param  int  $code
     * @param  mixed|null  $errors
     * @return JsonResponse
     */
    protected function error(string $message = null, int $code = 400, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message ?? 'An error occurred',
        ];

        if (!is_null($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

}
