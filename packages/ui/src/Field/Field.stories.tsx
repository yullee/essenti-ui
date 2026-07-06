import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '../Input/Input.js';
import { Field } from './Field.js';

const meta = {
  title: 'Field',
  component: Field,
  args: {
    label: 'Workspace name',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Field {...args}>
        <Input placeholder="my-workspace" />
      </Field>
    </div>
  ),
};

export const Required: Story = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Field {...args} required description="Used in your URL.">
        <Input placeholder="my-workspace" />
      </Field>
    </div>
  ),
};

export const Optional: Story = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Field {...args} optional label="Monthly budget">
        <Input suffix="USD" tabular placeholder="0.00" />
      </Field>
    </div>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Field {...args} label="API endpoint" error="Enter a valid HTTPS URL.">
        <Input placeholder="https://api.example.com" />
      </Field>
    </div>
  ),
};
