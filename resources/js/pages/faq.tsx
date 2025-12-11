import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    HelpCircle,
    MessageCircle,
    BookOpen,
    Users,
    Settings,
    CreditCard,
    ChevronDown,
    Star,
    CheckCircle,
    Mail,
    Phone,
    Globe,
    Filter,
    TrendingUp,
    Briefcase,
    DollarSign
} from 'lucide-react';
import { useState, useMemo } from 'react';
import SiteLayout from '@/layouts/site-layout';
import { Faq } from '@/types';

interface FaqProps {
    faqs: Faq[];
}

// Helper to create a slug from category name
const slugify = (text: string) => {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
};

const getCategoryIcon = (slug: string) => {
    switch (slug) {
        case 'أسئلة-عامة': return Globe;
        case 'إدارة-الحساب': return Settings;
        case 'الميزات': return BookOpen;
        case 'الأسعار-والخطط': return CreditCard;
        case 'الدعم-الفني': return Briefcase;
        default: return HelpCircle;
    }
};

const getCategoryColor = (slug: string) => {
    switch (slug) {
        case 'أسئلة-عامة': return 'text-blue-500';
        case 'إدارة-الحساب': return 'text-purple-500';
        case 'الميزات': return 'text-emerald-500';
        case 'الأسعار-والخطط': return 'text-rose-500';
        case 'الدعم-الفني': return 'text-orange-500';
        default: return 'text-primary';
    }
};

