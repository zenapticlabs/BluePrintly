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
import { MockRecentProposals, MockRecentTemplates, MockTags } from "@/mocks";
import RecentTemplateComponent from "@/components/organism/RecentTemplateComponent";
import { ITag } from "@/types";
import RecentProposalComponent from "@/components/organism/RecentProposalComponent";


export default function Home() {
  const [view, setView] = useState<'list' | 'grid'>('grid');
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div className="text-wxl">
          Proposals
        </div>
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
      <div className='flex overflow-x-auto gap-4 pb-4 hide-scrollbar max-w-full w-full'>
        {MockRecentProposals.map((proposal) => (
          <RecentProposalComponent key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </div>
  );
}
