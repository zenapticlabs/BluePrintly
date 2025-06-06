import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

interface Step {
  title: string;
  description: string;

}

interface StepperProps {
  steps: Step[];
  status: number;
  collapsed: boolean;
  onCollapse: () => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, status, collapsed, onCollapse }) => {

  return (
    <div className="w-full flex items-start gap-4">
      <div className="flex-grow">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center flex-1">
              {/* Step Circle and Content */}
              <div className="flex flex-col items-center relative flex-1">

                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center z-10
                  ${index < status
                    ? 'bg-blue-100 text-primary border-2 border-primary'
                    : index === status
                      ? 'border-2 border-primary bg-blue-100'
                      : 'border-2 border-gray-300 bg-white'
                  }
                `}>
                  {index < status ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className={`
                      w-2 h-2 rounded-full
                      ${index === status ? 'bg-primary' : 'bg-gray-300'}
                    `} />
                  )}
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-3 left-1/2 w-full h-[2px] -translate-y-1/2">
                    <div className={`
                      w-full h-full
                      ${index < status ? 'bg-primary' : 'bg-gray-300'}
                    `} />
                  </div>
                )}

                {!collapsed && (
                  <div className="mt-2 text-center">
                    <div className={` text-sm
                      font-medium
                      ${index <= status ? 'text-gray-900' : 'text-gray-500'}
                    `}>
                      {step.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {step.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapse Toggle Button - Now inside the panel */}
      <button
        onClick={onCollapse}
        className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
      >
        {collapsed ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronUp className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default Stepper;

// Example usage:
export const StepperExample: React.FC = () => {
  const steps: Step[] = [
    {
      title: 'Requirements',
      description: 'Share requirements & materials',
    },
    {
      title: 'Depth & Tech',
      description: 'Provide technical details about proposal',
    },
    {
      title: 'Proposal Builder',
      description: 'Customize proposal with AI',
    },
  ];

  return <Stepper steps={steps} status={1} collapsed={false} onCollapse={() => { }} />; // 1 means second step is active
};
