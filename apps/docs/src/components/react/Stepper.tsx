import * as React from "react";

export interface StepperProps {
  orientation?: "horizontal" | "vertical";
  current?: number;
  steps?: string[];
  ariaLabel?: string;
  className?: string;
}

import { cn } from "./utils";

function Stepper(props: StepperProps) {
  props = {
    orientation: "horizontal",
    current: 1,
    steps: ["Cart", "Shipping", "Payment", "Review"],
    ariaLabel: "Progress",
    className: "",
    ...props,
  };
  function indicatorClasses(index: number) {
    const position = index + 1;
    const activeStep = props.current;
    if (position < activeStep) {
      return "bg-success-subtle text-success-foreground border border-success-default";
    }
    if (position === activeStep) {
      return "bg-components-stepper-default-color-indicator-background-active text-components-stepper-default-color-indicator-content-active";
    }
    return "bg-components-stepper-default-color-indicator-background-upcoming text-components-stepper-default-color-indicator-content-upcoming";
  }

  function labelClasses(index: number) {
    const position = index + 1;
    const activeStep = props.current;
    if (position < activeStep) {
      return "text-components-stepper-default-color-label-text-completed font-medium";
    }
    if (position === activeStep) {
      return "text-components-stepper-default-color-label-text-active font-semibold";
    }
    return "text-components-stepper-default-color-label-text-upcoming";
  }

  function connectorClasses(index: number) {
    const position = index + 1;
    const activeStep = props.current;
    if (position < activeStep) {
      return "bg-components-stepper-default-color-connector-background-completed";
    }
    return "bg-components-stepper-default-color-connector-background-upcoming";
  }

  function isLast(index: number) {
    return index === props.steps.length - 1;
  }

  return (
    <nav aria-label={props.ariaLabel} className={cn("w-full", props.className)}>
      {props.orientation === "vertical" ? (
        <ol className="flex flex-col">
          {props.steps?.map((step, index) => (
            <li className="flex gap-2" key={index}>
              <div className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full text-sm",
                    indicatorClasses(index)
                  )}
                  aria-current={
                    index + 1 === props.current ? "step" : undefined
                  }
                >
                  {index + 1 < props.current ? (
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ) : null}
                  {index + 1 >= props.current ? <>{index + 1}</> : null}
                </span>
                {!isLast(index) ? (
                  <span
                    aria-hidden="true"
                    className={cn("w-0.5 flex-1", connectorClasses(index))}
                  />
                ) : null}
              </div>
              <span className={cn("pb-6 pt-1.5 text-sm", labelClasses(index))}>
                {step}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
      {props.orientation === "horizontal" ? (
        <ol className="flex w-full items-start">
          {props.steps?.map((step, index) => (
            <li className="flex flex-1 flex-col items-center gap-2" key={index}>
              <div className="flex w-full items-center">
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 flex-1",
                    index === 0 ? "bg-transparent" : connectorClasses(index - 1)
                  )}
                />
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-rounded-full text-sm",
                    indicatorClasses(index)
                  )}
                  aria-current={
                    index + 1 === props.current ? "step" : undefined
                  }
                >
                  {index + 1 < props.current ? (
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ) : null}
                  {index + 1 >= props.current ? <>{index + 1}</> : null}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 flex-1",
                    isLast(index) ? "bg-transparent" : connectorClasses(index)
                  )}
                />
              </div>
              <span className={cn("text-center text-sm", labelClasses(index))}>
                {step}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </nav>
  );
}

export default Stepper;
