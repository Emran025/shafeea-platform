import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    BookOpen,
    Users,
    Target,
    Heart,
    Globe,
    Award,
    Shield,
    Lightbulb,
    CheckCircle,
    Star,
    Calendar,
    Sparkles,
    TrendingUp,
    Zap,
    Coffee
} from 'lucide-react';
import SiteLayout from '@/layouts/site-layout';

export default function About() {
  

// تحديث المصفوفة للتأكد من أن الكلاسات كاملة وواضحة
    const teamMembers = [
        {
            name: "د. محمد الأحمد",
            role: "الرئيس التنفيذي", // اختصرت المسمى قليلاً لتقليل الطول
            description: "دكتوراه في التربية الإسلامية، خبرة 15 سنة في التعليم القرآني.",
            image: "MA",
            gradient: "from-blue-600 to-cyan-600", // التدرج اللوني
            shadow: "shadow-blue-500/20", // ظل ملون خفيف,
            expertise: ["التعليم القرآني", "إدارة المؤسسات", "التقنية التعليمية"]

        },
        {
            name: "م. فاطمة الزهراء",
            role: "مديرة التطوير التقني",
            description: "مهندسة برمجيات، متخصصة في تطوير المنصات التعليمية.",
            image: "FZ",
            gradient: "from-purple-600 to-pink-600",
            shadow: "shadow-purple-500/20",
            expertise: ["تطوير البرمجيات", "الذكاء الاصطناعي", "أمن المعلومات"]

        },
        {
            name: "أ. عبدالله السالم",
            role: "مدير المحتوى القرآني",
            description: "خريج الأزهر الشريف، إجازة في القراءات العشر.",
            image: "AS",
            gradient: "from-emerald-600 to-teal-600",
            shadow: "shadow-emerald-500/20",
            expertise: ["علوم القرآن", "التجويد", "القراءات"]

        },
        {
            name: "د. عائشة المبارك",
            role: "مديرة الجودة",
            description: "دكتوراه في المناهج، خبرة في تطوير البرامج التعليمية.",
            image: "AM",
            gradient: "from-amber-600 to-orange-600",
            shadow: "shadow-amber-500/20",
            expertise: ["المناهج التعليمية", "تطوير البرامج", "ضمان الجودة"]
        }
    ];

// ... (داخل الـ return)

    const milestones = [
        {
            year: "2020",
            title: "بداية الحلم",
            description: "تأسيس الشركة وبداية تطوير النسخة الأولى من المنصة",
            icon: Lightbulb
        },
        {
            year: "2021", 
            title: "الإطلاق الرسمي",
            description: "إطلاق المنصة رسمياً وضم أول 100 مؤسسة تعليمية",
            icon: Target
        },
        {
            year: "2022",
            title: "التوسع الإقليمي",
            description: "توسيع الخدمات لتشمل 10 دول عربية مع إضافة ميزات متقدمة",
            icon: Globe
        },
        {
            year: "2023",
            title: "الذكاء الاصطناعي",
            description: "دمج تقنيات الذكاء الاصطناعي لتحسين تجربة التعلم",
            icon: Sparkles
        },
        {
            year: "2024",
            title: "القيادة والريادة",
            description: "أصبحنا المنصة الرائدة في التعليم القرآني بأكثر من 50 ألف مستخدم",
            icon: Award
        }
    ];

    const values = [
        {
            icon: Heart,
            title: "الإخلاص في العمل",
            description: "نؤمن بأن العمل عبادة ونسعى لتقديم أفضل الخدمات بصدق وإخلاص"
        },
        {
            icon: BookOpen,
            title: "التميز في التعليم",
            description: "نلتزم بأعلى معايير الجودة في التعليم القرآني والتطوير التقني"
        },
        {
            icon: Users,
            title: "خدمة المجتمع",
            description: "نهدف لخدمة المجتمع المسلم وتيسير تعلم القرآن الكريم للجميع"
        },
        {
            icon: Lightbulb,
            title: "الابتكار المستمر",
            description: "نواكب أحدث التقنيات لتطوير حلول مبتكرة في التعليم القرآني"
        },
        {
            icon: Shield,
            title: "الأمانة والثقة",
            description: "نحافظ على أمانة المعلومات ونبني علاقات مبنية على الثقة والشفافية"
        },
        {
            icon: Globe,
            title: "الشمولية والعالمية",
            description: "نسعى لوصول خدماتنا لجميع المسلمين حول العالم"
        }
    ];

    return (
        <SiteLayout>
            <Head title="من نحن - شفيع" />

            {/* Hero Section - The Original Structure with "Gradient Hero" */}
            <section className="relative py-28 gradient-hero overflow-hidden animate-fade-in-up">
                <div className="absolute inset-0 pointer-events-none">
                    {/* The Dark Mode Overlay Logic */}
                    <div className="absolute inset-0 bg-transparent dark:bg-black/40 transition-colors duration-300"></div>
                    
                    {/* Noise Texture */}
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    </div>

                    {/* Shapes */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-20">
                        <div className="absolute top-16 left-16 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-24 right-24 w-48 h-48 bg-white/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-8 shadow-xl hover-scale-sm transition-all duration-300">
                            <Heart className="w-10 h-10 text-white" />
                        </div>
                        
                        <div className="flex justify-center mb-6">
                            <Badge className="bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-md px-4 py-1.5 text-sm shadow-sm transition-all duration-300">
                                <Sparkles className="w-4 h-4 ml-2 text-yellow-300" />
                                قصتنا ورؤيتنا للمستقبل
                            </Badge>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
                            من نحن؟
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-blue-50/90 max-w-4xl mx-auto leading-relaxed mb-10 font-light">
                            نحن فريق من المتخصصين في التعليم القرآني والتقنية الحديثة، نسعى لتطوير أفضل الحلول التقنية لخدمة التعليم القرآني وتيسير حفظ كتاب الله الكريم
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 shadow-lg hover:bg-white/15 transition-colors">
                                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                                <span className="text-white font-medium text-sm">أكثر من 50,000 مستخدم</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 shadow-lg hover:bg-white/15 transition-colors">
                                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse delay-300 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
                                <span className="text-white font-medium text-sm">في 15 دولة عربية</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Mission & Vision - Improved Cards for Light Mode */}
            <section className="py-24 bg-white dark:bg-gray-950 animate-fade-in-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 text-primary font-bold mb-4 bg-primary/10 px-4 py-2 rounded-full w-fit">
                                <Target className="w-5 h-5" />
                                <span>رؤيتنا ورسالتنا</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                نحو مستقبل مشرق <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">للتعليم القرآني</span>
                            </h2>
                            
                            <div className="space-y-8">
                                <div className="bg-card border border-border p-6 rounded-2xl hover:border-primary/30 transition-colors shadow-sm">
                                    <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-3">
                                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                            <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        رؤيتنا
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        أن نكون المنصة الرائدة عالمياً في تقديم الحلول التقنية المتطورة للتعليم القرآني، ونساهم في إعداد جيل قرآني متميز يحمل رسالة الإسلام للعالم.
                                    </p>
                                </div>

                                <div className="bg-card border border-border p-6 rounded-2xl hover:border-primary/30 transition-colors shadow-sm">
                                    <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-3">
                                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                            <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        رسالتنا
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        تطوير وتقديم منصة تقنية متكاملة وسهلة الاستخدام لإدارة الحلقات القرآنية، تجمع بين الأصالة الإسلامية والتقنية الحديثة، لتيسير تعلم وحفظ القرآن الكريم.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-[2rem] blur-2xl transform rotate-3 scale-95 opacity-70"></div>
                            <div className="relative bg-card border border-border rounded-[2rem] p-8 shadow-2xl">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800">
                                            <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-foreground">فريق متخصص</h4>
                                            <p className="text-muted-foreground">خبراء في التعليم والتقنية</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-border"></div>

                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                                            <Award className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-foreground">جودة عالية</h4>
                                            <p className="text-muted-foreground">معايير دولية في التطوير</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-border"></div>

                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center border border-purple-100 dark:border-purple-800">
                                            <Globe className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-foreground">انتشار واسع</h4>
                                            <p className="text-muted-foreground">خدمة المسلمين حول العالم</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values - Vibrant Cards (Not Boring) */}
            {/* Our Values - Clean & Sharp in Light Mode */}
            <section className="py-24 bg-muted/30 dark:bg-gray-800/50 animate-fade-in-up border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-secondary text-primary hover:bg-secondary/80 border border-border">
                            <CheckCircle className="w-4 h-4 ml-1" />
                            قيمنا ومبادئنا
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            القيم التي نؤمن بها
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            مبادئ راسخة تحكم عملنا وتوجه قراراتنا في كل ما نقدمه من خدمات ومنتجات
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 group bg-card border-border hover:border-primary/30 hover:-translate-y-1">
                                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm border border-primary/10">
                                    <value.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                    {value.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {value.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>


            {/* Our Story Timeline - Creative & Fixed Visibility */}
            <section className="py-24 bg-white dark:bg-gray-950 animate-fade-in-up overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <Badge className="mb-4 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            <Calendar className="w-4 h-4 ml-1" />
                            مسيرتنا عبر السنوات
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            قصة نجاح مستمرة
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            رحلة من الحلم إلى الواقع، من فكرة بسيطة إلى منصة رائدة
                        </p>
                    </div>

                    <div className="relative">
                        {/* Creative Line: Gradient & Dashed in Light Mode */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
                        
                        <div className="space-y-16">
                            {milestones.map((milestone, index) => (
                                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} relative group`}>
                                    {/* Card Side */}
                                    <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                                        <Card className="p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border bg-card group-hover:border-primary/40">
                                            {/* Decorative Background Icon */}
                                            <milestone.icon className="absolute -left-4 -bottom-4 w-24 h-24 text-foreground/5 transform rotate-12 transition-transform group-hover:rotate-0" />
                                            
                                            <div className="relative z-10">
                                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold mb-3 border border-primary/20">
                                                    {milestone.year}
                                                </span>
                                                <h3 className="text-xl font-bold text-foreground mb-2">
                                                    {milestone.title}
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    {milestone.description}
                                                </p>
                                            </div>
                                        </Card>
                                    </div>
                                    
                                    {/* Center Node */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                                        <div className="w-10 h-10 bg-background border-4 border-primary rounded-full flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform">
                                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Empty Side */}
                                    <div className="w-full lg:w-5/12"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Team Section - Refined Cards (Fixed Structure) */}
            {/* Team Section - "The Luxurious One" */}
            <section className="py-24 bg-gray-50 dark:bg-black relative border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                <Users className="w-4 h-4 ml-1" />
                                فريق العمل
                            </Badge>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">خبراء يقودون التميز</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
                                خلف كل إنجاز عظيم فريق عظيم. تعرف على العقول المدبرة وراء شفيع.
                            </p>
                        </div>
                        <div className="flex -space-x-4 rtl:space-x-reverse">
                            {teamMembers.map((_, i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">
                                    {_.image}
                                </div>
                            ))}
                            <div className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-900 bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                +10
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-card border-border hover:-translate-y-1 flex flex-col">
                                <div className="relative">
                                    <div className={`h-20 bg-gradient-to-r ${member.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}>
                                        <div className="absolute inset-0 bg-white/10 opacity-30 mix-blend-overlay"></div>
                                    </div>
                                    
                                    {/* Image Avatar */}
                                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                                        <div className={`w-20 h-20 rounded-full border-[4px] border-white dark:border-gray-900 bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 ${member.shadow}`}>
                                            <span className={`text-2xl font-bold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                                                {member.image}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section - تقليل المسافات لتقليل الطول */}
                                <div className="pt-12 p-5 text-center flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                        {member.name}
                                    </h3>
                                    
                                    <div className="mb-3">
                                        <span className="text-xs font-medium text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/10">
                                            {member.role}
                                        </span>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-4 leading-snug line-clamp-2">
                                        {member.description}
                                    </p>

                                    <div className="flex flex-wrap gap-1 justify-center mb-5">
                                        {member.expertise.map((skill, skillIndex) => (
                                            <span key={skillIndex} className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground rounded-md border border-border">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Button */}
                                    <button className="mt-auto w-full py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm font-medium flex items-center justify-center gap-2 group-hover:border-transparent group-hover:bg-primary group-hover:text-white group-hover:hover:bg-primary/90 group-hover:hover:text-white shadow-sm">
                                        <Coffee className="w-3.5 h-3.5" />
                                        تواصل معي
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}