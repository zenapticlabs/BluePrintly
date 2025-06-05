import type { Meta, StoryObj } from '@storybook/react';
import UploadedFileComponent from '../components/molecule/uploadedFileComponent';

const meta = {
  title: 'Molecule/UploadedFileComponent',
  component: UploadedFileComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UploadedFileComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fileName: 'document.pdf',
    fileSize: '2.5 MB',
  },
};

export const WithCheckmark: Story = {
  args: {
    fileName: 'presentation.pptx',
    fileSize: '5.8 MB',
    checked: true,
  },
};

export const LongFileName: Story = {
  args: {
    fileName: 'very-long-file-name-with-detailed-description-2024.docx',
    fileSize: '1.2 MB',
    checked: false,
  },
}; 