import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input.js';

const meta = {
  title: 'Input',
  component: Input,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    placeholder: 'my-workspace',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { invalid: true, placeholder: 'https://api.example.com' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithSuffix: Story = {
  args: { suffix: 'USD', tabular: true, placeholder: '0.00' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
      <Input {...args} size="sm" placeholder="Small" />
      <Input {...args} size="md" placeholder="Medium" />
      <Input {...args} size="lg" placeholder="Large" />
    </div>
  ),
};
