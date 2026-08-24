<?php

namespace App\Http\Controllers\Public;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Illuminate\Support\Str;

class DocsController extends Controller
{
    // Segments of the docs tree that must never be publicly accessible
    private const PRIVATE_SEGMENTS = ['11_seo_audit'];

    public function show(Request $request, $path = 'README')
    {
        try {
            $docsPath = resource_path('docs');

            if (!File::exists($docsPath)) {
                abort(404, 'Docs folder missing');
            }

            if (!$path || $path === '/' || $path === 'index') {
                $path = 'README';
            }

            // Strip .md or .mdx extension if present in the URL
            $path = preg_replace('/\.mdx?$/', '', $path);

            // Block access to private documentation segments
            foreach (self::PRIVATE_SEGMENTS as $segment) {
                if ($path === $segment || Str::startsWith($path, $segment . '/') || Str::startsWith($path, $segment . '\\')) {
                    abort(403, 'This section is not publicly available.');
                }
            }

            // Normalize path for Linux/Windows
            $cleanPath = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $path);
            $fullPath = $docsPath . DIRECTORY_SEPARATOR . $cleanPath;

            $file = null;

            // Priority: Exact file -> .mdx -> .md -> folder/README -> folder/index
            if (File::exists($fullPath) && !File::isDirectory($fullPath)) {
                $file = $fullPath;
            } else {
                $checkPaths = [
                    $fullPath . '.mdx',
                    $fullPath . '.md',
                    $fullPath . DIRECTORY_SEPARATOR . 'README.md',
                    $fullPath . DIRECTORY_SEPARATOR . 'index.md',
                    $fullPath . DIRECTORY_SEPARATOR . 'README.mdx',
                ];

                foreach ($checkPaths as $p) {
                    if (File::exists($p) && !File::isDirectory($p)) {
                        $file = $p;
                        break;
                    }
                }
            }

            if (!$file) {
                // Final fallback to root README
                $file = $docsPath . DIRECTORY_SEPARATOR . 'README.md';
                $path = 'README';
            }

            $content = File::get($file);
            $sidebar = $this->getSidebar($docsPath);

            // Add Introduction (Home) to the top of sidebar if not present
            $hasIntro = false;
            foreach ($sidebar as $item) {
                if (($item['path'] ?? '') === 'README') {
                    $hasIntro = true;
                    break;
                }
            }

            if (!$hasIntro && (File::exists($docsPath . DIRECTORY_SEPARATOR . 'README.md') || File::exists($docsPath . DIRECTORY_SEPARATOR . 'README.mdx'))) {
                array_unshift($sidebar, [
                    'type' => 'link',
                    'label' => 'مدخل',
                    'href' => '/docs/README',
                    'path' => 'README',
                    'position' => -1
                ]);
            }

            $title = $this->extractTitle($content) ?? $this->formatLabel(basename($file));
            $metaDescription = $this->extractMetaDescription($content);

            $flatSidebar = $this->flattenSidebar($sidebar);
            $currentIndex = -1;
            $normalizedPath = str_replace(['\\', DIRECTORY_SEPARATOR], '/', $path);

            foreach ($flatSidebar as $index => $item) {
                if ($item['path'] === $normalizedPath || $item['path'] === $path) {
                    $currentIndex = $index;
                    break;
                }
            }

            $prev = $currentIndex > 0 ? $flatSidebar[$currentIndex - 1] : null;
            $next = ($currentIndex !== -1 && $currentIndex < count($flatSidebar) - 1) ? $flatSidebar[$currentIndex + 1] : null;

            return Inertia::render('Docs/Show', [
                'content'         => $content,
                'title'           => $title,
                'metaTitle'       => $title . ' | توثيق قيد',
                'metaDescription' => $metaDescription,
                'sidebar'         => $sidebar,
                'currentPath'     => $normalizedPath,
                'navigation'      => [
                    'prev' => $prev,
                    'next' => $next,
                ],
            ]);
        } catch (\Throwable $e) {
            return response("Docs Error: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine(), 200)
                ->header('Content-Type', 'text/plain');
        }
    }

