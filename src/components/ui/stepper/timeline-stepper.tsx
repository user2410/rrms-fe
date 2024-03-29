import { Step } from "./step";
import clsx from "clsx";

export default function TimelineStepper({
  steps,
  currentStep,
} : {
  steps: Step[];
  currentStep: number;
}) {
  return (
    <ol className="relative border-l border-gray-200 dark:border-gray-700 space-y-10">
      {steps.map((step, index) => (
        <li key={index} className={clsx(
            "ml-6",
            currentStep === index && "text-primary dark:text-primary/80" 
          )}>
          <span className={clsx(
              "absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full ring-2",
              currentStep === index
                ? "border-primary dark:border-primary/80"
                : "border-muted-foreground dark:border-muted/80",
            )}
          >
            {index + 1}
          </span>
          <h3 className={clsx(
            "font-medium leading-tight",
            currentStep === index && "text-blue-600"
          )}>{step.title}</h3>
          {step.description && 
            <p className={clsx("text-sm", currentStep === index && "text-blue-600")}>{step.description}</p>}
        </li>
      ))}
    </ol>
  );
}
