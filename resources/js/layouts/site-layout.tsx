import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
    BookOpen, Menu, ChevronDown, Users, Settings, Home, Phone, Mail,
    MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Clock,
    Shield, Award, ArrowUp, Sun, Moon,
} from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SiteLayoutProps {
    children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
    // -- State Management --
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [bePartOfUsDropdownOpen, setBePartOfUsDropdownOpen] = useState(false);
    const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [currentPath, setCurrentPath] = useState('');

    // -- Refs for Click Detection --
    const bePartOfUsDropdownRef = useRef<HTMLDivElement>(null);
    const helpDropdownRef = useRef<HTMLDivElement>(null);

    // -- Effects --
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (bePartOfUsDropdownOpen && bePartOfUsDropdownRef.current && !bePartOfUsDropdownRef.current.contains(target)) {
                setBePartOfUsDropdownOpen(false);
            }

            if (helpDropdownOpen && helpDropdownRef.current && !helpDropdownRef.current.contains(target)) {
                setHelpDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [bePartOfUsDropdownOpen, helpDropdownOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // -- Handlers --
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const isActive = (path: string) => currentPath === path;

    // -- Navigation Data --
    const navigationItems = [
        { name: 'الرئيسية', href: '/', icon: Home },
        { name: 'من نحن', href: '/about', icon: Users },
        { name: 'خدماتنا', href: '/services', icon: Award },
        { name: 'تواصل معنا', href: '/contact', icon: Phone },
    ];
    
    const bePartOfUs = [
        { name: 'شارك كمعلم', href: '/teachers/apply', icon: Users, description: 'انظم كمعلم وكن جزءا في عملية المساهمة التعليمية' },
        { name: 'انظم كمدرسة', href: '/schools/apply', icon: Home, description: 'أضف مدرستك لتستفيد من ميزاتنا الفريدة' },
    ];

    const helpItems = [
        { name: 'الأسئلة الشائعة', href: '/faq', icon: BookOpen },
        { name: 'مركز المساعدة', href: '/help', icon: Shield },
        { name: 'الدعم الفني', href: '/support', icon: Phone },
    ];

    return (
        <div className="h-screen min-h-screen bg-background text-foreground overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {/* Top Bar Info */}
            <div className="gradient-primary text-white py-1.5 px-3 md:py-2 md:px-4 animate-fade-in">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-0">
                    
                    {/* Contact Info */}
                    <div className="flex items-center justify-center gap-3 md:gap-6 w-full md:w-auto text-[10px] sm:text-xs md:text-sm font-medium">
                        <a href="tel:+966501234567" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                            <Phone className="w-3 h-3 md:w-4 md:h-4" />
                            <span dir="ltr">+966 50 123 4567</span>
                        </a>
                        <span className="hidden sm:inline w-px h-3 bg-white/20"></span>
                        <a href="mailto:info@shafeea.com" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                            <Mail className="w-3 h-3 md:w-4 md:h-4" />
                            <span>info@shafeea.com</span>
                        </a>
                    </div>

                    {/* Socials & Support */}
                    <div className="flex items-center justify-center gap-4 w-full md:w-auto">
                        <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm">
                            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-300" />
                            <span>دعم 24/7</span>
                        </div>
                        
                        <div className="flex items-center gap-3 md:gap-3">
                            <Facebook className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-blue-200 cursor-pointer transition-transform hover:scale-110" />
                            <Twitter className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-sky-200 cursor-pointer transition-transform hover:scale-110" />
                            <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-pink-200 cursor-pointer transition-transform hover:scale-110" />
                            <Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-blue-300 cursor-pointer transition-transform hover:scale-110" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="bg-card/95 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        
                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center gap-3 group hover-lift">
                            <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
                                <img 
                                    src="/logo.png" 
                                    alt="Shafeea Logo" 
                                    className="w-10 h-10 object-contain" 
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    شفيع
                                </h1>
                                <p className="text-sm text-muted-foreground">المنصة القرآنية الرائدة</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation Menu */}
                        <nav className="hidden lg:flex items-center gap-3">
                            {navigationItems.map((item, index) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`
                                            flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover-scale-sm
                                            ${active 
                                                ? `bg-gray-100 dark:bg-sky-900/20 text-black dark:text-white` 
                                                : 'text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-foreground'
                                            }
                                            `}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                        <Icon className={`w-4 h-4 ${active ? 'scale-110' : "text-black dark:text-white"}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}

                            <div className="w-px h-6 bg-border mx-1"></div>

                            {/* Join Us Dropdown */}
                            <div 
                                ref={bePartOfUsDropdownRef}
                                className="relative animate-fade-in-up" 
                                style={{ animationDelay: '500ms' }}
                            >
                                <button
                                    onClick={() => setBePartOfUsDropdownOpen(!bePartOfUsDropdownOpen)}
                                    className={`
                                        flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover-scale-sm
                                        ${bePartOfUsDropdownOpen 
                                            ? 'bg-gray-100 dark:bg-sky-900/20  text-black dark:text-white border border-black-70 dark:border-white' 
                                            : 'text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-800'}
                                    `}
                                >
                                    <Settings className={`w-4 h-4 text-black dark:text-white`} />
                                    انظم إلينا
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${bePartOfUsDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {bePartOfUsDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-3 w-72 bg-card rounded-xl shadow-xl border border-border py-2 z-50 animate-scale-in">
                                        <div className="px-4 py-3 border-b border-border bg-muted/20">
                                            <h3 className="font-bold text-foreground">كن جزءًا منا</h3>
                                            <p className="text-xs text-muted-foreground mt-1">ساهم كمعلم أو سجل مدرستك</p>
                                        </div>
                                        {bePartOfUs.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={() => setBePartOfUsDropdownOpen(false)}
                                                    className="flex items-start gap-3 px-4 py-3 text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
                                                >
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-opacity-10 bg-gray-100 dark:bg-sky-900/20 group-hover:bg-opacity-20 transition-colors`}>
                                                        <Icon className={`w-5 h-5  text-black dark:text-white`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className={`font-medium block text-sm group-hover: text-black dark:text-white transition-colors`}>{item.name}</span>
                                                        <span className="text-xs text-muted-foreground">{item.description}</span>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Help Dropdown */}
                            <div 
                                ref={helpDropdownRef}
                                className="relative animate-fade-in-up" 
                                style={{ animationDelay: '500ms' }}
                            >
                                <button
                                    onClick={() => setHelpDropdownOpen(!helpDropdownOpen)}
                                    className={`
                                        flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover-scale-sm
                                        ${helpDropdownOpen 
                                            ? 'bg-gray-100 dark:bg-sky-900/20  text-black dark:text-white border border-black-70 dark:border-white' 
                                            : 'text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-800'}
                                    `}
                                >
                                    <BookOpen className={`w-4 h-4  text-black dark:text-white`} />
                                    المساعدة
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${helpDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {helpDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-3 w-60 bg-card rounded-xl shadow-xl border border-border py-2 z-50 animate-scale-in">
                                        {helpItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={() => setHelpDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-opacity-10 bg-gray-100 dark:bg-sky-900/20 group-hover:bg-opacity-20`}>
                                                        <Icon className={`w-4 h-4  text-black dark:text-white`} />
                                                    </div>
                                                    <span className="font-medium text-sm group-hover:text-primary transition-colors">{item.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </nav>

                        {/* Right Actions & Mobile Toggle */}
                        <div className="flex items-center gap-2">
                            <button onClick={toggleDarkMode} className="p-2 text-muted-foreground hover:bg-muted rounded-full">
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <button className="lg:hidden p-2 rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20">
                                        <Menu className="w-6 h-6" />
                                    </button>
                                </SheetTrigger>
                                
                                {/* Side Bar with Close button on the left ([&>button]:left-4) */}
                                <SheetContent side="right" className="h-screen min-h-screen w-[300px] p-0 border-l border-border bg-card [&>button]:left-4 [&>button]:right-auto">
                                    <div className="flex flex-col h-full h-screen">
                                        {/* Header inside Sidebar */}
                                        <div className="p-6 border-b border-border bg-gradient-to-l from-primary/10 to-transparent">
                                            <div className="flex items-center gap-3 mb-2">
                                                <img src="/logo.png" alt="Logo" className="w-10 h-10 bg-white p-1 rounded-lg shadow-sm" />
                                                <span className="text-xl font-bold text-primary">منصة شفيع</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">مستقبل التعليم القرآني بين يديك</p>
                                        </div>

                                        {/* Navigation Links Scrollable Area */}
                                        <div className="flex-1 overflow-y-auto py-4 px-3 h-screen min-h-screen ">
                                            
                                            {/* Section 1: Main Menu */}
                                            <div className="space-y-1 mb-6">
                                                <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">القائمة الرئيسية</p>
                                                {navigationItems.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                                            isActive(item.href) 
                                                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                                                            : 'hover:bg-muted text-foreground'
                                                        }`}
                                                    >
                                                        <item.icon className={`w-5 h-5 ${isActive(item.href) ? '' : 'text-primary'}`} />
                                                        <span className="font-bold text-sm">{item.name}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Section 2: Join Us (With Active Shading) */}
                                            <div className="space-y-1 mb-6">
                                                <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">انظم إلينا</p>
                                                {bePartOfUs.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                                            isActive(item.href) 
                                                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                                                            : 'hover:bg-muted text-foreground'
                                                        }`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive(item.href) ? 'bg-white/20' : 'bg-primary/10'}`}>
                                                            <item.icon className={`w-4 h-4 ${isActive(item.href) ? 'text-white' : 'text-primary'}`} />
                                                        </div>
                                                        <span className="font-medium text-sm">{item.name}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Section 3: Help & Support (Added to SideBar) */}
                                            <div className="space-y-1 mb-6">
                                                <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">المساعدة والدعم</p>
                                                {helpItems.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                                            isActive(item.href) 
                                                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                                                            : 'hover:bg-muted text-foreground'
                                                        }`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive(item.href) ? 'bg-white/20' : 'bg-primary/10'}`}>
                                                            <item.icon className={`w-4 h-4 ${isActive(item.href) ? 'text-white' : 'text-primary'}`} />
                                                        </div>
                                                        <span className="font-medium text-sm">{item.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer Section */}
            <footer className="bg-[#0f172a] text-white relative overflow-hidden border-t border-gray-800">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-gray-900"></div>
                </div>

                <div className="relative z-10">
                    <div className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                
                                {/* Company Info */}
                                <div className="lg:col-span-2">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="bg-white p-2 rounded-xl shadow-lg shadow-blue-900/20">
                                            <img src="/logo.png" alt="Shafeea" className="w-10 h-10 object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">شفيع</h3>
                                            <p className="text-gray-400 text-sm">منصة التعليم القرآني</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 mb-8 max-w-md leading-relaxed text-sm">
                                        منصة رائدة ومتطورة في مجال إدارة التعليم القرآني والمؤسسات التعليمية الإسلامية، نسعى لتوفير حلول تقنية متطورة ومبتكرة تخدم كتاب الله.
                                    </p>
                                    
                                    {/* Footer Badges */}
                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex items-center gap-2 bg-gray-800/60 border border-gray-700 px-3 py-1.5 rounded text-xs text-gray-300">
                                            <Shield className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>حماية وتشفير</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-gray-800/60 border border-gray-700 px-3 py-1.5 rounded text-xs text-gray-300">
                                            <Award className="w-3.5 h-3.5 text-amber-400" />
                                            <span>جودة معتمدة</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-200 border-b border-gray-800 pb-2 inline-block">
                                        روابط هامة
                                    </h4>
                                    <ul className="space-y-3">
                                        {navigationItems.map((item) => (
                                            <li key={item.name}>
                                                <Link href={item.href} className="text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 text-sm group">
                                                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-blue-400 transition-colors"></span>
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Contact Info */}
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-200 border-b border-gray-800 pb-2 inline-block">
                                        تواصل معنا
                                    </h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <Mail className="w-4 h-4 text-blue-400 mt-1" />
                                            <span className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">info@shafeea.com</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Phone className="w-4 h-4 text-emerald-400 mt-1" />
                                            <span className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer" dir="ltr">+966 50 123 4567</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-purple-400 mt-1" />
                                            <span className="text-sm text-gray-400">الرياض، المملكة العربية السعودية</span>
                                        </li>
                                    </ul>

                                    {/* Social Media - Square & Colorful */}
                                    <div className="mt-8 flex items-center gap-2">
                                        <a href="#" className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white transition-all">
                                            <Facebook className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#1DA1F2] hover:text-white transition-all">
                                            <Twitter className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#E4405F] hover:text-white transition-all">
                                            <Instagram className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#0A66C2] hover:text-white transition-all">
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                        <a href="#" className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#FF0000] hover:text-white transition-all">
                                            <Youtube className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom Bar */}
                    <div className="border-t border-gray-800 bg-gray-950/50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="text-gray-500 text-xs text-center md:text-right">
                                    © {new Date().getFullYear()} منصة شفيع. جميع الحقوق محفوظة.
                                </div>
                                <div className="flex items-center gap-6 text-xs text-gray-500">
                                    <Link href="/terms" className="hover:text-sky-400 transition-colors">شروط الاستخدام</Link>
                                    <Link href="/privacy" className="hover:text-sky-400 transition-colors">سياسة الخصوصية</Link>
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
                    className="fixed bottom-8 left-8 w-10 h-10 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 animate-bounce-slow border border-white/10"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}