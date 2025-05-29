import type { Meta, StoryObj } from '@storybook/react';
import ProposalComponent from '../components/molecule/propasalComponent';
import { FileText, Mail, Globe, Settings } from 'lucide-react';

const meta = {
  title: 'Molecule/ProposalComponent',
  component: ProposalComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProposalComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithFileIcon: Story = {
  args: {
    title: 'Upload your proposal document',
    icon: FileText,
  },
};

export const WithMailIcon: Story = {
  args: {
    title: 'Send proposal to client',
    icon: Mail,
  },
};

export const WithGlobeIcon: Story = {
  args: {
    title: 'Publish proposal online',
    icon: Globe,
  },
};

export const WithSettingsIcon: Story = {
  args: {
    title: 'Configure proposal settings',
    icon: Settings,
  },
}; 