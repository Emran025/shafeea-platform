import { Link } from 'react-router-dom';
import type { Navigation } from '../../types/engine';

/**
 * PageFooter — chrome/PageFooter
 * Site footer chrome. Canonical location is chrome/.
 * The legacy renderer/PageFooter.tsx re-exports from here.
 */

interface Props { navigation: Navigation; }

export default function PageFooter({ navigation }: Props) {
    const items = navigation?.primary ?? [];
    const year  = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__inner">
                <div className="footer__top">
                    <div className="footer__brand">
                        {/* School Brand */}<div className="footer__brand-name">{window.__SCHOOL_DATA__?.name || "منصة شفيع"}</div>
                        <p className="footer__brand-tagline">
                            Corporate technology entity operating a system of platforms.
                        </p>
                    </div>

                    {items.length > 0 && (
                        <div>
                            <h4 className="footer__col-heading">Navigation</h4>
                            <div className="footer__nav">
                                {items.map(item => {
                                    const dest = item.columns[0]?.entries[0]?.destination_value ?? '';
                                    return (
                                        <Link key={item.group_id} to={dest ? '/' + dest : '/'} className="footer__link">
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="footer__end-col">
                        <h4 className="footer__col-heading">Platforms</h4>
                        <div className="footer__nav">
                            {(['accore', 'accommerce', 'qayd'] as const).map(p => (
                                <span key={p} className="footer__platform-name">{p}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copy">&copy; {year} {window.__SCHOOL_DATA__?.name || "منصة شفيع"}. جميع الحقوق محفوظة.</p>
                    <div className="footer__legal">
                        {[
                            { label: 'Privacy Policy', slug: 'legal/privacy' },
                            { label: 'Terms',          slug: 'legal/terms'   },
                        ].map(l => (
                            <Link key={l.slug} to={'/' + l.slug} className="footer__legal-link">
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
