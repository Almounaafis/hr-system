import { Check } from "lucide-react";

export default function Stepper({ steps, currentStep }) {
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="w-full relative max-w-[709px] mb-8 sm:mb-10">
      {/* Progress Bar Background */}
      <div className="absolute top-0 left-0 right-0 mb-8">
        {/* Progress Percentage */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold text-muted-foreground">
            {progressPercentage.toFixed(0)}%
          </span>
          <span className="text-xs font-semibold text-primary">
            {currentStep} / {steps.length}
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          {/* Active Progress */}
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps Container */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 mb-4">
        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <StepperStep
              key={step.number}
              step={step}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
            />
          );
        })}
      </div>
    </div>
  );
}

function StepperStep({ step, isCompleted, isCurrent }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Step Circle */}
      <div
        className={`
          relative w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-md rounded-full flex items-center justify-center 
          font-semibold text-xs sm:text-sm transition-all duration-300 mb-2 sm:mb-2.5
          ${isCurrent
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40 scale-110"
            : isCompleted
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-muted text-muted-foreground border border-border"
          }
        `}
      >
        {isCompleted ? (
          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <span>{step.number}</span>
        )}

        {/* Pulse animation for current step */}
        {isCurrent && (
          <div className="absolute inset-0 rounded-full border border-primary animate-pulse opacity-50" />
        )}
      </div>

      {/* Step Labels */}
      <div className="text-center">
        <div
          className={`text-[10px] sm:text-xs font-semibold transition-colors duration-300 ${isCurrent || isCompleted
              ? "text-primary"
              : "text-muted-foreground"
            }`}
        >
          {step.label}
        </div>
        <div className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 hidden sm:block">
          {step.description}
        </div>
      </div>
    </div>
  );
}
