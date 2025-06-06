"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, File, LayoutDashboard, Pause, Plus, Search } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Stepper from "@/components/molecule/stepper";
import UploadedForm from "@/components/molecule/uploadedForm";
import { useEffect, useState } from "react";
import SuiteComponent from "@/components/molecule/suiteComponent";
import { Switch } from "@/components/ui/switch";
import WordEditor from "@/components/organism/WordEditor";
import MessageBox from "@/components/organism/MessageBox";
import ThemeSelector from "@/components/organism/ThemeSelector";
import SectionsOrder from "@/components/organism/SectionsOrder";
import ChatHistory from "@/components/organism/ChatHistory";

type Step = 'Requirements' | 'Depth & Tech' | 'Proposal Builder';
const steps: Step[] = ['Requirements', 'Depth & Tech', 'Proposal Builder'];
const suits = [
  {
    id: 1,
    icon: File,
    title: 'Basic',
    amount: '1-2 pages',
    description: 'It will create a summary proposal for you',
  },
  {
    id: 2,
    icon: Pause,
    title: 'Standard',
    amount: '3-4 pages',
    description: 'It will create a detailed proposal for you',
  },
  {
    id: 3,
    icon: LayoutDashboard,
    title: 'Premium',
    amount: '5-6 pages',
    description: 'It will create a detailed proposal for you',
  },
]
const techStacks = ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision", "NLP", "CV", "AI", "ML", "DL"]

const SidePanels = {
  THEME: 'theme',
  SECTIONS: 'sections',
  CHAT_HISTORY: 'chat_history',
}

