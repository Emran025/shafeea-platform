import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '@inertiajs/react';
const Logo = () => <div className="font-bold text-xl">أكاديمية شفيع</div>;
import { ShieldCheck, Moon, Sun, ChevronLeft, ArrowLeft } from 'lucide-react';

interface SidebarItem {
  type: 'link' | 'category';
  label: string;
  href?: string;
  path?: string;
  items?: SidebarItem[];
}

interface ToCItem {
  id: string;
  text: string;
  level: number;
}

interface DocsLayoutProps {
  sidebar?: SidebarItem[] | null;
  currentPath: string;
  children: React.ReactNode;
  toc?: ToCItem[];
}

const SidebarLink: React.FC<{ item: SidebarItem; active: boolean }> = ({ item, active }) => (
  <Link
    href={item.href || '#'}
    className={`docs-sidebar-link ${active ? 'active' : ''}`}
  >
    {item.label}
  </Link>
);

const SidebarCategory: React.FC<{ item: SidebarItem; currentPath: string }> = ({ item, currentPath }) => {
  const hasActiveChild = useMemo(() => {
    const checkActive = (items: SidebarItem[]): boolean => {
      return items.some(i => i.path === currentPath || (i.items && checkActive(i.items)));
    };
    return item.items ? checkActive(item.items) : false;
  }, [item.items, currentPath]);

  const active = item.path === currentPath;
  const [isOpen, setIsOpen] = useState(active || hasActiveChild);

  useEffect(() => {
    if (active || hasActiveChild) {
      setIsOpen(true);
    }
  }, [active, hasActiveChild]);

  return (
    <div className="docs-sidebar-category">
      <div className={`docs-sidebar-category-header ${active ? 'active' : ''}`}>
        {item.href ? (
          <Link href={item.href} className="docs-sidebar-category-label">
            {item.label}
          </Link>
        ) : (
          <span className="docs-sidebar-category-label" onClick={() => setIsOpen(!isOpen)}>{item.label}</span>
        )}
        <button
          className="docs-sidebar-category-arrow"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
        >
          <svg
            className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="docs-sidebar-category-items">
          {item.items?.map((subItem, idx) => (
            <SidebarNavItem key={idx} item={subItem} currentPath={currentPath} />
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarNavItem: React.FC<{ item: SidebarItem; currentPath: string }> = ({ item, currentPath }) => {
  if (item.type === 'category') {
    return <SidebarCategory item={item} currentPath={currentPath} />;
  }
  return <SidebarLink item={item} active={currentPath === item.path} />;
};

const NAV_LINKS = [
  { href: '/',         label: 'الرئيسية' },
  { href: '/pillars',  label: 'الأعمدة' },
  { href: '/services', label: 'الخدمات' },
  { href: '/about',    label: 'من نحن'  },
  { href: '/pricing',  label: 'الأسعار' },
  { href: '/contact',  label: 'تواصل معنا' },
];

export const DocsLayout: React.FC<DocsLayoutProps> = ({
  sidebar = null,
  currentPath,
  children,
  toc = [],
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('doc-theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('doc-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="docs-root">
      {isMobileMenuOpen && (
        <div
          className="docs-mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Header ───────────────────────────────────────────── */}
      <header className={`docs-header${scrolled ? ' scrolled' : ''}`}>
        <div className="docs-header-content">

          {/* Brand */}
          <div className="docs-header-brand">
            <button
              className="docs-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="فتح القائمة"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <Link href="/docs" className="docs-header-logo">
              <Logo />
              <span className="docs-header-section">وثائق</span>
            </Link>
            <span className="docs-header-by">by ACCSYSTEM</span>
          </div>

          {/* Center nav — main site links */}
          <nav className="docs-header-nav" aria-label="التنقل الرئيسي">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="docs-header-nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="docs-header-actions">
            <button
              className="docs-theme-btn"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'تفعيل الوضع الداكن' : 'تفعيل الوضع الفاتح'}
              title={theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            <a href="/" className="docs-header-cta">
              الموقع الرئيسي
              <ChevronLeft size={15} />
            </a>
          </div>

        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="docs-container">
        {sidebar && (
          <aside className={`docs-sidebar docs-sidebar-right${isMobileMenuOpen ? ' open' : ''}`}>
            <div className="docs-sidebar-inner">
              {sidebar.map((item, idx) => (
                <SidebarNavItem key={idx} item={item} currentPath={currentPath} />
              ))}
            </div>
          </aside>
        )}

        <main className="docs-main">
          <div className="docs-content">
            {children}
          </div>
        </main>

        <aside className="docs-sidebar docs-sidebar-left">
          <div className="docs-toc">
            <h4 className="docs-toc-title">في هذه الصفحة</h4>
            <ul className="docs-toc-list">
              {toc.map((item) => (
                <li key={item.id} className={`docs-toc-item level-${item.level}`}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(item.id);
                      if (element) {
                        const headerOffset = 100;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        window.history.pushState(null, '', `#${item.id}`);
                      }
                    }}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="docs-footer">
        <div className="docs-footer-inner">
          <div className="docs-footer-brand">
            <Link href="/" className="docs-footer-logo">
              <Logo />
            </Link>
            <p className="docs-footer-tagline">محرك محاسبي سيادي مشفر من طرف إلى طرف.</p>
            <div className="docs-footer-enc-badge">
              <ShieldCheck size={13} />
              مشفر بـ AES-256-GCM
            </div>
          </div>

          <nav className="docs-footer-links" aria-label="روابط الوثائق">
            <span className="docs-footer-col-title">الوثائق</span>
            <a href="/docs" className="docs-footer-link">الدليل الرئيسي</a>
            <a href="/docs/introduction" className="docs-footer-link">المقدمة</a>
            <a href="/docs/concepts" className="docs-footer-link">المفاهيم الأساسية</a>
          </nav>

          <nav className="docs-footer-links" aria-label="روابط المنتج">
            <span className="docs-footer-col-title">المنتج</span>
            <Link href="/pillars"  className="docs-footer-link">المزايا الأساسية</Link>
            <Link href="/services" className="docs-footer-link">آلية العمل</Link>
            <Link href="/pricing"  className="docs-footer-link">الأسعار</Link>
            <a    href="/docs"     className="docs-footer-link">التوثيق التقني</a>
            <Link href="/contact"  className="docs-footer-link">تواصل معنا</Link>
          </nav>

          <nav className="docs-footer-links" aria-label="روابط قانونية">
            <span className="docs-footer-col-title">قانوني</span>
            <Link href="/privacy-policy" className="docs-footer-link">سياسة الخصوصية</Link>
            <Link href="/terms-of-use"   className="docs-footer-link">شروط الاستخدام</Link>
            <Link href="/faq"            className="docs-footer-link">الأسئلة الشائعة</Link>
          </nav>
        </div>

        <div className="docs-footer-bottom">
          <span>شفيع (shafeea) — بواسطة ACCSYSTEM</span>
          <span className="docs-footer-sep">·</span>
          <span>جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

export default DocsLayout;
