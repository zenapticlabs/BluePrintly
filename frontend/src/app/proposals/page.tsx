"use client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, ArrowRight, Github, Calendar, Search, PlusCircle, File, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import RecentProposals from "@/components/organism/RecentProposals";
import RecentTemplates from "@/components/organism/RecentTemplates";
import ViewToggle from "@/components/molecule/ViewToggle";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MockRecentProposals, MockRecentTemplates, MockTags } from "@/mocks";
import RecentTemplateComponent from "@/components/organism/RecentTemplateComponent";
import { RecentProposal, ITag } from "@/types";
import RecentProposalComponent from "@/components/organism/RecentProposalComponent";


export default function Home() {
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [proposals, setProposals] = useState<RecentProposal[]>(MockRecentProposals);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  useEffect(() => {
    const filteredProposals = MockRecentProposals.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'newest') {
      filteredProposals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      filteredProposals.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    setProposals(filteredProposals);
  }, [search, sortBy]);
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
          value={search}
          onChange={handleSearch}
        />
        <div className="flex gap-2">
          <ViewToggle view={view} onChange={setView} />
          <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest') => setSortBy(value)}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort By</SelectLabel>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className={`${view === 'grid'
        ? 'flex overflow-x-auto gap-4 pb-4'
        : 'flex flex-col gap-4'
        } max-w-full w-full`}>
        {proposals.map((proposal) => (
          <RecentProposalComponent key={proposal.id} proposal={proposal} viewMode={view} />
        ))}
      </div>
    </div>
  );
}
