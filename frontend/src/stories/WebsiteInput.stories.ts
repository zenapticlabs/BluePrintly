import type { Meta, StoryObj } from '@storybook/react';
import { WebsiteInput } from '../components/molecule/websiteInput';

const meta = {
  title: 'Molecule/WebsiteInput',
  component: WebsiteInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'onChange' }
  }
} satisfies Meta<typeof WebsiteInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Website URL',
    value: '',
    placeholder: 'Enter your website URL',
    onChange: (value: string) => console.log('Value changed:', value)
  },
};

export const WithValue: Story = {
  args: {
    title: 'Company Website',
    value: 'example.com',
    placeholder: 'Enter company website',
    onChange: (value: string) => console.log('Value changed:', value)
  },
};

export const WithError: Story = {
  args: {
    title: 'Website URL',
    value: 'invalid-url',
    placeholder: 'Enter website URL',
    error: 'Please enter a valid website URL',
    onChange: (value: string) => console.log('Value changed:', value)
  },
}; 