    private function getSidebar($dir, $baseDir = null)
    {
        if (!$baseDir) $baseDir = $dir;
        $items = [];
        if (!File::isDirectory($dir)) return [];

        $files = File::files($dir);
        $directories = File::directories($dir);

        foreach ($files as $file) {
            $name = $file->getFilename();
            if (in_array($name, ['_category_.json', 'README.md', 'index.md', 'README.mdx', 'index.mdx'])) continue;

            $content = File::get($file->getPathname());
            $position = $this->extractPosition($content, $name);
            $label = $this->extractTitle($content) ?? $this->formatLabel($name);

            $relativePath = str_replace($baseDir . DIRECTORY_SEPARATOR, '', $file->getPathname());
            $relativePath = str_replace(['.mdx', '.md'], '', $relativePath);
            $relativePath = str_replace(DIRECTORY_SEPARATOR, '/', $relativePath);

            $items[] = [
                'type' => 'link',
                'label' => $label,
                'href' => '/docs/' . $relativePath,
                'path' => $relativePath,
                'position' => $position
            ];
        }

        foreach ($directories as $directory) {
            $name = basename($directory);

            // Skip private segments entirely from sidebar
            foreach (self::PRIVATE_SEGMENTS as $segment) {
                if ($name === $segment) continue 2;
            }

            $categoryFile = $directory . DIRECTORY_SEPARATOR . '_category_.json';
            $label = $this->formatLabel($name);
            $position = $this->extractPosition('', $name);

            $indexFile = null;
            $indexExtensions = ['README.md', 'index.md', 'README.mdx', 'index.mdx'];
            foreach ($indexExtensions as $ext) {
                if (File::exists($directory . DIRECTORY_SEPARATOR . $ext)) {
                    $idxContent = File::get($directory . DIRECTORY_SEPARATOR . $ext);
                    $label = $this->extractTitle($idxContent) ?? $label;

                    $relativePath = str_replace($baseDir . DIRECTORY_SEPARATOR, '', $directory . DIRECTORY_SEPARATOR . $ext);
                    $relativePath = str_replace(['.mdx', '.md'], '', $relativePath);
                    $indexFile = str_replace(DIRECTORY_SEPARATOR, '/', $relativePath);
                    break;
                }
            }

            if (File::exists($categoryFile)) {
                $category = json_decode(File::get($categoryFile), true);
                $label = $category['label'] ?? $label;
                $position = $category['position'] ?? $position;
            }

            $items[] = [
                'type' => 'category',
                'label' => $label,
                'href' => $indexFile ? '/docs/' . $indexFile : null,
                'path' => $indexFile,
                'items' => $this->getSidebar($directory, $baseDir),
                'position' => $position
            ];
        }

        usort($items, function ($a, $b) {
            if (($a['position'] ?? 999) !== ($b['position'] ?? 999)) {
                return ($a['position'] ?? 999) <=> ($b['position'] ?? 999);
            }
            return strnatcmp($a['label'] ?? '', $b['label'] ?? '');
        });

        return $items;
    }

    private function extractTitle($content)
    {
        if (preg_match('/^title:\s*(.+)$/m', $content, $matches)) {
            return trim($matches[1], "\"' ");
        }
        if (preg_match('/^#\s+(.+)$/m', $content, $matches)) {
            return trim($matches[1]);
        }
        return null;
    }

    private function extractPosition($content, $filename)
    {
        if (preg_match('/^(\d+)_/', $filename, $matches)) {
            return (int)$matches[1];
        }
        if (preg_match('/^sidebar_position:\s*(-?\d+)$/m', $content, $matches)) {
            return (int)$matches[1];
        }
        return 999;
    }

    private function flattenSidebar($items)
    {
        $flat = [];
        foreach ($items as $item) {
            if ($item['type'] === 'link') {
                $flat[] = $item;
            } else {
                if (isset($item['href']) && $item['href']) {
                    // Category itself is a link
                    $flat[] = $item;
                }
                $flat = array_merge($flat, $this->flattenSidebar($item['items'] ?? []));
            }
        }
        return $flat;
    }

    private function formatLabel($name)
    {
        $name = str_replace(['.md', '.mdx'], '', $name);
        $name = preg_replace('/^\d+_/', '', $name);
        $name = str_replace(['_', '-'], ' ', $name);
        return Str::title($name);
    }

    /**
     * Extract the first meaningful prose paragraph as a meta description.
     * Strips Markdown headings, code blocks, and frontmatter.
     */
    private function extractMetaDescription(string $content): string
    {
        $lines     = explode("\n", $content);
        $inCode    = false;
        $inFront   = false;
        $firstLine = true;

        foreach ($lines as $line) {
            $trimmed = trim($line);

            // Skip frontmatter block
            if ($firstLine && $trimmed === '---') {
                $inFront = true;
                $firstLine = false;
                continue;
            }
            if ($inFront) {
                if ($trimmed === '---') $inFront = false;
                continue;
            }
            $firstLine = false;

            // Skip code blocks
            if (str_starts_with($trimmed, '```') || str_starts_with($trimmed, '~~~')) {
                $inCode = !$inCode;
                continue;
            }
            if ($inCode) continue;

            // Skip headings, tables, HTML, empty lines, and list markers
            if (empty($trimmed)) continue;
            if (str_starts_with($trimmed, '#'))  continue;
            if (str_starts_with($trimmed, '|'))  continue;
            if (str_starts_with($trimmed, '<'))  continue;
            if (str_starts_with($trimmed, '- ')) continue;
            if (str_starts_with($trimmed, '* ')) continue;
            if (preg_match('/^\d+\.\s/', $trimmed)) continue;

            // Clean inline markdown and return first paragraph
            $plain = preg_replace('/[*_`\[\]()#>]/', '', $trimmed);
            $plain = trim(preg_replace('/\s+/', ' ', $plain));

            if (strlen($plain) > 30) {
                return Str::limit($plain, 155, '');
            }
        }

        return 'توثيق أكاديمية شفيع — تطبيق محاسبة شخصية بالقيد المزدوج الكامل مع تشفير E2EE.';
    }
}
