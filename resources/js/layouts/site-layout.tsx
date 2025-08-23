import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    BookOpen,
    Menu,
    X,
    ChevronDown,
    Users,
    BarChart3,
    Settings,
    Home,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Globe,
    Clock,
    Shield,
    Award,
    ArrowUp,
    Bell,
    Search,
    Sun,
    Moon
} from 'lucide-react';
import { type SharedData } from '@/types';

interface SiteLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function SiteLayout({ children, title }: SiteLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
    const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Handle scroll to top button visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle dark mode toggle
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Navigation items
    const navigationItems = [
        { name: 'الرئيسية', href: '/', icon: Home },
        { name: 'من نحن', href: '/about', icon: Users },
        { name: 'خدماتنا', href: '/services', icon: Award },
        { name: 'تواصل معنا', href: '/contact', icon: Phone },
    ];

    const serviceItems = [
        { name: 'إدارة الحلق', href: '/halaqahs', icon: BookOpen, description: 'إدارة شاملة للحلق القرآنية' },
        { name: 'إدارة الطلاب', href: '/students', icon: Users, description: 'متابعة وإدارة بيانات الطلاب' },
        { name: 'التقارير والإحصائيات', href: '/reports', icon: BarChart3, description: 'تقارير مفصلة وإحصائيات دقيقة' },
        { name: 'الإعدادات', href: '/settings', icon: Settings, description: 'إعدادات النظام والتخصيص' },
    ];

    const helpItems = [
        { name: 'الأسئلة الشائعة', href: '/faq', icon: BookOpen },
        { name: 'مركز المساعدة', href: '/help', icon: Award },
        { name: 'الدعم الفني', href: '/support', icon: Phone },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {/* Top Bar */}
            <div className="gradient-primary text-white py-2 px-4 animate-fade-in">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 hover-scale-sm">
                            <Phone className="w-4 h-4" />
                            <span>+966 50 123 4567</span>
                        </div>
                        <div className="flex items-center gap-2 hover-scale-sm">
                            <Mail className="w-4 h-4" />
                            <span>info@tajwaqar.com</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>دعم 24/7</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Facebook className="w-4 h-4 hover:text-blue-200 cursor-pointer transition-colors hover-scale-sm" />
                            <Twitter className="w-4 h-4 hover:text-blue-200 cursor-pointer transition-colors hover-scale-sm" />
                            <Instagram className="w-4 h-4 hover:text-blue-200 cursor-pointer transition-colors hover-scale-sm" />
                            <Linkedin className="w-4 h-4 hover:text-blue-200 cursor-pointer transition-colors hover-scale-sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <header className="bg-card/95 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-sm animate-fade-in-down">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group hover-lift">
                            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg animate-pulse-glow">
                                <BookOpen className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gradient">
                                    تاج الوقار
                                </h1>
                                <p className="text-sm text-muted-foreground">منصة الحلق القرآنية</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {navigationItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200 font-medium hover-scale-sm animate-fade-in-up"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}

                            {/* Services Dropdown */}
                            <div className="relative animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                                <button
                                    onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200 font-medium hover-scale-sm"
                                >
                                    <Settings className="w-4 h-4" />
                                    الخدمات
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {servicesDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-80 bg-card rounded-xl shadow-xl border border-border py-2 z-50 animate-scale-in glass-morphism">
                                        <div className="px-4 py-3 border-b border-border">
                                            <h3 className="font-semibold text-foreground">خدمات المنصة</h3>
                                            <p className="text-sm text-muted-foreground">حلول شاملة لإدارة الحلق القرآنية</p>
                                        </div>
                                        {serviceItems.map((service, index) => {
                                            const Icon = service.icon;
                                            return (
                                                <Link
                                                    key={service.name}
                                                    href={service.href}
                                                    className="flex items-start gap-3 px-4 py-3 text-foreground hover:bg-muted hover:text-primary transition-colors duration-200 animate-fade-in-up hover-lift"
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Icon className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="font-medium block">{service.name}</span>
                                                        <span className="text-sm text-muted-foreground">{service.description}</span>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Help Dropdown */}
                            <div className="relative animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                                <button
                                    onClick={() => setHelpDropdownOpen(!helpDropdownOpen)}
                                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200 font-medium hover-scale-sm"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    المساعدة
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${helpDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {helpDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-64 bg-card rounded-xl shadow-xl border border-border py-2 z-50 animate-scale-in glass-morphism">
                                        {helpItems.map((item, index) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted hover:text-primary transition-colors duration-200 animate-fade-in-up hover-lift"
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span className="font-medium">{item.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-4">
                            {/* Search Button */}
                            <button className="hidden md:flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors duration-200 hover-scale-sm animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="hidden md:flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors duration-200 hover-scale-sm animate-fade-in-up"
                                style={{ animationDelay: '650ms' }}
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Auth Buttons */}
                            {auth.user ? (
                                <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                                    <button className="hidden md:flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors duration-200 relative hover-scale-sm">
                                        <Bell className="w-5 h-5" />
                                        <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-destructive text-destructive-foreground text-xs flex items-center justify-center animate-bounce">
                                            3
                                        </Badge>
                                    </button>
                                    <Button asChild className="gradient-primary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                                        <Link href={route('dashboard')}>
                                            <BarChart3 className="w-4 h-4 ml-2" />
                                            لوحة التحكم
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                                    <Button variant="ghost" asChild className="hidden sm:inline-flex hover-scale-sm">
                                        <Link href={route('login')}>
                                            تسجيل الدخول
                                        </Link>
                                    </Button>
                                    <Button asChild className="gradient-primary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                                        <Link href={route('register')}>
                                            <Users className="w-4 h-4 ml-2" />
                                            إنشاء حساب
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 hover-scale-sm animate-fade-in-up"
                                style={{ animationDelay: '750ms' }}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden py-4 border-t border-border animate-slide-in-down">
                            <nav className="flex flex-col gap-2">
                                {navigationItems.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="flex items-center gap-3 px-3 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors duration-200 animate-fade-in-right hover-lift"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                                
                                <div className="border-t border-border mt-2 pt-2">
                                    <div className="px-3 py-2 text-sm font-medium text-muted-foreground">الخدمات</div>
                                    {serviceItems.map((service, index) => {
                                        const Icon = service.icon;
                                        return (
                                            <Link
                                                key={service.name}
                                                href={service.href}
                                                className="flex items-center gap-3 px-6 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors duration-200 animate-fade-in-right hover-lift"
                                                style={{ animationDelay: `${(index + 4) * 50}ms` }}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <div>
                                                    <div className="font-medium">{service.name}</div>
                                                    <div className="text-xs text-muted-foreground">{service.description}</div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className="border-t border-border mt-2 pt-2">
                                    <div className="px-3 py-2 text-sm font-medium text-muted-foreground">المساعدة</div>
                                    {helpItems.map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-center gap-3 px-6 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors duration-200 animate-fade-in-right hover-lift"
                                                style={{ animationDelay: `${(index + 8) * 50}ms` }}
                                            >
                                                <Icon className="w-5 h-5" />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {!auth.user && (
                                    <div className="border-t border-border mt-2 pt-2">
                                        <Link
                                            href={route('login')}
                                            className="flex items-center gap-3 px-3 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors duration-200 sm:hidden animate-fade-in-right hover-lift"
                                            style={{ animationDelay: '550ms' }}
                                        >
                                            تسجيل الدخول
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 dark:bg-gray-950 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='5' cy='5' r='5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="relative z-10">
                    {/* Main Footer Content */}
                    <div className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {/* Company Info */}
                                <div className="lg:col-span-2">
                                    <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
                                        <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                                            <BookOpen className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">تاج الوقار</h3>
                                            <p className="text-gray-400">منصة الحلق القرآنية الرائدة</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-6 max-w-md leading-relaxed animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                        منصة رائدة ومتطورة في مجال إدارة الحلق القرآنية والمؤسسات التعليمية الإسلامية، نسعى لتوفير حلول تقنية متطورة ومبتكرة.
                                    </p>
                                    
                                    {/* Trust Badges */}
                                    <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                        <div className="flex items-center gap-2 glass-morphism px-3 py-2 rounded-lg hover-scale-sm">
                                            <Shield className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm">أمان عالي</span>
                                        </div>
                                        <div className="flex items-center gap-2 glass-morphism px-3 py-2 rounded-lg hover-scale-sm">
                                            <Award className="w-4 h-4 text-yellow-400" />
                                            <span className="text-sm">معتمد</span>
                                        </div>
                                        <div className="flex items-center gap-2 glass-morphism px-3 py-2 rounded-lg hover-scale-sm">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                            <span className="text-sm">دعم 24/7</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                                    <h4 className="text-lg font-semibold mb-6 text-white">روابط سريعة</h4>
                                    <ul className="space-y-3">
                                        <li>
                                            <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group hover-scale-sm">
                                                <Home className="w-4 h-4 group-hover:text-blue-400" />
                                                الرئيسية
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group hover-scale-sm">
                                                <Users className="w-4 h-4 group-hover:text-blue-400" />
                                                من نحن
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/services" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group hover-scale-sm">
                                                <Award className="w-4 h-4 group-hover:text-blue-400" />
                                                خدماتنا
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group hover-scale-sm">
                                                <Phone className="w-4 h-4 group-hover:text-blue-400" />
                                                تواصل معنا
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group hover-scale-sm">
                                                <BookOpen className="w-4 h-4 group-hover:text-blue-400" />
                                                الأسئلة الشائعة
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                {/* Contact Info */}
                                <div>
                                    <h4 className="text-lg font-semibold mb-6 text-white">تواصل معنا</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <div className="text-gray-300">البريد الإلكتروني</div>
                                                <a href="mailto:info@tajwaqar.com" className="text-white hover:text-blue-400 transition-colors">
                                                    info@tajwaqar.com
                                                </a>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <div className="text-gray-300">رقم الهاتف</div>
                                                <a href="tel:+966501234567" className="text-white hover:text-emerald-400 transition-colors">
                                                    +966 50 123 4567
                                                </a>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <div className="text-gray-300">العنوان</div>
                                                <span className="text-white">الرياض، المملكة العربية السعودية</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Globe className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <div className="text-gray-300">الموقع الإلكتروني</div>
                                                <a href="https://tajwaqar.com" className="text-white hover:text-yellow-400 transition-colors">
                                                    www.tajwaqar.com
                                                </a>
                                            </div>
                                        </li>
                                    </ul>

                                    {/* Social Media */}
                                    <div className="mt-6">
                                        <h5 className="text-sm font-medium text-gray-300 mb-3">تابعنا على</h5>
                                        <div className="flex items-center gap-3">
                                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200 group">
                                                <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white" />
                                            </a>
                                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-colors duration-200 group">
                                                <Twitter className="w-5 h-5 text-gray-300 group-hover:text-white" />
                                            </a>
                                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors duration-200 group">
                                                <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white" />
                                            </a>
                                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors duration-200 group">
                                                <Linkedin className="w-5 h-5 text-gray-300 group-hover:text-white" />
                                            </a>
                                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors duration-200 group">
                                                <Youtube className="w-5 h-5 text-gray-300 group-hover:text-white" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="border-t border-gray-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="text-gray-400 text-sm text-center md:text-right animate-fade-in-up">
                                    © 2024 تاج الوقار. جميع الحقوق محفوظة. تم التطوير بـ ❤️ في المملكة العربية السعودية
                                </div>
                                <div className="flex items-center gap-6 text-sm text-gray-400 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                    <Link href="/terms" className="hover:text-white transition-colors hover-scale-sm">
                                        شروط الاستخدام
                                    </Link>
                                    <Link href="/privacy" className="hover:text-white transition-colors hover-scale-sm">
                                        سياسة الخصوصية
                                    </Link>
                                    <Link href="/contact" className="hover:text-white transition-colors hover-scale-sm">
                                        اتصل بنا
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 left-8 w-12 h-12 gradient-primary hover:opacity-90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group hover-lift animate-bounce-slow"
                >
                    <ArrowUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            )}
        </div>
    );
}