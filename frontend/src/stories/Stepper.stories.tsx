import type { Meta, StoryObj } from '@storybook/react';
import Stepper from '../components/molecule/stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Molecule/Stepper',
  component: Stepper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const steps = [
  {
    title: 'Requirements',
    description: 'Share requirements & materials',
  },
  {
    title: 'Depth & Tech',
    description: 'Provide technical details about proposal',
  },
  {
    title: 'Proposal Builder',
    description: 'Customize proposal with AI',
  },
];

export const Initial: Story = {
  args: {
    steps,
    status: 0,
  },
};

export const InProgress: Story = {
  args: {
    steps,
    status: 1,
  },
};

export const Completed: Story = {
  args: {
    steps,
    status: 2,
  },
}; 