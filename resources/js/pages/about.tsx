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
    Sparkles
} from 'lucide-react';
import SiteLayout from '@/layouts/site-layout';

export default function About() {
    const teamMembers = [
        {
            name: "د. محمد الأحمد",
            role: "الرئيس التنفيذي ومؤسس الشركة",
            description: "دكتوراه في التربية الإسلامية، خبرة 15 سنة في التعليم القرآني والتقنية التعليمية",
            image: "MA",
            expertise: ["التعليم القرآني", "إدارة المؤسسات", "التقنية التعليمية"]
        },
        {
            name: "م. فاطمة الزهراء",
            role: "مديرة التطوير التقني",
            description: "مهندسة برمجيات، متخصصة في تطوير المنصات التعليمية والذكاء الاصطناعي",
            image: "FZ",
            expertise: ["تطوير البرمجيات", "الذكاء الاصطناعي", "أمن المعلومات"]
        },
        {
            name: "أ. عبدالله السالم",
            role: "مدير المحتوى القرآني",
            description: "خريج الأزهر الشريف، إجازة في القراءات العشر، خبرة 20 سنة في تعليم القرآن",
            image: "AS",
            expertise: ["علوم القرآن", "التجويد", "القراءات"]
        },
        {
            name: "د. عائشة المبارك",
            role: "مديرة الجودة التعليمية",
            description: "دكتوراه في المناهج وطرق التدريس، خبرة في تطوير البرامج التعليمية القرآنية",
            image: "AM",
            expertise: ["المناهج التعليمية", "تطوير البرامج", "ضمان الجودة"]
        }
    ];

    const milestones = [
        {
            year: "2020",
            title: "بداية الحلم",
            description: "تأسيس الشركة وبداية تطوير النسخة الأولى من المنصة"
        },
        {
            year: "2021", 
            title: "الإطلاق الرسمي",
            description: "إطلاق المنصة رسمياً وضم أول 100 مؤسسة تعليمية"
        },
        {
            year: "2022",
            title: "التوسع الإقليمي",
            description: "توسيع الخدمات لتشمل 10 دول عربية مع إضافة ميزات متقدمة"
        },
        {
            year: "2023",
            title: "الذكاء الاصطناعي",
            description: "دمج تقنيات الذكاء الاصطناعي لتحسين تجربة التعلم"
        },
        {
            year: "2024",
            title: "القيادة والريادة",
            description: "أصبحنا المنصة الرائدة في التعليم القرآني بأكثر من 50 ألف مستخدم"
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
        <SiteLayout title="من نحن">
            <Head title="من نحن - شفيع" />

            {/* Hero Section */}
            <section className="relative py-28 bg-gradient-primary overflow-hidden animate-fade-in-up">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-0 left-0 w-full h-full opacity-20">
                        <div className="absolute top-16 left-16 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-24 right-24 w-48 h-48 bg-white/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl mb-8 hover-scale-sm transition-all duration-300">
                            <Heart className="w-12 h-12 text-white" />
                        </div>
                        <Badge className="mb-8 bg-white/20 text-white border-white/30 hover:bg-white/30 glass-card hover-lift transition-all duration-300 text-sm px-6 py-3">
                            <Sparkles className="w-4 h-4 ml-1" />
                            قصتنا ورؤيتنا للمستقبل
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                            من نحن؟
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-5xl mx-auto leading-relaxed mb-12">
                            نحن فريق من المتخصصين في التعليم القرآني والتقنية الحديثة، نسعى لتطوير أفضل الحلول التقنية لخدمة التعليم القرآني وتيسير حفظ كتاب الله الكريم
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-white font-medium">نخدم أكثر من 50،000 مستخدم</span>
                            </div>
                            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4">
                                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                                <span className="text-white font-medium">في 15 دولة عربية</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-white dark:bg-gray-900 animate-fade-in-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Badge className="mb-6 gradient-primary text-white hover:from-blue-200 hover:to-blue-300 dark:bg-gradient-to-r dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300 transition-all duration-300">
                                <Target className="w-4 h-4 ml-1" />
                                رؤيتنا ورسالتنا
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                نحو مستقبل مشرق للتعليم القرآني
                            </h2>
                            
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                        رؤيتنا
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        أن نكون المنصة الرائدة عالمياً في تقديم الحلول التقنية المتطورة للتعليم القرآني، ونساهم في إعداد جيل قرآني متميز يحمل رسالة الإسلام للعالم.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-red-500" />
                                        رسالتنا
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        تطوير وتقديم منصة تقنية متكاملة وسهلة الاستخدام لإدارة الحلقات القرآنية، تجمع بين الأصالة الإسلامية والتقنية الحديثة، لتيسير تعلم وحفظ القرآن الكريم.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-2xl p-8 glass-card hover-lift transition-all duration-300">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">فريق متخصص</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">خبراء في التعليم والتقنية</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                                            <Award className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">جودة عالية</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">معايير دولية في التطوير</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                            <Globe className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">انتشار واسع</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">خدمة المسلمين حول العالم</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-emerald-400/30 rounded-full blur-xl animate-pulse"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-24 bg-gray-50 dark:bg-gray-800 animate-fade-in-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 hover:from-emerald-200 hover:to-emerald-300 dark:bg-gradient-to-r dark:from-emerald-900/20 dark:to-emerald-800/20 dark:text-emerald-300 transition-all duration-300">
                            <CheckCircle className="w-4 h-4 ml-1" />
                            قيمنا ومبادئنا
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            القيم التي نؤمن بها
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            مبادئ راسخة تحكم عملنا وتوجه قراراتنا في كل ما نقدمه من خدمات ومنتجات
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 group hover-lift glass-card-subtle animate-fade-in-up border-l-4 border-l-primary">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <value.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {value.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Timeline */}
            <section className="py-24 bg-white dark:bg-gray-900 animate-fade-in-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 gradient-primary hover:from-purple-200 hover:to-purple-300 dark:bg-gradient-to-r dark:from-purple-900/20 dark:to-purple-800/20 dark:text-purple-300 transition-all duration-300">
                            <Calendar className="w-4 h-4 ml-1" />
                            مسيرتنا عبر السنوات
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            قصة نجاح مستمرة
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            رحلة من الحلم إلى الواقع، من فكرة بسيطة إلى منصة رائدة في التعليم القرآني
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-primary rounded-full"></div>
                        
                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                    <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                                        <Card className="p-6 hover:shadow-lg transition-all duration-300 hover-lift glass-card-subtle animate-fade-in-up">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Badge className="bg-gradient-primary text-white shadow-lg">
                                                    {milestone.year}
                                                </Badge>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {milestone.description}
                                            </p>
                                        </Card>
                                    </div>
                                    
                                    <div className="w-2 lg:w-2/12 flex justify-center">
                                        <div className="w-4 h-4 bg-gradient-primary rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>
                                    </div>
                                    
                                    <div className="w-full lg:w-5/12"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-gray-50 dark:bg-gray-800 animate-fade-in-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300 dark:bg-gradient-to-r dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300 transition-all duration-300">
                            <Users className="w-4 h-4 ml-1" />
                            فريق العمل
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            خبراء يقودون التميز
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            فريق متنوع من الخبراء المتخصصين في التعليم القرآني والتقنية والإدارة
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group hover-lift glass-card-subtle animate-fade-in-up">
                                <div className="p-6 text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        {member.image}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm text-primary font-medium mb-3">
                                        {member.role}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                        {member.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {member.expertise.map((skill, skillIndex) => (
                                            <Badge key={skillIndex} variant="outline" className="text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}