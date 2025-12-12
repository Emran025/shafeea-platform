import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';

function SortableItem({ id, children }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}

export default function InquiriesIndex() {
    const { inquiries: initialInquiries, filters, faqStatistics } = usePage().props;
    const [inquiries, setInquiries] = useState(initialInquiries.data);
    const [type, setType] = useState(filters.type || '');

    useEffect(() => {
        setInquiries(initialInquiries.data);
    }, [initialInquiries]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleFilter = () => {
        router.get('/admin/inquiries', { type }, { preserveState: true });
    };

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setInquiries((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);

                axios.post('/admin/inquiries/reorder', {
                    order: newOrder.map((item) => item.id),
                });

                return newOrder;
            });
        }
    }

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Inquiries</h1>
                <div className="mt-4 flex items-center">
                    <Select onValueChange={(value) => setType(value)} value={type}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Types</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="suggestion">Suggestion</SelectItem>
                            <SelectItem value="report">Report</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleFilter} className="ml-4">
                        Filter
                    </Button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={inquiries.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        <div className="mt-8 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {inquiries.map((inquiry) => (
                                <SortableItem key={inquiry.id} id={inquiry.id}>
                                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                                        <div className="p-4">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{inquiry.question}</h3>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                {inquiry.answer.substring(0, 100)}...
                                            </p>
                                            <div className="mt-4 flex justify-between items-center">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(inquiry.created_at).toLocaleDateString()}
                                                </span>
                                                <Link href={`/admin/inquiries/${inquiry.id}`} className="text-sm font-medium text-primary hover:text-primary/80">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </SortableItem>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Frequently Asked Questions Statistics</h2>
                    <div className="mt-4 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {faqStatistics.map((faq) => (
                                <li key={faq.id} className="px-6 py-4 flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{faq.question}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{faq.view_count} views</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
