const StepProgress = ({ currentStep, completedSteps = [] }) => {
  const steps = [
    { num: 1, label: 'Overview' },
    { num: 2, label: 'Pricing' },
    { num: 3, label: 'Description' },
    { num: 4, label: 'Requirements' },
    { num: 5, label: 'Gallery' },
  ];

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto">
      {steps.map((step, idx) => {
        const isCompleted = completedSteps.includes(step.num) || step.num < currentStep;
        const isCurrent = step.num === currentStep;

        return (
          <div key={step.num} className="flex items-center flex-1 last:flex-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  isCompleted
                    ? 'bg-gig-teal border-gig-teal text-white'
                    : isCurrent
                    ? 'border-gig-teal text-gig-teal bg-teal-50 ring-4 ring-gig-teal/20'
                    : 'border-gray-300 text-gray-400 bg-white'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span className={`text-xs mt-1 font-medium hidden sm:block ${
                isCurrent ? 'text-gig-teal' : isCompleted ? 'text-gig-teal' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-0 sm:mt-[-20px] ${
                isCompleted ? 'bg-gig-teal' : 'bg-gray-200'
              }`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