export default function Home() {
  const [step, setStep] = useState<Step>('Requirements');
  const [selectedSuits, setSelectedSuits] = useState<number[]>([]);
  const [openedSidePanel, setOpenedSidePanel] = useState<string>('');
  const [collapedStepper, setCollapedStepper] = useState(false);
  const handleSuitClick = (id: number) => {
    if (selectedSuits.includes(id)) {
      setSelectedSuits(selectedSuits.filter((suit) => suit !== id));
    } else {
      setSelectedSuits([...selectedSuits, id]);
    }
  }

  const handleThemeClick = () => {
    if (openedSidePanel === SidePanels.THEME) {
      setOpenedSidePanel('');
    } else {
      setOpenedSidePanel(SidePanels.THEME);
    }
  }

  const handleSectionsClick = () => {
    if (openedSidePanel === SidePanels.SECTIONS) {
      setOpenedSidePanel('');
    } else {
      setOpenedSidePanel(SidePanels.SECTIONS);
    }
  }

  const handleChatHistoryClick = () => {
    if (openedSidePanel === SidePanels.CHAT_HISTORY) {
      setOpenedSidePanel('');
    } else {
      setOpenedSidePanel(SidePanels.CHAT_HISTORY);
    }
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving...');
  }

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Downloading...');
  }

  const handleToProposalBuilder = () => {
    setStep('Proposal Builder');
    setCollapedStepper(true);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Create Proposals</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>
              {step}
            </BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="px-5 pt-5 pb-3 shadow-sm rounded-lg">
          <Stepper steps={[{
            title: "Requirement",
            description: "Create a proposal for a new project",
          }, {
            title: "Design",
            description: "Design the proposal",
          }, {
            title: "Review",
            description: "Review the proposal",
          }]}
            collapsed={collapedStepper}
            onCollapse={() => setCollapedStepper(!collapedStepper)}
            status={steps.indexOf(step)}
          />
        </div>
      </div>

      {
        step === 'Proposal Builder' ? (
          <div className="flex-1 min-h-0 px-4">
            <div className="flex gap-3 h-full">
              <ThemeSelector open={openedSidePanel === SidePanels.THEME} onClose={() => setOpenedSidePanel('')} />
              <SectionsOrder open={openedSidePanel === SidePanels.SECTIONS} onClose={() => setOpenedSidePanel('')} />
              <div className={`flex flex-col h-full mx-auto ${openedSidePanel === '' ? 'w-[800px]' : 'w-[calc(100%-300px)]'}`}>
                <div className="flex-1">
                  <WordEditor onSave={handleSave} onDownload={handleDownload} />
                </div>
                <div className="mt-4 border border-input rounded-lg p-3">
                  <MessageBox
                    onThemeClick={handleThemeClick}
                    themeOpen={openedSidePanel === SidePanels.THEME}
                    onSectionsClick={handleSectionsClick}
                    sectionsOpen={openedSidePanel === SidePanels.SECTIONS}
                    onChatHistoryClick={handleChatHistoryClick}
                    chatHistoryOpen={openedSidePanel === SidePanels.CHAT_HISTORY}
                  />
                </div>
              </div>
              <ChatHistory open={openedSidePanel === SidePanels.CHAT_HISTORY} onClose={() => setOpenedSidePanel('')} />
            </div>
          </div>
        ) : (
          <div className="px-4">
            <div className="shadow-sm rounded-lg">
              <div className="p-5 border-b border-slate-200 text-lg text-foreground font-semibold">
                Requirements
              </div>
              {
                step === 'Requirements' && (
                  <div className="grid grid-cols-4 gap-4 p-5">
                    <div className="col-span-1">Client name<span className="text-sm text-muted-foreground">*</span></div>
                    <div className="col-span-3">
                      <Input placeholder="Enter client name" className="w-full" />
                    </div>
                    <div className="col-span-1">Share your requirements<span className="text-sm text-muted-foreground">*</span></div>
                    <div className="col-span-3">
                      <UploadedForm
                        onFileUpload={(file) => console.log('File uploaded:', file)}
                      />
                    </div>
                    <div className="col-span-1"></div>
                    <div className="col-span-3 flex flex-grow gap-1 items-center">
                      <div className="h-[1px] flex-grow bg-slate-200"></div>
                      OR
                      <div className="h-[1px] flex-grow bg-slate-200"></div>
                    </div>
                    <div className="col-span-1">

                    </div>
                    <div className="col-span-3">
                      <Textarea placeholder="Enter your requirements" className="w-full" rows={10} />
                    </div>
                  </div>
                )
              }
              {
                step === 'Depth & Tech' && (
                  <div className="grid grid-cols-4 gap-4 p-5">
                    <div className="col-span-1">Choose what suit you best</div>
                    <div className="col-span-3 grid grid-cols-3 gap-4">
                      {
                        suits.map((suit) => (
                          <SuiteComponent
                            key={suit.title}
                            icon={suit.icon}
                            title={suit.title}
                            amount={suit.amount}
                            description={suit.description}
                            onClick={() => handleSuitClick(suit.id)}
                            clicked={selectedSuits.includes(suit.id)}
                          />
                        ))
                      }
                    </div>
                    <div className="col-span-1">
                      <div className="text-sm text-slate-800">Search or add up to 10 tech stacks</div>
                      <div className="text-xs text-slate-500">If you do not include the tech stacks, the AI will automatically infer from the past proposals.</div>
                    </div>
                    <div className="col-span-3 flex flex-col gap-2">
                      <Input placeholder="Search tech stacks" className="w-full" startIcon={<Search className="w-4 h-4" />} />
                      <div className="flex items-center gap-2">
                        <Switch />
                        <div className="text-sm text-slate-800 flex items-center gap-2">Enable Deep Research <span className="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[10px]">i</span></div>
                      </div>
                      <div className="text-sm text-slate-800">
                        <div className="text-sm font-medium text-slate-800 mt-4">Relavant Tech Stacks</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {
                          techStacks.map((tech) => (
                            <Button key={tech} variant="outline" className="rounded-full" endIcon={<Plus />}>
                              {tech}
                            </Button>
                          ))
                        }
                        <Button variant="ghost" className="rounded-full">
                          See More
                        </Button>
                      </div>
                    </div>

                  </div>
                )
              }
            </div>
          </div>
        )}

      <div className="p-4">
        {
          step === 'Requirements' && (
            <div className="flex items-center gap-2 justify-between">
              <Button variant="outline">Cancel</Button>
              <Button endIcon={<ArrowRight />} onClick={() => setStep('Depth & Tech')}>Depth & Tech</Button>
            </div>
          )
        }
        {
          step === 'Depth & Tech' && (
            <div className="flex items-center gap-2 justify-between">
              <Button variant="outline">Cancel</Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setStep('Requirements')} startIcon={<ArrowLeft />}>Requirements</Button>
                <Button endIcon={<ArrowRight />} onClick={handleToProposalBuilder}>Proposal Builder</Button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}
