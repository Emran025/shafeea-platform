import { ArrowUp } from 'lucide-react';

export function ScrollToTop({ visible }: { visible: boolean }) {
    if (!visible) return null;
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 left-8 w-10 h-10 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 animate-bounce-slow border border-white/10"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}