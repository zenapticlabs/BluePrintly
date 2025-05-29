import type { Meta, StoryObj } from '@storybook/react';
import SuiteComponent from '../components/molecule/suiteComponent';
import { FileText, Book, Newspaper } from 'lucide-react';

const meta: Meta<typeof SuiteComponent> = {
  title: 'Molecule/SuiteComponent',
  component: SuiteComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SuiteComponent>;

export const Basic: Story = {
  args: {
    icon: FileText,
    title: 'Basic Suite',
    amount: '5',
    description: 'Perfect for small businesses and startups',
  },
};

export const Professional: Story = {
  args: {
    icon: Book,
    title: 'Professional Suite',
    amount: '10',
    description: 'Ideal for growing companies and medium enterprises',
  },
};

export const Enterprise: Story = {
  args: {
    icon: Newspaper,
    title: 'Enterprise Suite',
    amount: '20',
    description: 'Complete solution for large organizations',
  },
}; 