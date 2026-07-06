import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { type Column, Table } from './Table.js';

const rows = [
  { id: '1', name: 'Alpha', calls: 10 },
  { id: '2', name: 'Beta', calls: 5 },
];

type Row = (typeof rows)[number];

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'calls', header: 'Calls', numeric: true, sortable: true },
];

describe('Table', () => {
  describe('semantic HTML', () => {
    it('renders a real table with column headers and rows', () => {
      render(<Table columns={columns} data={rows} rowKey={(r) => r.id} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(
        screen.getByRole('columnheader', { name: 'Name' }),
      ).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(rows.length + 1);
    });

    it('renders a caption when provided', () => {
      render(
        <Table
          columns={columns}
          data={rows}
          rowKey={(r) => r.id}
          caption="Usage"
        />,
      );

      expect(screen.getByText('Usage')).toBeInTheDocument();
    });
  });

  describe('ref behavior', () => {
    it('forwards a ref to the underlying table element', () => {
      const ref = createRef<HTMLTableElement>();
      render(
        <Table columns={columns} data={rows} rowKey={(r) => r.id} ref={ref} />,
      );

      expect(ref.current).toBe(screen.getByRole('table'));
    });
  });

  describe('sorting: accessibility + keyboard interaction', () => {
    it('marks sortable columns with aria-sort', () => {
      render(
        <Table
          columns={columns}
          data={rows}
          rowKey={(r) => r.id}
          sort={{ key: 'name', dir: 'asc' }}
        />,
      );

      expect(
        screen.getByRole('columnheader', { name: 'Name' }),
      ).toHaveAttribute('aria-sort', 'ascending');
      expect(
        screen.getByRole('columnheader', { name: 'Calls' }),
      ).toHaveAttribute('aria-sort', 'none');
    });

    it('toggles sort direction when the header button is clicked', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={rows}
          rowKey={(r) => r.id}
          sort={{ key: 'name', dir: 'asc' }}
          onSortChange={onSortChange}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Name' }));

      expect(onSortChange).toHaveBeenCalledWith({ key: 'name', dir: 'desc' });
    });

    it('is keyboard-activatable since sort controls are real buttons', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={rows}
          rowKey={(r) => r.id}
          onSortChange={onSortChange}
        />,
      );

      await user.tab();
      expect(screen.getByRole('button', { name: 'Name' })).toHaveFocus();

      await user.keyboard('{Enter}');

      expect(onSortChange).toHaveBeenCalledWith({ key: 'name', dir: 'asc' });
    });
  });

  describe('interactive rows', () => {
    it('marks rows with getRowProps.onClick as keyboard-activatable buttons', async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();
      render(
        <Table
          columns={columns}
          data={rows}
          rowKey={(r) => r.id}
          getRowProps={(row) => ({ onClick: () => onRowClick(row.id) })}
        />,
      );

      const row = screen.getByRole('button', { name: /Alpha/ });
      expect(row).toHaveAttribute('tabindex', '0');

      row.focus();
      await user.keyboard('{Enter}');

      expect(onRowClick).toHaveBeenCalledWith('1');
    });

    it('does not mark rows as interactive when getRowProps is not provided', () => {
      render(<Table columns={columns} data={rows} rowKey={(r) => r.id} />);

      const row = screen.getByText('Alpha').closest('tr');
      expect(row).not.toHaveAttribute('role');
    });
  });
});
