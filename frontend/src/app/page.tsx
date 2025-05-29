"use client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, ArrowRight, Github, Calendar, Search, PlusCircle, File } from "lucide-react";
import { useState } from "react";
// import { WebsiteInput } from "@/components/molecule/websiteInput";
import UploadedFileComponent from "@/components/molecule/uploadedFileComponent";
import UploadedForm from "@/components/molecule/uploadedForm";
import { Switch } from "@/components/ui/switch";
import ProposalComponent from "@/components/molecule/propasalComponent";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import SuiteComponent from "@/components/molecule/suiteComponent";
import Stepper from "@/components/molecule/stepper";
import RadioGroup from "@/components/molecule/radioGroup";
import { WebsiteInput } from "@/components/molecule/websiteInput";

const options = [
  { value: "1-9", label: "1-9" },
  { value: "11-50", label: "11-50" },
  { value: "51-100", label: "51-100" },
  { value: "101-500", label: "101-500" }
];

const steps = [
  {
    title: 'Requirements',
    description: 'Share requirements & materials'
  },
  {
    title: 'Depth & Tech',
    description: 'Provide technical details about proposal'
  },
  {
    title: 'Proposal Builder',
    description: 'Customize proposal with AI'
  }
];

export default function Home() {
  const [website, setWebsite] = useState('');
  return (
    <div className="flex flex-col gap-4 px-6 py-6">
      <Stepper steps={steps} status={2} />
      <SuiteComponent icon={File} title="Summary" amount="1-2 pages" description="It will create a summary proposal for you" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ProposalComponent icon={PlusCircle} title="Add header for client readability" />
      <Switch />
      <div className="flex gap-4">
        <Button startIcon={<Mail />}>
          Send Email
        </Button>

        {/* Action Button with end icon */}
        <Button variant="secondary" endIcon={<ArrowRight />}>
          Continue
        </Button>

        {/* Button with both icons */}
        <Button variant="outline" startIcon={<Github />} endIcon={<ArrowRight />}>
          Login with Github
        </Button>
      </div>
      <Input
        startIcon={<Search className="h-4 w-4" />}
        endIcon={<Calendar className="h-4 w-4" />}
        placeholder="Search dates"
      />
      <Textarea placeholder="Enter your message" />
      <RadioGroup
        title="Company Type"
        cols={2}
        options={options}
        name="number-range"
        onChange={(value: string) => console.log('Selected:', value)}
      />
      <WebsiteInput
        title="Website"
        value={website}
        onChange={setWebsite}
        placeholder="Enter your website"
      />
      <UploadedFileComponent
        fileName="Tech design requirements.pdf"
        fileSize="200 KB"
      />
      <UploadedForm
        onFileUpload={(file) => {
          // Handle the uploaded file
          console.log(file);
        }}
      />
    </div>
  );
}
