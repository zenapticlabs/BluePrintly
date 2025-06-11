"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, ArrowRight, Github, Calendar, Search, PlusCircle, File, Plus } from "lucide-react";
import { useState, Suspense } from "react";
import ViewToggle from "@/components/molecule/ViewToggle";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MockRecentTemplates, MockTags } from "@/mocks";
import RecentTemplateComponent from "@/components/organism/RecentTemplateComponent";
import { ITag } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

function TemplateContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const template = MockRecentTemplates.find((t) => t.id === id);
  if (!template) {
    return <div>Template not found</div>;
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Templates</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>
            View Template
          </BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-5 shadow-sm rounded-lg flex justify-between items-center">
        <div>
          <div className="text-2xl font-medium">Template</div>
          <div className="text-sm text-slate-600">
            Welcome, we are happy to have you here!
          </div>
        </div>
        <Button>
          Use Template
        </Button>
      </div>
      <div className="mx-auto w-2xl text-2xl border h-[600px] border-input rounded-lg flex items-center justify-center">
        1
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TemplateContent />
    </Suspense>
  );
}
