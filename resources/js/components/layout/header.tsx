import React from 'react';
import { Link } from '@inertiajs/react';
import { Menu, Sun, Moon, ChevronDown, Settings, BookOpen } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navigationItems, bePartOfUs, helpItems, sitNavigationItems } from '@/config/site-nav';

interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    currentPath: string;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    bePartOfUsDropdownOpen: boolean;
    setBePartOfUsDropdownOpen: (open: boolean) => void;
    helpDropdownOpen: boolean;
    setHelpDropdownOpen: (open: boolean) => void;
    bePartOfUsRef: React.RefObject<HTMLDivElement | null>; 
    helpRef: React.RefObject<HTMLDivElement | null>;
}

export function Header({
    isDarkMode, toggleDarkMode, currentPath, mobileMenuOpen, setMobileMenuOpen,
    bePartOfUsDropdownOpen, setBePartOfUsDropdownOpen, helpDropdownOpen, setHelpDropdownOpen,
    bePartOfUsRef, helpRef
}: HeaderProps) {
    
    const isActive = (path: string) => currentPath === path;

    return (
        <header className="bg-card/95 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">شفيع</h1>
                            <p className="text-sm text-muted-foreground">المنصة القرآنية الرائدة</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-3">
                        {navigationItems.map((item) => (
                            <Link key={item.name} href={item.href} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive(item.href) ? 'bg-gray-100 dark:bg-sky-900/20 text-black dark:text-white' : 'text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                <item.icon className={`w-4 h-4 ${isActive(item.href) ? 'scale-110' : ""}`} />
                                {item.name}
                            </Link>
                        ))}
                        <div className="w-px h-6 bg-border mx-1" />
                        
                        {/* Dropdowns logic (Join Us & Help) */}
                        {[ 
                            { label: 'انظم إلينا', open: bePartOfUsDropdownOpen, set: setBePartOfUsDropdownOpen, ref: bePartOfUsRef, items: bePartOfUs, icon: Settings },
                            { label: 'المساعدة', open: helpDropdownOpen, set: setHelpDropdownOpen, ref: helpRef, items: helpItems, icon: BookOpen }
                        ].map((dropdown) => (
                            <div key={dropdown.label} ref={dropdown.ref as React.RefObject<HTMLDivElement>} className="relative">
                                <button onClick={() => dropdown.set(!dropdown.open)} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${dropdown.open ? 'bg-gray-100 dark:bg-sky-900/20 text-black dark:text-white' : 'text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                    <dropdown.icon className="w-4 h-4" />
                                    {dropdown.label}
                                    <ChevronDown className={`w-3 h-3 transition-transform ${dropdown.open ? 'rotate-180' : ''}`} />
                                </button>
                                {dropdown.open && (
                                    <div className="absolute top-full right-0 mt-3 w-72 bg-card rounded-xl shadow-xl border border-border py-2 z-50 animate-scale-in">
                                        {dropdown.items.map((subItem: { name: string; href: string; icon: React.ComponentType<{ className?: string }>; description?: string }) => (
                                            <Link key={subItem.name} href={subItem.href} onClick={() => dropdown.set(false)} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors">
                                                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-sky-900/20 group-hover:bg-primary/10 transition-colors">
                                                    <subItem.icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-medium block text-sm group-hover:text-primary transition-colors">{subItem.name}</span>
                                                    {subItem.description && <span className="text-xs text-muted-foreground">{subItem.description}</span>}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right Actions & Mobile Toggle */}
                    <div className="flex items-center gap-2">
                        <button onClick={toggleDarkMode} className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <button className="lg:hidden p-2 rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20">
                                    <Menu className="w-6 h-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] p-0 border-l border-border bg-card [&>button]:left-4 [&>button]:right-auto">
                                <div className="flex flex-col h-full">
                                    <div className="p-6 border-b border-border bg-gradient-to-l from-primary/10 to-transparent">
                                        <div className="flex items-center gap-3 mb-2">
                                            <img src="/logo.png" alt="Logo" className="w-10 h-10 bg-white p-1 rounded-lg shadow-sm" />
                                            <span className="text-xl font-bold text-primary">منصة شفيع</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">مستقبل التعليم القرآني بين يديك</p>
                                    </div>
                                    <div className="flex-1 py-4 px-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        {sitNavigationItems.map((section) => (
                                            <div key={section.title} className="space-y-1 mb-6">
                                                <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{section.title}</p>
                                                {section.items.map((item) => (
                                                    <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.href) ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'hover:bg-muted text-foreground'}`}>
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive(item.href) ? 'bg-white/20' : 'bg-primary/10'}`}>
                                                            <item.icon className={`w-4 h-4 ${isActive(item.href) ? 'text-white' : 'text-primary'}`} />
                                                        </div>
                                                        <span className="font-bold text-sm">{item.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}