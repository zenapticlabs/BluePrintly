import type { Meta, StoryObj } from '@storybook/react';
import UploadedForm from '../components/molecule/uploadedForm';

const meta = {
  title: 'Molecule/UploadedForm',
  component: UploadedForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UploadedForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    acceptedFileTypes: ['.pdf', '.docx', '.xls'],
    maxSize: 5242880,
  },
};

export const CustomTitle: Story = {
  args: {
    acceptedFileTypes: ['.pdf', '.docx', '.xls'],
    maxSize: 10485760, // 10MB
  },
};

export const PDFOnly: Story = {
  args: {
    acceptedFileTypes: ['.pdf'],
    maxSize: 2097152, // 2MB
  },
}; 