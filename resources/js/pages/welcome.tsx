import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BookOpen,
    Users,
    BarChart3,
    CheckCircle,
    Star,
    Shield,
    Globe,
    Smartphone,
    Clock,
    Award,
    TrendingUp,
    MessageCircle,
    Calendar
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import SiteLayout from '@/layouts/site-layout';

const Icons = {
    BookOpen,
    Users,
    BarChart3,
    CheckCircle,
    Star,
    Shield,
    Globe,
    Smartphone,
    Clock,
    Award,
    TrendingUp,
    MessageCircle,
    Calendar
};

export default function Welcome({ settings }: { settings: any }) {
    const hero = settings.hero_section || {};
    const features = settings.features_section || {};
    const stats = settings.stats_section || {};
    const testimonials = settings.testimonials_section || {};
    const faq = settings.faq_section || {};
    const cta = settings.cta_section || {};

    const colorClasses: { [key: string]: string } = {
        emerald: 'border-t-emerald-500 from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700',
        purple: 'border-t-purple-500 from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
        orange: 'border-t-orange-500 from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700',
        red: 'border-t-red-500 from-red-500 to-red-600 dark:from-red-600 dark:to-red-700',
        teal: 'border-t-teal-500 from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700',
        blue: 'border-t-blue-500 from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
    };

    const renderIcon = (name: string, props: any = {}) => {
        const Icon = (Icons as any)[name];
        return Icon ? <Icon {...props} /> : null;
    };

    return (
        <>
            <SiteLayout>
                {/* Hero Section */}
                <main className="relative overflow-hidden gradient-hero text-white shadow-lg">
                    
                    {/* Background Overlays & Noise */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-transparent dark:bg-black/40 transition-colors duration-300"></div>
                        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="text-center lg:text-right">
                                {hero.badge && (
                                    <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md inline-flex items-center gap-2 shadow-sm">
                                        {renderIcon(hero.badge.icon, { className: "w-4 h-4 text-yellow-400 fill-yellow-400" })}
                                        {hero.badge.text}
                                    </Badge>
                                )}
                                
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
                                    <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 bg-clip-text text-transparent">
                                        {hero.title_gradient}
                                    </span>
                                    <br />
                                    <span className="text-gray-50">
                                        {hero.title_main}
                                    </span>
                                </h1>
                                <p className="text-xl text-blue-50/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                                    {hero.description}
                                </p>

                                {/* Features Preview: */}
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                                    {(hero.features || []).map((feature: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/10 text-white hover:bg-white/20 transition-colors">
                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    {/* The register and dashboard links have been removed from here. */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Decorations: */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl mix-blend-screen animate-pulse delay-700"></div>
                    </div>
                </main>


                {/* Features Section */}
                <section id="features" className="py-24 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            {features.badge && (
                                <Badge className={`mb-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300`}>
                                    {renderIcon(features.badge.icon, { className: "w-4 h-4 ml-1" })}
                                    {features.badge.text}
                                </Badge>
                            )}
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {features.title}
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                {features.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(features.items || []).map((item: any, idx: number) => {
                                const classes = colorClasses[item.border_color] || colorClasses.blue;
                                const borderClass = classes.split(' ')[0];
                                const gradientClass = classes.split(' ').slice(1).join(' ');
                                
                                return (
                                    <Card key={idx} className={`p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 ${borderClass} group`}>
                                        <div className={`w-14 h-14 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            {renderIcon(item.icon, { className: "w-7 h-7 text-white" })}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Enhanced Statistics Section */}
                <section className="py-24 gradient-primary relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.2'%3E%3Cpath d='m0 40 40-40V0H0v40z'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            {stats.badge && (
                                <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                                    {renderIcon(stats.badge.icon, { className: "w-4 h-4 ml-1" })}
                                    {stats.badge.text}
                                </Badge>
                            )}
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                {stats.title}
                            </h2>
                            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                                {stats.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {(stats.main_stats || []).map((stat: any, idx: number) => (
                                <div key={idx} className="text-center group">
                                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-4 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300 border border-white/20 shadow-xl">
                                        <div className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">{stat.value}</div>
                                        <div className="text-blue-100 font-semibold text-lg">{stat.label}</div>
                                        <div className="text-sm text-blue-200 mt-2 font-medium">{stat.sub_label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Additional Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                            {(stats.extra_stats || []).map((stat: any, idx: number) => (
                                <div key={idx} className="text-center group">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mb-4 shadow-lg group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                                        {renderIcon(stat.icon, { className: "w-10 h-10 text-white" })}
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{stat.value}</div>
                                    <div className="text-blue-100 font-semibold">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
                </section>

                {/* Testimonials Section */}
                <section className="py-24 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            {testimonials.badge && (
                                <Badge className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-300">
                                    {renderIcon(testimonials.badge.icon, { className: "w-4 h-4 ml-1" })}
                                    {testimonials.badge.text}
                                </Badge>
                            )}
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {testimonials.title}
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                {testimonials.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(testimonials.items || []).map((item: any, idx: number) => {
                                const classes = colorClasses[item.border_color] || colorClasses.blue;
                                const borderClass = classes.split(' ')[0];
                                const gradientClass = classes.split(' ').slice(1).join(' ');

                                return (
                                    <Card key={idx} className={`p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 ${borderClass} group`}>
                                        <div className="flex items-center gap-1 mb-6">
                                            {[...Array(item.rating || 5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-base font-medium">
                                            {item.content}
                                        </p>
                                        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                {item.initials}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white">{item.name}</div>
                                                <div className="text-sm text-gray-500 font-medium">{item.role}</div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>
                {/* FAQ Section */}
                <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            {faq.badge && (
                                <Badge className="mb-4 bg-amber-100/80 text-amber-900 border-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-800 shadow-sm px-4 py-1.5 text-sm">
                                    {renderIcon(faq.badge.icon, { className: "w-4 h-4 ml-2" })}
                                    {faq.badge.text}
                                </Badge>
                            )}
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {faq.title}
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                {faq.description}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-900/50 rounded-3xl p-2 sm:p-6 shadow-xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
                            <Accordion type="single" collapsible className="w-full">
                                {(faq.items || []).map((item: any, idx: number) => (
                                    <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-gray-100 dark:border-gray-800 last:border-0 px-4">
                                        <AccordionTrigger className="text-right text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 py-6 transition-all duration-300 no-underline hover:no-underline">
                                            {item.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-600 dark:text-gray-400 text-base leading-relaxed pb-6">
                                            {item.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-24 bg-white dark:bg-gray-950 animate-fade-in-up">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                {cta.title}
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                                {cta.description}
                            </p>
                            {/* Features Preview: */}
                            <div className="flex flex-wrap justify-center gap-4 mb-8">
                                {(cta.features || []).map((feature: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/10  hover:bg-white/20 transition-colors">
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </SiteLayout >
        </>
    );
}
