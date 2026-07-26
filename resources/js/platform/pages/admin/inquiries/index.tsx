import React, { useState, useEffect, ReactNode } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { PageProps, Inquiry, Faq, Category } from '@/types';
import { Search, Filter, HelpCircle, Eye, GripVertical, BarChart3, TrendingUp, MessageSquare, FileText, ArrowRightLeft, Check, Clock } from 'lucide-react';

interface HelpTicket {
    id: number;
    subject: string;
    body: string;
    name?: string;
    email?: string;
    phone?: string;
    organization?: string;
    message_type?: string;
    created_at: string;
    status: string;
}

interface InquiriesIndexProps extends PageProps {
    inquiries: {
        data: Inquiry[];
    } | Inquiry[];
    newTickets: HelpTicket[];
    categories: Category[];
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
    const { inquiries: initialInquiries = [], newTickets = [], categories = [], filters = {}, faqStatistics = [] } = usePage<InquiriesIndexProps>().props;

    const getInquiriesArray = (data: { data: Inquiry[] } | Inquiry[]): Inquiry[] => {
        if (!data) return [];
        return Array.isArray(data) ? data : (data.data || []);
    };

    const [activeTab, setActiveTab] = useState('new-tickets');
    const [inquiries, setInquiries] = useState<Inquiry[]>(getInquiriesArray(initialInquiries));
    const [tickets, setTickets] = useState<HelpTicket[]>(newTickets);
    const [type, setType] = useState(filters.type || 'all');
    const [search, setSearch] = useState(filters.search || '');
    
    // Conversion State
    const [selectedTicket, setSelectedTicket] = useState<HelpTicket | null>(null);
    const [isConvertOpen, setIsConvertOpen] = useState(false);
    const [convertForm, setConvertForm] = useState({
        question: '',
        answer: '',
        category_id: ''
    });

    useEffect(() => {
        setInquiries(getInquiriesArray(initialInquiries));
        setTickets(newTickets);
    }, [initialInquiries, newTickets]);

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

    const openConvertModal = (ticket: HelpTicket) => {
        setSelectedTicket(ticket);
        setConvertForm({
            question: ticket.subject,
            answer: '',
            category_id: ''
        });
        setIsConvertOpen(true);
    };

    const handleConvertSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket) return;

        router.post(`/admin/inquiries/${selectedTicket.id}/convert`, convertForm, {
            onSuccess: () => {
                setIsConvertOpen(false);
                setSelectedTicket(null);
            }
        });
    };

    const totalInquiries = inquiries.length;
    const publishedCount = inquiries.filter(i => i.display_order === 1).length;
    const newQuestionsCount = tickets.length;

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
                     <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">أسئلة جديدة</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{newQuestionsCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">إجمالي الأسئلة الشائعة</p>
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
                </div>
                
                <div className="w-full space-y-6">
                    <div className="flex p-1 bg-muted/20 rounded-lg w-full lg:w-[400px]">
                        <button
                            onClick={() => setActiveTab('new-tickets')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                                activeTab === 'new-tickets' 
                                    ? 'bg-background text-foreground shadow-sm' 
                                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                            }`}
                        >
                            <Clock className="w-4 h-4" />
                            أسئلة جديدة ({newQuestionsCount})
                        </button>
                        <button
                            onClick={() => setActiveTab('faqs')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                                activeTab === 'faqs' 
                                    ? 'bg-background text-foreground shadow-sm' 
                                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                            }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            الأسئلة الشائعة ({totalInquiries})
                        </button>
                    </div>
                    
                    {activeTab === 'new-tickets' && (
                        <div className="mt-6 space-y-6 animate-in fade-in-50 duration-300">
                             {/* New Tickets Grid */}
                            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {tickets.length > 0 ? (
                                    tickets.map((ticket) => (
                                        <Card key={ticket.id} className="border-2 border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                                            <CardContent className="p-5 flex flex-col h-full gap-4">
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="secondary">{ticket.message_type}</Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(ticket.created_at).toLocaleDateString('ar-SA')}
                                                    </span>
                                                </div>
                                                
                                                <div>
                                                    <h3 className="font-bold text-lg mb-2">{ticket.subject}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{ticket.body}</p>
                                                    {ticket.name && (
                                                        <div className="text-xs text-muted-foreground mt-2 border-t pt-2">
                                                            <p><strong>الاسم:</strong> {ticket.name}</p>
                                                            {ticket.email && <p><strong>البريد:</strong> {ticket.email}</p>}
                                                            {ticket.organization && <p><strong>الجهة:</strong> {ticket.organization}</p>}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-auto pt-4">
                                                    <Button 
                                                        className="w-full gap-2" 
                                                        onClick={() => openConvertModal(ticket)}
                                                    >
                                                        <ArrowRightLeft className="w-4 h-4" />
                                                        تحويل إلى سؤال شائع
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-16 bg-muted/20 rounded-xl border-2 border-dashed border-border/50">
                                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                            <Check className="w-16 h-16 opacity-20" />
                                            <p className="text-xl font-medium">لا توجد أسئلة جديدة</p>
                                            <p className="text-sm">جميع الاستفسارات تمت معالجتها</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'faqs' && (
                        <div className="mt-6 space-y-6 animate-in fade-in-50 duration-300">
                            {/* Filters Section for FAQs */}
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
                            
                            {/* FAQs Grid */}
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
                        </div>
                    )}
                </div>

                {/* FAQ Statistics */}
                <Card className="border-2 border-border/50 shadow-lg mt-8">
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

                {/* Convert Modal */}
                <Dialog open={isConvertOpen} onOpenChange={setIsConvertOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>تحويل إلى سؤال شائع</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleConvertSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="question">السؤال</Label>
                                <Input 
                                    id="question" 
                                    value={convertForm.question}
                                    onChange={(e) => setConvertForm({...convertForm, question: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">التصنيف</Label>
                                <Select 
                                    value={convertForm.category_id} 
                                    onValueChange={(value) => setConvertForm({...convertForm, category_id: value})}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر التصنيف" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={String(category.id)}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="answer">الإجابة النموذجية</Label>
                                <Textarea 
                                    id="answer" 
                                    value={convertForm.answer}
                                    onChange={(e) => setConvertForm({...convertForm, answer: e.target.value})}
                                    rows={5}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsConvertOpen(false)}>
                                    إلغاء
                                </Button>
                                <Button type="submit">
                                    حفظ ونشر
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
