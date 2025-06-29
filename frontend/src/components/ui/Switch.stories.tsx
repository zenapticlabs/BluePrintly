import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'The default checked state of the switch',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'w-12 h-6',
  },
}; 