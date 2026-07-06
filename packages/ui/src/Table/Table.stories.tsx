import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Table, type TableSort } from './Table.js';

const rows = [
  {
    id: '1',
    key: 'pk_live_abc123',
    created: '2026-01-14',
    status: 'Active',
    calls: 18_420,
  },
  {
    id: '2',
    key: 'pk_live_xyz789',
    created: '2026-02-28',
    status: 'Active',
    calls: 4_305,
  },
  {
    id: '3',
    key: 'pk_test_def456',
    created: '2026-03-10',
    status: 'Revoked',
    calls: 0,
  },
];

type Row = (typeof rows)[number];

const columns = [
  { key: 'key' as const, header: 'API key', primary: true, sortable: true },
  { key: 'created' as const, header: 'Created', sortable: true },
  { key: 'status' as const, header: 'Status', sortable: true },
  {
    key: 'calls' as const,
    header: 'Calls (30 d)',
    numeric: true,
    sortable: true,
    render: (v: unknown) => Number(v).toLocaleString(),
  },
];

// Table is generic, which Storybook's Meta<typeof Table> can't express — so
// stories below build the element directly instead of spreading `args` (that
// would collapse T back to Record<string, unknown> and break rowKey/getRowProps
// typing). `density` is the only arg actually wired to a control.
const meta = {
  title: 'Table',
  argTypes: {
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
    },
  },
  args: {
    density: 'comfortable',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: (args) => (
    <Table
      caption="API keys for this workspace"
      aria-label="API keys"
      columns={columns}
      data={rows}
      rowKey={(r: Row) => r.id}
      density={args.density}
    />
  ),
};

type Density = 'compact' | 'comfortable' | 'spacious';

function SortableTable({ density }: { density?: Density }) {
  const [sort, setSort] = useState<TableSort<Row>>({
    key: 'calls',
    dir: 'desc',
  });
  const sorted = [...rows].sort((a, b) => {
    const av = a[sort.key];
    const bv = b[sort.key];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sort.dir === 'asc' ? cmp : -cmp;
  });
  return (
    <Table
      columns={columns}
      data={sorted}
      rowKey={(r: Row) => r.id}
      sort={sort}
      onSortChange={setSort}
      density={density}
    />
  );
}

export const Sortable: Story = {
  render: (args) => <SortableTable density={args.density} />,
};

export const Density: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {(['compact', 'comfortable', 'spacious'] as const).map((density) => (
        <div key={density}>
          <p style={{ marginBottom: 8, fontSize: 13, color: '#666' }}>
            {density}
          </p>
          <Table
            columns={columns.slice(0, 2)}
            data={rows.slice(0, 2)}
            rowKey={(r: Row) => r.id}
            density={density}
          />
        </div>
      ))}
    </div>
  ),
};

function InteractiveRowsTable({ density }: { density?: Density }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <Table
      columns={columns}
      data={rows}
      rowKey={(r: Row) => r.id}
      density={density}
      getRowProps={(r: Row) => ({
        onClick: () => setSelectedId(r.id),
        style:
          selectedId === r.id
            ? { background: 'var(--essenti-surface-active)' }
            : undefined,
      })}
    />
  );
}

export const InteractiveRows: Story = {
  render: (args) => <InteractiveRowsTable density={args.density} />,
};
