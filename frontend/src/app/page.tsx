"use client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, ArrowRight, Github, Calendar, Search, PlusCircle, File, Plus } from "lucide-react";
import { useState } from "react";
import RecentProposals from "@/components/organism/RecentProposals";
import RecentTemplates from "@/components/organism/RecentTemplates";
import ViewToggle from "@/components/molecule/ViewToggle";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

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
  const [view, setView] = useState<'list' | 'grid'>('grid');
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div className="">
          <div className="text-2xl font-medium">Hey there, Hadeed!</div>
          <div className="text-slate-600">Welcome, we're happy to have you here!</div>
        </div>
        <Link href="/proposals/create" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md">
          <Plus className="w-4 h-4" />
          Create Proposal
        </Link>
      </div>
      <div className="flex justify-between">
        <Input
          placeholder="Search"
          className="w-[320px]"
          startIcon={<Search className="w-4 h-4" />}
        />
        <div className="flex gap-2">
          <ViewToggle view={view} onChange={setView} />
          <Select>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort By</SelectLabel>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="most-popular">Most Popular</SelectItem>
                <SelectItem value="least-popular">Least Popular</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <RecentProposals />
      <RecentTemplates />
    </div>
  );
}
