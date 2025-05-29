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
    title: 'Upload Proposal Files',
    subtitle: 'Update your company logo and then choose where you want it to display.',
    acceptedFileTypes: ['.pdf', '.docx', '.xls'],
    maxSize: 5242880,
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Upload Documents',
    subtitle: 'Please upload your supporting documents',
    acceptedFileTypes: ['.pdf', '.docx', '.xls'],
    maxSize: 10485760, // 10MB
  },
};

export const PDFOnly: Story = {
  args: {
    title: 'Upload PDF',
    subtitle: 'Only PDF files are accepted',
    acceptedFileTypes: ['.pdf'],
    maxSize: 2097152, // 2MB
  },
}; 