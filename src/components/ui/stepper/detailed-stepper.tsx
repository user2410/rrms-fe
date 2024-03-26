import clsx from "clsx";
import { Step } from "./step";

export default function DetailedStepper({
  steps,
  currentStep,
} : {
  steps: Step[];
  currentStep: number;
}) {
  return (
    <div>
      <ol className="w-full flex flex-row items-center gap-6">
        {steps.map((step, index) => (
          <li 
            key={index}
            className="flex flex-row items-center gap-2">
            <span className={clsx(
              "flex items-center justify-center w-8 h-8 border rounded-full shrink-0",
              currentStep === index && "border-blue-600 text-blue-600"
              )}>
              {index + 1}
            </span>
            <span>
              <h3 className={clsx(
                "font-medium leading-tight",
                currentStep === index && "text-blue-600",
              )}>{step.title}</h3>
              {step.description && (<p className={clsx(
                "text-sm",
                currentStep === index && "text-blue-600" 
              )}>{step.description}</p>)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
