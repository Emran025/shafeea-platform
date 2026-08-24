import { Clock, Facebook, Instagram, Linkedin, Mail, Phone, Twitter } from 'lucide-react';

export function TopBar() {
    return (
        <div className="gradient-primary animate-fade-in px-3 py-1.5 text-white md:px-4 md:py-2">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 md:flex-row md:gap-0">
                <div className="flex w-full items-center justify-center gap-3 text-[10px] font-medium sm:text-xs md:w-auto md:gap-6 md:text-sm">
                    <a href="tel:+966501234567" className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
                        <Phone className="h-3 w-3 md:h-4 md:w-4" />
                        <span dir="ltr">+966 50 123 4567</span>
                    </a>
                    <span className="hidden h-3 w-px bg-white/20 sm:inline"></span>
                    <a href="mailto:info@shafeea.systems360.cloud" className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
                        <Mail className="h-3 w-3 md:h-4 md:w-4" />
                        <span>info@shafeea.systems360.cloud</span>
                    </a>
                </div>
                <div className="flex w-full items-center justify-center gap-4 md:w-auto">
                    <div className="hidden items-center gap-2 text-xs sm:flex md:text-sm">
                        <Clock className="h-3.5 w-3.5 text-emerald-300 md:h-4 md:w-4" />
                        <span>دعم 24/7</span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-3">
                        <Facebook className="h-3.5 w-3.5 cursor-pointer transition-transform hover:scale-110 hover:text-blue-200 md:h-4 md:w-4" />
                        <Twitter className="h-3.5 w-3.5 cursor-pointer transition-transform hover:scale-110 hover:text-sky-200 md:h-4 md:w-4" />
                        <Instagram className="h-3.5 w-3.5 cursor-pointer transition-transform hover:scale-110 hover:text-pink-200 md:h-4 md:w-4" />
                        <Linkedin className="h-3.5 w-3.5 cursor-pointer transition-transform hover:scale-110 hover:text-blue-300 md:h-4 md:w-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
