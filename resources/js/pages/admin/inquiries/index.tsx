import React, { useState, useEffect, ReactNode } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { PageProps, Inquiry, Faq } from '@/types';
import { Search, Filter, HelpCircle, Eye, GripVertical, BarChart3, TrendingUp, MessageSquare, FileText, Sparkles } from 'lucide-react';

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

    const totalInquiries = inquiries.length;
    const publishedCount = inquiries.filter(i => i.display_order === 1).length;
    const activeCount = inquiries.filter(i => i.is_active).length;

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header Section */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">الدعم والمساعدة</h1>
                    <p className="text-sm text-muted-foreground">
                        إدارة الاستفسارات والأسئلة الشائعة
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">إجمالي الاستفسارات</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{totalInquiries}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">منشورة</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{publishedCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-amber-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">نشطة</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{activeCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Filters Section */}
                <Card className="border-2 border-border/50 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="البحث في الأسئلة أو الإجابات..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="pr-10 h-11"
                                />
                            </div>
                            <Select onValueChange={(value) => setType(value)} value={type}>
                                <SelectTrigger className="w-full lg:w-[200px] h-11">
                                    <Filter className="w-4 h-4 ml-2 opacity-50" />
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
                            <Button onClick={handleFilter} className="flex-1 lg:flex-none gap-2 h-11">
                                <Search className="w-4 h-4" />
                                تصفية
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Inquiries Grid */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={inquiries.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {inquiries.length > 0 ? (
                                inquiries.map((inquiry: Inquiry) => (
                                    <SortableItem key={inquiry.id} id={inquiry.id}>
                                        <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full group cursor-grab active:cursor-grabbing">
                                            <CardContent className="p-5 flex flex-col h-full">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <GripVertical className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-bold text-foreground line-clamp-2 mb-2">
                                                                {inquiry.question}
                                                            </h3>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                {inquiry.display_order === 1 && (
                                                                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                                                                        <FileText className="w-3 h-3 ml-1" />
                                                                        منشور
                                                                    </Badge>
                                                                )}
                                                                {inquiry.is_active && (
                                                                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                                        نشط
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex-1 mb-4">
                                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                                        {inquiry.answer
                                                            ? (inquiry.answer.length > 150 ? `${inquiry.answer.substring(0, 150)}...` : inquiry.answer)
                                                            : <span className="text-amber-600 dark:text-amber-400">لا توجد إجابة بعد</span>}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>{new Date(inquiry.created_at).toLocaleDateString('ar-SA', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="gap-2 hover:bg-primary/10 hover:text-primary"
                                                    >
                                                        <Link href={`/admin/inquiries/${inquiry.id}`}>
                                                            <Eye className="w-4 h-4" />
                                                            عرض التفاصيل
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </SortableItem>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-16">
                                    <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                        <HelpCircle className="w-16 h-16 opacity-20" />
                                        <p className="text-xl font-medium">لا توجد استفسارات</p>
                                        <p className="text-sm">ابدأ بإضافة استفسار جديد</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>

                {/* FAQ Statistics */}
                <Card className="border-2 border-border/50 shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">إحصائيات الأسئلة الشائعة</CardTitle>
                                <CardDescription>أكثر الأسئلة مشاهدة</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {faqStatistics && faqStatistics.length > 0 ? (
                            <div className="space-y-3">
                                {faqStatistics.map((faq: Faq, index: number) => (
                                    <div 
                                        key={faq.id} 
                                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-border/50"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-bold text-primary">#{index + 1}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-foreground line-clamp-1">
                                                    {faq.question}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-medium text-foreground min-w-[60px] text-left">
                                                {faq.view_count || 0} مشاهدة
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>لا توجد إحصائيات متاحة</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
