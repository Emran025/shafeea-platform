import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Menu,
    X,
    ChevronDown,
    Users,
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
    Clock,
    Shield,
    Award,
    ArrowUp,
    Search,
    Sun,
    Moon
} from 'lucide-react';

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
        }
    }, []);

    /**
     * Handle clicks outside of dropdowns to close them.
     */
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

    /**
     * Handle scroll position to toggle "Scroll to Top" button visibility.
     */
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

    // -- Data --

    // أعدت الألوان هنا لتكون حيوية
    const navigationItems = [
        { 
            name: 'الرئيسية', 
            href: '/', 
            icon: Home, 
        },
        { 
            name: 'من نحن', 
            href: '/about', 
            icon: Users, 

        },
        { 
            name: 'خدماتنا', 
            href: '/services', 
            icon: Award, 
        },
        { 
            name: 'تواصل معنا', 
            href: '/contact', 
            icon: Phone, 
        },
    ];
    
    const bePartOfUs = [
        { name: 'شارك كمعلم', href: '/teachers/apply', icon: Users,  description: 'انظم كمعلم وكن جزءا في عملية المساهمة التعليمية'},
        { name: 'انظم كمدرسة', href: '/schools/apply', icon: Home,  description: 'أضف مدرستك لتستفيد من ميزاتنا الفريدة'},
    ];

    const helpItems = [
        { name: 'الأسئلة الشائعة', href: '/faq', icon: BookOpen},
        { name: 'مركز المساعدة', href: '/help', icon: Shield},
        { name: 'الدعم الفني', href: '/support', icon: Phone },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}> 
            {/* Top Bar Info */}
            <div className="gradient-primary text-white py-1.5 px-3 md:py-2 md:px-4 animate-fade-in">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-0">
                    
                    {/* Contact Info - Ultra compact for mobile */}
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
                        
                        {/* Icons container */}
                        <div className="flex items-center gap-3 md:gap-3">
                            <Facebook className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-blue-200 cursor-pointer transition-transform hover:scale-110" />
                            <Twitter className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-sky-200 cursor-pointer transition-transform hover:scale-110" />
                            <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-pink-200 cursor-pointer transition-transform hover:scale-110" />
                            <Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-blue-300 cursor-pointer transition-transform hover:scale-110" />
                        </div>
                    </div>
                    
                </div>
            </div>

            {/* Main Navigation Header */}
            <header className="bg-card/95 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-sm animate-fade-in-down">
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
                                                ? `bg-gray-100 dark:bg-sky-900/20 text-black dark:text-white` // هنا التعديل: خلفية ملونة فاتحة وحدود خفيفة
                                                : 'text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-foreground' // حالة عدم النشاط
                                            }
                                            `}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                        <Icon className={`w-4 h-4 ${active ? 'scale-110' : "text-black dark:text-white"}`} />
                                        {item.name}
                                    </Link>
                                        // bg-background text-foreground hover:bg-secondary hover:text-primary border-border
                                        // bg-primary text-primary-foreground hover:bg-primary/90
                                );
                            })}

                            {/* Divider */}
                            <div className="w-px h-6 bg-border mx-1"></div>

                            {/* Services Dropdown */}
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

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-3">
                            {/* Search Button */}
                            <button className="hidden md:flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 hover-scale-sm animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="hidden md:flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors duration-200 hover-scale-sm animate-fade-in-up"
                                style={{ animationDelay: '650ms' }}
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 hover-scale-sm animate-fade-in-up"
                                style={{ animationDelay: '750ms' }}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden py-4 border-t border-border animate-slide-in-down">
                            <nav className="flex flex-col gap-2">
                                {navigationItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`
                                                flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 animate-fade-in-right hover-lift
                                                ${active 
                                                    ? `bg-gray-100 dark:bg-sky-900/20 text-black dark:text-white font-bold` 
                                                    : 'text-foreground hover:bg-gray-50 dark:hover:bg-gray-800'}
                                            `}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <Icon className={`w-5 h-5 ${active ? '' : " text-black dark:text-white"}`} />
                                            {item.name}
                                        </Link>
                                    );
                                })}

                                <div className="border-t border-border mt-2 pt-2">
                                    <div className="px-3 py-2 text-sm font-medium text-muted-foreground">انضم إلينا</div>
                                    {bePartOfUs.map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-center gap-3 px-6 py-3 text-foreground hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 animate-fade-in-right hover-lift"
                                                style={{ animationDelay: `${(index + 8) * 50}ms` }}
                                            >
                                                <Icon className={`w-5 h-5  text-black dark:text-white`} />
                                                {item.name}
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
                                                className="flex items-center gap-3 px-6 py-3 text-foreground hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 animate-fade-in-right hover-lift"
                                                style={{ animationDelay: `${(index + 8) * 50}ms` }}
                                            >
                                                <Icon className={`w-5 h-5  text-black dark:text-white`} />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer Section - The one you liked */}
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