import * as React from 'react';

import { cn } from '../cn.js';

export interface Column<T> {
  key: keyof T & string;
  header: React.ReactNode;
  primary?: boolean;
  numeric?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
}

export interface TableSort<T> {
  key: keyof T & string;
  dir: 'asc' | 'desc';
}

export interface TableProps<T extends Record<string, unknown>> extends Omit<
  React.HTMLAttributes<HTMLTableElement>,
  'children'
> {
  columns?: Column<T>[];
  data?: T[];
  density?: 'compact' | 'comfortable' | 'spacious';
  hover?: boolean;
  stickyHeader?: boolean;
  caption?: React.ReactNode;
  sort?: TableSort<T>;
  onSortChange?: (sort: TableSort<T>) => void;
  rowKey?: (row: T, index: number) => React.Key;
  getRowProps?: (
    row: T,
    index: number,
  ) => React.HTMLAttributes<HTMLTableRowElement>;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLTableElement>;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  density = 'comfortable',
  hover = true,
  stickyHeader = false,
  caption,
  sort,
  onSortChange,
  rowKey,
  getRowProps,
  className,
  children,
  ref,
  ...rest
}: TableProps<T>) {
  const handleSort = (col: Column<T>) => {
    if (!onSortChange) return;
    const dir: 'asc' | 'desc' =
      sort && sort.key === col.key && sort.dir === 'asc' ? 'desc' : 'asc';
    onSortChange({ key: col.key, dir });
  };

  return (
    <div className="es-table-wrap">
      <table
        ref={ref}
        className={cn('es-table', hover && 'es-table--hover', className)}
        data-density={density}
        data-sticky={stickyHeader ? 'true' : 'false'}
        {...rest}
      >
        {caption && <caption className="es-table__caption">{caption}</caption>}
        {columns && (
          <thead>
            <tr>
              {columns.map((c) => {
                const ariaSort = !c.sortable
                  ? undefined
                  : sort && sort.key === c.key
                    ? sort.dir === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none';
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={cn(
                      c.numeric && 'es-th--num',
                      !c.numeric && c.align === 'center' && 'es-th--center',
                    )}
                    style={c.width != null ? { width: c.width } : undefined}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        className="es-th__sort"
                        onClick={() => handleSort(c)}
                      >
                        {c.header}
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
        )}
        {data && columns && (
          <tbody>
            {data.map((row, i) => {
              const key = rowKey ? rowKey(row, i) : i;
              const rp = getRowProps ? getRowProps(row, i) : {};
              const isRowInteractive = typeof rp.onClick === 'function';
              const handleRowKeyDown: React.KeyboardEventHandler<
                HTMLTableRowElement
              > = (event) => {
                rp.onKeyDown?.(event);
                if (!isRowInteractive) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  rp.onClick?.(
                    event as unknown as React.MouseEvent<HTMLTableRowElement>,
                  );
                }
              };
              return (
                <tr
                  key={key}
                  role={isRowInteractive ? 'button' : undefined}
                  tabIndex={isRowInteractive ? 0 : undefined}
                  {...rp}
                  onKeyDown={handleRowKeyDown}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        c.numeric
                          ? 'es-td--num'
                          : c.align === 'center' && 'es-td--center',
                        c.primary && 'es-table__primary',
                      )}
                    >
                      {c.render
                        ? c.render(row[c.key], row, i)
                        : String(row[c.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        )}
        {children}
      </table>
    </div>
  );
}
