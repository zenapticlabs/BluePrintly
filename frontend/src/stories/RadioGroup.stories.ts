import type { Meta, StoryObj } from '@storybook/react';
import RadioGroup from '../components/molecule/radioGroup';

const meta = {
  title: 'Molecule/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'onChange' }
  }
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Select Option',
    name: 'default-group',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    defaultValue: 'option1',
    onChange: (value: string) => console.log('Selected:', value)
  },
};

export const TwoColumns: Story = {
  args: {
    title: 'Layout Options',
    name: 'layout-options',
    cols: 2,
    options: [
      { value: 'grid', label: 'Grid Layout' },
      { value: 'list', label: 'List Layout' },
      { value: 'masonry', label: 'Masonry Layout' },
      { value: 'carousel', label: 'Carousel Layout' },
    ],
    defaultValue: 'grid',
    onChange: (value: string) => console.log('Selected:', value)
  },
};

export const NoDefaultValue: Story = {
  args: {
    title: 'Choose Theme',
    name: 'theme-selector',
    options: [
      { value: 'light', label: 'Light Theme' },
      { value: 'dark', label: 'Dark Theme' },
      { value: 'system', label: 'System Default' },
    ],
    onChange: (value: string) => console.log('Selected:', value)
  },
}; 