export default function FAQ({ faqs }: FaqProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedItems, setExpandedItems] = useState<number[]>([]);

    const { faqData, categories, popularFAQ } = useMemo(() => {
        const sortedFaqs = [...faqs].sort((a, b) => b.view_count - a.view_count);
        const popularIds = sortedFaqs.slice(0, 4).map(f => f.id);

        const data = faqs.map(faq => ({
            id: faq.id,
            category: slugify(faq.category.name),
            question: faq.question,
            answer: faq.answer,
            popular: popularIds.includes(faq.id)
        }));

        const uniqueCategories = [
            { id: 'all', name: 'جميع الأسئلة', icon: HelpCircle, color: 'text-primary' },
            ...Array.from(new Set(faqs.map(f => f.category.name))).map(name => {
                const slug = slugify(name);
                return {
                    id: slug,
                    name: name,
                    icon: getCategoryIcon(slug),
                    color: getCategoryColor(slug),
                };
            })
        ];

        const popular = data.filter(item => item.popular);

        return { faqData: data, categories: uniqueCategories, popularFAQ: popular };
    }, [faqs]);

    const filteredFAQ = faqData.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleExpanded = (id: number) => {
        setExpandedItems(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    return (
        <SiteLayout>
            <Head title="الأسئلة الشائعة - شفيع" />

            {/* Hero Section */}
            <section className="relative py-24 gradient-hero overflow-hidden animate-fade-in-up">
                
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-transparent dark:bg-black/60 transition-colors duration-300"></div>
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl mb-8 hover-scale-sm transition-all duration-300 shadow-xl">
                            <HelpCircle className="w-10 h-10 text-white" />
                        </div>
                        <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md transition-all duration-300 text-sm px-4 py-2 shadow-sm glass-card hover-lift">
                            <Star className="w-4 h-4 ml-1 text-yellow-300" />
                            مركز المساعدة والدعم
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight drop-shadow-sm">
                            الأسئلة الشائعة
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-50/90 leading-relaxed mb-10 max-w-4xl mx-auto font-light">
                            نجيب على أكثر الأسئلة شيوعاً حول منصة شفيع لمساعدتك في الحصول على أفضل تجربة تعليمية
                        </p>
                        <div className="max-w-lg mx-auto">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg transition-all duration-300 group-hover:bg-white/15">
                                    <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                    <Input
                                        type="text"
                                        placeholder="ابحث في الأسئلة والإجابات..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-4 pr-12 py-5 bg-transparent border-0 text-white placeholder:text-white text-lg focus:ring-0 focus-visible:ring-0 rounded-xl h-14"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Questions */}
            <section className="py-20 bg-background animate-fade-in-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-6 bg-secondary text-primary hover:bg-secondary/80 border border-border transition-all duration-300 text-sm px-4 py-2">
                            <TrendingUp className="w-4 h-4 ml-1" />
                            الأكثر طلباً وبحثاً
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            الأسئلة الأكثر شيوعاً
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            إجابات سريعة وواضحة لأهم الاستفسارات حول منصتنا
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {popularFAQ.map((item, index) => (
                            <Card key={item.id} className="group p-8 hover:shadow-xl transition-all duration-300 hover-lift bg-card border border-border relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                        <span className="font-bold text-sm">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                                            {item.question}
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed text-base pl-14">
                                    {item.answer}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-20 bg-muted/30 dark:bg-gray-800/50 animate-fade-in-up border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-4 lg:gap-12">
                        {/* Categories */}
                        <div className="lg:col-span-1 mb-12 lg:mb-0">
                            <div className="sticky top-24">
                                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-primary" />
                                        تصنيف الأسئلة
                                    </h3>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <Button
                                                key={category.id}
                                                variant={activeCategory === category.id ? "default" : "ghost"}
                                                onClick={() => setActiveCategory(category.id)}
                                                className={`w-full justify-start text-right transition-all duration-300 rounded-xl py-6 ${
                                                    activeCategory === category.id 
                                                        ? "bg-primary text-primary-foreground shadow-md" 
                                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                                }`}
                                            >
                                                <category.icon className={`w-5 h-5 ml-3 ${activeCategory === category.id ? 'text-white' : category.color}`} />
                                                <span className="font-medium">{category.name}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Items */}
                        <div className="lg:col-span-3">
                            <div className="space-y-4">
                                {filteredFAQ.length > 0 ? (
                                    filteredFAQ.map((item) => (
                                        <Card key={item.id} className="group overflow-hidden transition-all duration-300 border border-border bg-card hover:border-primary/50">
                                            <CardHeader
                                                className="cursor-pointer hover:bg-muted/30 transition-colors p-6 select-none"
                                                onClick={() => toggleExpanded(item.id)}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${expandedItems.includes(item.id) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                            <HelpCircle className="w-4 h-4" />
                                                        </div>
                                                        <CardTitle className={`text-lg font-bold transition-colors ${expandedItems.includes(item.id) ? 'text-primary' : 'text-foreground'}`}>
                                                            {item.question}
                                                        </CardTitle>
                                                    </div>
                                                    <div className={`flex-shrink-0 transition-transform duration-300 ${expandedItems.includes(item.id) ? 'rotate-180' : ''}`}>
                                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            
                                            {expandedItems.includes(item.id) && (
                                                <CardContent className="pt-0 pb-6 px-6">
                                                    <div className="pl-12 pr-2">
                                                        <p className="text-muted-foreground leading-relaxed text-base border-r-2 border-primary/20 pr-4">
                                                            {item.answer}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                            <span className="text-xs text-muted-foreground">هل كانت هذه الإجابة مفيدة؟</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">لا توجد نتائج</h3>
                                        <p className="text-muted-foreground">جرب البحث بكلمات مختلفة</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Support */}
            <section className="py-16 bg-background animate-fade-in-up">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-muted/30 border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                            لم تجد ما تبحث عنه؟
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                            فريق الدعم جاهز لمساعدتك. تواصل معنا وسنجيب خلال ساعات قليلة.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-lg shadow-lg shadow-primary/20">
                                <Link href="/contact">
                                    <Mail className="w-5 h-5 ml-2" />
                                    إرسال رسالة
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-white h-12 px-8 text-lg">
                                <Link href="/contact">
                                    <Phone className="w-5 h-5 ml-2" />
                                    اتصل بنا
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
