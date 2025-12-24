import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

/**
 * ResponsiveTable Component
 * 
 * A responsive table component that:
 * - Shows a standard table on desktop
 * - Converts to card view on mobile
 * - Supports custom cell renderers
 * - Includes action buttons
 */

export interface TableColumn<T extends Record<string, unknown> = Record<string, unknown>> {
    key: Extract<keyof T, string>;
    label: string;
    render?: (item: T, index: number) => React.ReactNode;
    className?: string;
    mobileLabel?: string; // Label to show in mobile card view
    hideOnMobile?: boolean;
}

export interface TableAction<T extends Record<string, unknown> = Record<string, unknown>> {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick?: (item: T) => void;
    href?: (item: T) => string;
    variant?: 'default' | 'ghost' | 'destructive';
    className?: string;
}

export interface ResponsiveTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
    data: T[];
    columns: TableColumn<T>[];
    actions?: TableAction<T>[];
    keyExtractor: (item: T, index: number) => string | number;
    emptyMessage?: string;
    className?: string;
    cardClassName?: string;
}

export function ResponsiveTable<T extends Record<string, unknown> = Record<string, unknown>>({
    data,
    columns,
    actions = [],
    keyExtractor,
    emptyMessage = 'لا توجد بيانات',
    className,
    cardClassName,
}: ResponsiveTableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className={cn("hidden md:block overflow-x-auto rounded-lg border border-border bg-card", className)}>
                <table className="w-full border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-muted/50">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={cn(
                                        "px-6 py-4 text-right text-sm font-semibold text-foreground border-b border-border",
                                        column.className
                                    )}
                                >
                                    {column.label}
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground border-b border-border">
                                    الإجراءات
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr
                                key={keyExtractor(item, index)}
                                className="hover:bg-muted/30 transition-colors border-b border-border last:border-b-0"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={cn(
                                            "px-6 py-4 text-sm text-foreground",
                                            column.className
                                        )}
                                    >
                                        {column.render
                                            ? column.render(item, index)
                                            : ((item as Record<string, unknown>)[column.key] as React.ReactNode)}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 justify-end">
                                            {actions.map((action, actionIndex) => {
                                                const content = (
                                                    <Button
                                                        key={actionIndex}
                                                        variant={action.variant || 'ghost'}
                                                        size="sm"
                                                        onClick={() => action.onClick?.(item)}
                                                        className={cn("h-8 w-8 p-0", action.className)}
                                                        title={action.label}
                                                    >
                                                        <action.icon className="w-4 h-4" />
                                                    </Button>
                                                );

                                                if (action.href) {
                                                    return (
                                                        <Link key={actionIndex} href={action.href(item)}>
                                                            {content}
                                                        </Link>
                                                    );
                                                }

                                                return content;
                                            })}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className={cn("md:hidden space-y-4", className)}>
                {data.map((item, index) => (
                    <Card
                        key={keyExtractor(item, index)}
                        className={cn(
                            "p-4 hover:shadow-lg transition-all duration-300",
                            cardClassName
                        )}
                    >
                        <div className="space-y-3">
                            {columns
                                .filter((col) => !col.hideOnMobile)
                                .map((column) => (
                                    <div
                                        key={column.key}
                                        className="flex flex-col gap-1"
                                    >
                                        <span className="text-xs font-semibold text-muted-foreground">
                                            {column.mobileLabel || column.label}
                                        </span>
                                        <div className="text-sm font-medium text-foreground">
                                            {column.render
                                                ? column.render(item, index)
                                                : ((item as Record<string, unknown>)[column.key] as React.ReactNode)}
                                        </div>
                                    </div>
                                ))}
                            {actions.length > 0 && (
                                <div className="flex items-center gap-2 pt-2 border-t border-border">
                                    {actions.map((action, actionIndex) => {
                                        const content = (
                                            <Button
                                                key={actionIndex}
                                                variant={action.variant || 'ghost'}
                                                size="sm"
                                                onClick={() => action.onClick?.(item)}
                                                className={cn("flex-1", action.className)}
                                            >
                                                <action.icon className="w-4 h-4 ml-2" />
                                                {action.label}
                                            </Button>
                                        );

                                        if (action.href) {
                                            return (
                                                <Link key={actionIndex} href={action.href(item)} className="flex-1">
                                                    {content}
                                                </Link>
                                            );
                                        }

                                        return content;
                                    })}
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
}

