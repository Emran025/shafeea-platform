import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function EditPolicy() {
    const { policy } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        content: policy.content || '',
        is_active: policy.is_active || false,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/policies/privacy/${policy.id}`);
    }

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="p-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Privacy Policy</h1>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                            <div>
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows={20}
                                    className="mt-1 block w-full"
                                />
                                {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <Label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                    Set as Active Version
                                </Label>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
