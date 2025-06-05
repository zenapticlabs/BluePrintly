'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import ProposalComponent from '@/components/molecule/propasalComponent';
import RadioGroup from "@/components/molecule/radioGroup";
import { Checkbox } from '@/components/ui/checkbox';
import UploadedForm from '@/components/molecule/uploadedForm';
import UploadedFileComponent from '@/components/molecule/uploadedFileComponent';

type Step = 'initial' | 'company' | 'proposals';

const options = [
  { value: "1-9", label: "1-9" },
  { value: "11-50", label: "11-50" },
  { value: "51-100", label: "51-100" },
  { value: "101-500", label: "101-500" }
];

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState<Step>('initial');
  const router = useRouter();

  // Initial step form data
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [receiveUpdates, setReceiveUpdates] = useState(false);

  // Company details form data
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [website, setWebsite] = useState('');
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  // Proposals form data
  const [proposalFiles, setProposalFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'proposal') => {
    const files = event.target.files;
    if (!files) return;

    if (type === 'logo') {
      setCompanyLogo(files[0]);
    } else {
      setProposalFiles(Array.from(files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 'initial') {
      setCurrentStep('company');
    } else if (currentStep === 'company') {
      setCurrentStep('proposals');
    } else {
      // TODO: Implement final submission
      console.log('Final submission');
    }
  };

  const renderInitialStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center">
          <span className="text-4xl font-bold">Blue <span className="text-primary">Printly</span></span>
        </div>
        <h2 className="mt-6 text-2xl font-semibold">Sign up for your total proposal glow-up.</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Good riddance to unprofessional proposals, a chaotic process, and losing to the competition. We can't wait to show you how.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Work Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1"
              placeholder="Enter name"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1"
              placeholder="Enter name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
            placeholder="Enter password"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="updates"
            checked={receiveUpdates}
            onCheckedChange={(checked) => setReceiveUpdates(checked as boolean)}
          />
          <label htmlFor="updates" className="text-sm text-gray-600">
            Yes! I would like emails about new features, product updates, closing tips, webinars and more (we promise they're awesome and not annoying.)
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full">Get Started</Button>

      <p className="text-xs text-center text-gray-600">
        By creating an account, you agree to LangueX's Terms of Service and Privacy Policy
      </p>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );

  const renderCompanyStep = () => (
    <div className="space-y-6">
      <div>
        <div className="flex justify-center">
          <span className="text-4xl font-bold">Blue <span className="text-primary">Printly</span></span>
        </div>
        <div className="flex space-x-4 mt-6">
          <div className="flex-1 border-t-4 border-primary pt-2">
            <div className="text-primary font-semibold">Company details</div>
            <div className="text-sm text-gray-500">A few details about your company</div>
          </div>
          <div className="flex-1 border-t-4 border-gray-200 pt-2">
            <div className="text-slate-800 font-semibold">Past Proposals</div>
            <div className="text-sm text-gray-500">Fill the questionnaire to get best talent</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
            className="mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="companyType" className="block text-sm font-medium text-gray-700">Company Type</label>
          <Select>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select a company type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Company Type</SelectLabel>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <RadioGroup
            title="Current Employee Headcount"
            cols={2}
            options={options}
            name="number-range"
            onChange={(value: string) => console.log('Selected:', value)}
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
          <div className="mt-1 flex rounded-md">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              http://www.
            </span>
            <Input
              type="text"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="company-name.com"
              className="rounded-l-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company logo</label>
          <UploadedForm
            onFileUpload={(file) => console.log('File uploaded:', file)}
          />
        </div>
      </div>

      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">Continue</Button>
      </div>
    </div>
  );

  const renderProposalsStep = () => (
    <div className="space-y-6">
      <div>
        <div className="flex justify-center">
          <span className="text-4xl font-bold">Blue <span className="text-primary">Printly</span></span>
        </div>
        <div className="flex space-x-4 mt-6">
          <div className="flex-1 border-t-4 border-slate-200 pt-2">
            <div className="text-slate-800 font-semibold">Company details</div>
            <div className="text-sm text-gray-500">A few details about your company</div>
          </div>
          <div className="flex-1 border-t-4 border-primary pt-2">
            <div className="text-primary font-semibold">Past Proposals</div>
            <div className="text-sm text-gray-500">Fill the questionnaire to get best talent</div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Proposal Files</label>
        <p className="text-sm text-gray-500 mb-1">Update your company logo and then choose where you want it to display.</p>
        <UploadedForm
          onFileUpload={(file) => setProposalFiles([...proposalFiles, file])}
        />
      </div>

      {proposalFiles.length > 0 && (
        <div className="space-y-2">
          {proposalFiles.map((file, index) => (
            <UploadedFileComponent
              key={index}
              fileName={file.name}
              fileSize={`${Math.round(file.size / 1024)} KB`}
              onDelete={() => setProposalFiles(proposalFiles.filter((_, i) => i !== index))}
            />
          ))}
        </div>
      )}

      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => setCurrentStep('company')}>Back</Button>
        <Button type="submit" className="flex-1">Continue</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[550px] w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          {currentStep === 'initial' && renderInitialStep()}
          {currentStep === 'company' && renderCompanyStep()}
          {currentStep === 'proposals' && renderProposalsStep()}
        </form>
      </div>
    </div>
  );
}
