import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
    rows: 4,
  },
};

export const WithValue: Story = {
  args: {
    value: 'This is a pre-filled textarea with some content that demonstrates how it looks with text inside.',
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'This textarea is disabled',
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'This textarea shows an error state',
    'aria-invalid': true,
    rows: 4,
  },
};

export const Large: Story = {
  args: {
    placeholder: 'This is a larger textarea...',
    rows: 8,
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small textarea...',
    rows: 2,
  },
}; 