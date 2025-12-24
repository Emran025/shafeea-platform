<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Service::query()->latest();

        // Search functionality
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%")
                    ->orWhere('category', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by category
        if ($request->has('category') && $request->input('category') !== '' && $request->input('category') !== null) {
            $query->where('category', $request->input('category'));
        }

        // Filter by active status
        if ($request->has('is_active') && $request->input('is_active') !== '' && $request->input('is_active') !== null) {
            $query->where('is_active', $request->input('is_active') === '1' || $request->input('is_active') === true);
        }

        $services = $query->paginate(15);

        return Inertia::render('admin/services/index', [
            'services' => $services,
            'filters' => $request->only(['search', 'category', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/services/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequest $request)
    {
        $data = $request->validated();

        // Handle uploaded image file (preferred over image URL)
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('services', 'public');
            $data['image'] = Storage::url($path);
        }

        // Ensure boolean values are properly cast
        $data['popular'] = $request->has('popular') ? (bool) $request->input('popular') : false;
        $data['is_active'] = $request->has('is_active') ? (bool) $request->input('is_active') : true;
        $data['display_order'] = $request->input('display_order', 0);

        Service::create($data);

        return Redirect::route('admin.services.index')
            ->with('success', 'تم إنشاء الخدمة بنجاح.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        return Inertia::render('admin/services/show', [
            'service' => $service,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        return Inertia::render('admin/services/edit', [
            'service' => $service,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceRequest $request, Service $service)
    {
        $data = $request->validated();

        // Handle uploaded image file (replace existing if present)
        if ($request->hasFile('image_file')) {
            // Delete old file if it was stored via Storage::url
            if ($service->image && str_starts_with($service->image, '/storage/')) {
                $oldPath = ltrim(str_replace('/storage/', '', parse_url($service->image, PHP_URL_PATH)), '/');
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image_file')->store('services', 'public');
            $data['image'] = Storage::url($path);
        }

        // Ensure boolean values are properly cast
        if ($request->has('popular')) {
            $data['popular'] = (bool) $request->input('popular');
        }
        if ($request->has('is_active')) {
            $data['is_active'] = (bool) $request->input('is_active');
        }

        $service->update($data);

        return Redirect::route('admin.services.index')
            ->with('success', 'تم تحديث الخدمة بنجاح.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $service->delete();

        return Redirect::route('admin.services.index')
            ->with('success', 'تم حذف الخدمة بنجاح.');
    }
}
