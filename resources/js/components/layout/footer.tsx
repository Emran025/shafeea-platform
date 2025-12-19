import { Link } from '@inertiajs/react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Shield, Award } from 'lucide-react';
import { navigationItems } from '@/config/site-nav';

export function Footer() {
    return (
        <footer className="bg-[#0f172a] text-white relative overflow-hidden border-t border-gray-800">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-gray-900" />
            </div>

            <div className="relative z-10">
                <div className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
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

                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-200 border-b border-gray-800 pb-2 inline-block">روابط هامة</h4>
                                <ul className="space-y-3">
                                    {navigationItems.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} className="text-gray-400 hover:text-white transition-all text-sm group flex items-center gap-2">
                                                <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-blue-400 transition-colors" />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-200 border-b border-gray-800 pb-2 inline-block">تواصل معنا</h4>
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
                                <div className="mt-8 flex items-center gap-2">
                                    {[ 
                                        { Icon: Facebook, color: '#1877F2' }, { Icon: Twitter, color: '#1DA1F2' }, 
                                        { Icon: Instagram, color: '#E4405F' }, { Icon: Linkedin, color: '#0A66C2' }, { Icon: Youtube, color: '#FF0000' }
                                    ].map((social, i) => (
                                        <a key={i} href="#" className={`w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all`} style={{ transition: '0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = social.color} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}>
                                            <social.Icon className="w-4 h-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 bg-gray-950/50 py-5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-gray-500 text-xs">© {new Date().getFullYear()} منصة شفيع. جميع الحقوق محفوظة.</div>
                        <div className="flex items-center gap-6 text-xs text-gray-500">
                            <Link href="/terms" className="hover:text-sky-400 transition-colors">شروط الاستخدام</Link>
                            <Link href="/privacy" className="hover:text-sky-400 transition-colors">سياسة الخصوصية</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}