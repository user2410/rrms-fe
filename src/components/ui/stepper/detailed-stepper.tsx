import clsx from "clsx";

export interface Step {
  title: string;
  description?: string;
}

export default function DetailedStepper({
  steps,
  currentStep,
} : {
  steps: Step[];
  currentStep: number;
}) {
  return (
    <div>
      <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
        {steps.map((step, index) => (
          <li 
            key={index}
            className={clsx(
              "flex items-center space-x-2.5",
              currentStep === index && "text-primary dark:text-primary/80" 
            )}>
            <span className={clsx(
              "flex items-center justify-center w-8 h-8 border rounded-full shrink-0",
              currentStep === index
                ? "border-primary dark:border-primary/80"
                : "border-muted-foreground dark:border-muted/80"
              )}>
              {index + 1}
            </span>
            <span>
              <h3 className="font-medium leading-tight">{step.title}</h3>
              {step.description && (<p className="text-sm">{step.description}</p>)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}