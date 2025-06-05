import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
    startIcon: {
      control: 'boolean',
    },
    endIcon: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithStartIcon: Story = {
  args: {
    placeholder: 'Search...',
    startIcon: '🔍',
  },
};

export const WithEndIcon: Story = {
  args: {
    placeholder: 'Enter email...',
    endIcon: '✉️',
    type: 'email',
  },
};

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Search...',
    startIcon: '🔍',
    endIcon: '⌫',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
    endIcon: '👁️',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    value: 'Disabled value',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Enter email...',
    type: 'email',
    'aria-invalid': true,
  },
}; 