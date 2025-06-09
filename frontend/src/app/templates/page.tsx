"use client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, ArrowRight, Github, Calendar, Search, PlusCircle, File, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import ViewToggle from "@/components/molecule/ViewToggle";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MockRecentTemplates, MockTags } from "@/mocks";
import RecentTemplateComponent from "@/components/organism/RecentTemplateComponent";
import { IRecentTemplate, ITag } from "@/types";


export default function Home() {
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [templates, setTemplates] = useState<IRecentTemplate[]>(MockRecentTemplates);
  const handleTagClick = (tag: ITag) => {
    if (tag.id === 'all') {
      setSelectedTags([]);
    } else if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  useEffect(() => {
    let filteredTemplates = MockRecentTemplates.filter((t) => 
      t.title.toLowerCase().includes(search.toLowerCase())
    );

    if (selectedTags.length > 0) {
      filteredTemplates = filteredTemplates.filter((t) => 
        t.tags.some((tag) => selectedTags.some((t) => t.tag === tag))
      );
    }

    // Sort templates based on sortBy value
    filteredTemplates.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

    setTemplates(filteredTemplates);
  }, [selectedTags, search, sortBy]);
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-medium">
          Templates
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 bg-slate-100 rounded-md p-2">
        <Button variant="ghost" className={`px-3.5 py-2.5 text-sm ${selectedTags.length === 0 ? 'bg-white text-slate-800 shadow-sm' : 'bg-transparent text-slate-500'}`} onClick={() => handleTagClick({ id: 'all', title: 'All', tag: 'all' })}>
          All
        </Button>
        {MockTags.map((tag) => (
          <Button key={tag.id} variant="ghost" className={`px-3.5 py-2.5 text-sm ${selectedTags.includes(tag) ? 'bg-white text-slate-800 shadow-sm' : 'bg-transparent text-slate-500'}`} onClick={() => handleTagClick(tag)}>
            {tag.title}
          </Button>
        ))}
      </div>

      <div className="flex justify-between">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-[320px]"
          startIcon={<Search className="w-4 h-4" />}
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
        {templates.map((template) => (
          <RecentTemplateComponent key={template.id} template={template} viewMode={view} />
        ))}
      </div>
    </div>
  );
}
