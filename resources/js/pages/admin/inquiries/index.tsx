import React, { useState, useEffect, ReactNode } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { PageProps, Inquiry, Faq } from '@/types';

interface InquiriesIndexProps extends PageProps {
    inquiries: {
        data: Inquiry[];
    } | Inquiry[];
    filters: {
        type?: string;
        search?: string;
    };
    faqStatistics: Faq[];
}

interface SortableItemProps {
    id: number | string;
    children: ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
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
    const { inquiries: initialInquiries = [], filters = {}, faqStatistics = [] } = usePage<InquiriesIndexProps>().props;

    const getInquiriesArray = (data: { data: Inquiry[] } | Inquiry[]): Inquiry[] => {
        if (!data) return [];
        return Array.isArray(data) ? data : (data.data || []);
    };

    const [inquiries, setInquiries] = useState<Inquiry[]>(getInquiriesArray(initialInquiries));
    const [type, setType] = useState(filters.type || 'all');
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        setInquiries(getInquiriesArray(initialInquiries));
    }, [initialInquiries]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleFilter = () => {
        router.get('/admin/inquiries', { type, search }, { preserveState: true, replace: true });
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleFilter();
        }
    };

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
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
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">الدعم والمساعدة</h1>
                    <p className="text-sm text-muted-foreground">إدارة الاستفسارات والأسئلة الشائعة</p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <Input
                            type="text"
                            placeholder="البحث في الأسئلة أو الإجابات..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                        />
                        <Select onValueChange={(value) => setType(value)} value={type}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="جميع الأنواع" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">جميع الأنواع</SelectItem>
                                <SelectItem value="general">عام</SelectItem>
                                <SelectItem value="technical">تقني</SelectItem>
                                <SelectItem value="suggestion">اقتراح</SelectItem>
                                <SelectItem value="report">بلاغ</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleFilter} className="w-full sm:w-auto">
                            تصفية
                        </Button>
                    </div>
                </div>
                
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={inquiries.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {inquiries.length > 0 ? (
                                inquiries.map((inquiry: Inquiry) => (
                                    <SortableItem key={inquiry.id} id={inquiry.id}>
                                        <div className="bg-card border border-border shadow-sm rounded-lg h-full hover:shadow-md transition-shadow">
                                            <div className="p-4 flex flex-col h-full justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-lg font-semibold text-foreground">{inquiry.question}</h3>
                                                        {inquiry.display_order === 1 && (
                                                            <span className="mr-2 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                                                                منشور
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                        {inquiry.answer
                                                            ? (inquiry.answer.length > 100 ? `${inquiry.answer.substring(0, 100)}...` : inquiry.answer)
                                                            : 'لا توجد إجابة'}
                                                    </p>
                                                </div>
                                                <div className="mt-4 flex justify-between items-center pt-4 border-t border-border">
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(inquiry.created_at).toLocaleDateString('ar-SA')}
                                                    </span>
                                                    <Link href={`/admin/inquiries/${inquiry.id}`} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                                        عرض التفاصيل
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </SortableItem>
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-12 text-muted-foreground">
                                    <p className="text-lg">لا توجد استفسارات.</p>
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>

                <div className="mt-12">
                    <h2 className="text-xl font-bold text-foreground mb-4">إحصائيات الأسئلة الشائعة</h2>
                    <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
                        <ul className="divide-y divide-border">
                            {faqStatistics && faqStatistics.length > 0 ? faqStatistics.map((faq: Faq) => (
                                <li key={faq.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                    <p className="text-sm font-medium text-foreground">{faq.question}</p>
                                    <p className="text-sm text-muted-foreground">{faq.view_count} مشاهدة</p>
                                </li>
                            )) : (
                                <li className="px-6 py-4 text-sm text-muted-foreground text-center">لا توجد إحصائيات متاحة.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}