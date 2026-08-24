import React, { useMemo, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import DocsLayout from '../../Layouts/DocsLayout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import GithubSlugger from 'github-slugger';
import { ChevronRight, ChevronLeft, Home } from 'lucide-react';

interface Props {
  content: string;
  sidebar: any[];
  currentPath: string;
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  navigation?: {
    prev?: { label: string; href: string };
    next?: { label: string; href: string };
  };
}

export default function Show({ content, sidebar, currentPath, navigation, metaTitle, metaDescription }: Props) {
  // Create a clean slugger for each render pass to ensure ToC and Body match exactly
  const slugger = new GithubSlugger();
  const prev = navigation?.prev;
  const next = navigation?.next;

  const { title, toc, markdownBody } = useMemo(() => {
    const localSlugger = new GithubSlugger();
    const lines = content.split('\n');
    let pageTitle = '';
    const tocItems: any[] = [];
    let isFrontmatter = false;
    let hasPassedFrontmatter = false;
    const bodyLines: string[] = [];

    lines.forEach((line, index) => {
      // Basic Frontmatter skip (only at the start of the file)
      if (!hasPassedFrontmatter) {
        if (index === 0 && line.trim() === '---') {
          isFrontmatter = true;
          return;
        }
        if (isFrontmatter && line.trim() === '---') {
          isFrontmatter = false;
          hasPassedFrontmatter = true;
          return;
        }
        if (index === 0 && line.trim() !== '---') {
          hasPassedFrontmatter = true;
        }
      }

      if (isFrontmatter) {
        if (line.startsWith('title:')) pageTitle = line.replace('title:', '').trim();
        return;
      }

      // Title extraction
      if (!pageTitle && line.startsWith('# ')) {
        pageTitle = line.replace('# ', '').trim();
        return;
      }

      // ToC extraction (h2 and h3)
      const h2Match = line.match(/^## (.*)/);
      const h3Match = line.match(/^### (.*)/);
      
      if (h2Match) {
        const text = h2Match[1].replace(/\{#.*\}/, '').trim();
        tocItems.push({ id: localSlugger.slug(text), text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].replace(/\{#.*\}/, '').trim();
        tocItems.push({ id: localSlugger.slug(text), text, level: 3 });
      }

      bodyLines.push(line);
    });

    return {
      title: pageTitle,
      toc: tocItems,
      markdownBody: bodyLines.join('\n')
    };
  }, [content]);

  // Handle scrolling to elements, including hash changes
  useEffect(() => {
    const scrollToHash = () => {
      if (window.location.hash) {
        const id = decodeURIComponent(window.location.hash.substring(1));
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    // Initial scroll on load
    scrollToHash();

    // Listen for hash changes (clicking ToC links on the same page)
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [currentPath, markdownBody]);

  return (
    <DocsLayout sidebar={sidebar} currentPath={currentPath} toc={toc}>
      <Head>
        <title>{metaTitle ?? `${title} | توثيق شفيع`}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        <link rel="canonical" href={`https://shafeea.accsystemerp.com/docs${currentPath === 'README' ? '' : '/' + currentPath}`} />
      </Head>
      
      <article className="docs-article">
        {/* Breadcrumbs (Shell) */}
        <nav className="docs-breadcrumb-container" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Link href="/docs" className="breadcrumb-link" style={{ color: 'var(--doc-text-muted)', display: 'flex' }}>
            <Home size={16} />
          </Link>
          <ChevronLeft size={14} style={{ opacity: 0.5, color: 'var(--doc-text-muted)' }} />
          <div className="breadcrumb-item active" style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: '2px 12px', borderRadius: '12px', color: 'var(--doc-text-muted)' }}>
            {title}
          </div>
        </nav>

        {title && (
          <h1 className="docs-title">{title}</h1>
        )}
        
        <div className="docs-markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    h2: ({node, children, ...props}: any) => {
                        const text = React.Children.toArray(children).join('');
                        const id = slugger.slug(text);
                        return <h2 id={id} className="docs-h2" {...props}>{children}</h2>;
                    },
                    h3: ({node, children, ...props}: any) => {
                        const text = React.Children.toArray(children).join('');
                        const id = slugger.slug(text);
                        return <h3 id={id} className="docs-h3" {...props}>{children}</h3>;
                    },
                    table: ({node, ...props}: any) => (
                        <div className="docs-table-wrapper">
                            <table className="docs-table" {...props} />
                        </div>
                    ),
                    code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{ direction: 'ltr', borderRadius: '8px', margin: '1.5rem 0' }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    a: ({node, href, children, ...props}: any) => {
                        if (!href) return <a {...props}>{children}</a>;
                        
                        const isExternal = href.startsWith('http');
                        const isAnchor = href.startsWith('#');
                        
                        if (isExternal) {
                            return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
                        }
                        
                        if (isAnchor) {
                            return <a href={href} {...props}>{children}</a>;
                        }

                        // Internal link: strip extensions and normalize path
                        let cleanHref = href.replace(/\.mdx?$/, '');
                        
                        // Ensure internal doc links start with /docs/
                        if (!cleanHref.startsWith('/') && !cleanHref.startsWith('docs/')) {
                            cleanHref = `/docs/${cleanHref}`;
                        } else if (cleanHref.startsWith('docs/')) {
                            cleanHref = `/${cleanHref}`;
                        } else if (!cleanHref.startsWith('/docs/') && cleanHref.startsWith('/')) {
                            // If it starts with / but not /docs/, and it's meant to be a doc link
                            // We assume links in markdown that aren't external/anchors are doc links
                            cleanHref = `/docs${cleanHref}`;
                        }
                        
                        return (
                            <Link href={cleanHref} {...props}>
                                {children}
                            </Link>
                        );
                    },                } as any}
            >
                {markdownBody}
            </ReactMarkdown>
        </div>

        {/* Next/Prev Pagination */}
        <footer className="docs-footer-nav">
          {prev ? (
            <Link href={prev.href} className="footer-nav-link prev">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChevronRight size={20} />
                <span className="nav-label">السابق</span>
              </div>
              <span className="nav-title">{prev.label}</span>
            </Link>
          ) : <div />}
          
          {next ? (
            <Link href={next.href} className="footer-nav-link next">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <span className="nav-label">التالي</span>
                <ChevronLeft size={20} />
              </div>
              <span className="nav-title" style={{ textAlign: 'left' }}>{next.label}</span>
            </Link>
          ) : <div />}
        </footer>
      </article>
    </DocsLayout>
  );
}
