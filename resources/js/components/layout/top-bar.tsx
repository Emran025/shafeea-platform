import { Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function TopBar() {
    return (
        <div className="gradient-primary text-white py-1.5 px-3 md:py-2 md:px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-0">
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
                <div className="flex items-center justify-center gap-4 w-full md:w-auto">
                    <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm">
                        <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-300" />
                        <span>دعم 24/7</span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-3">
                        <Facebook className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-blue-200 transition-transform hover:scale-110 cursor-pointer" />
                        <Twitter className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-sky-200 transition-transform hover:scale-110 cursor-pointer" />
                        <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-pink-200 transition-transform hover:scale-110 cursor-pointer" />
                        <Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4 hover:text-blue-300 transition-transform hover:scale-110 cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
}