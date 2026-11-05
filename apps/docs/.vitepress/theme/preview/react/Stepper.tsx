import * as React from "react";

export interface StepperProps {
  orientation?: "horizontal" | "vertical";
  current?: number;
  steps?: string[];
  ariaLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

import {
  cn,
  cva,
  getStepperStepState,
  ICON_PATHS,
  bindControllerProps,
} from "./utils";

function Stepper(props: StepperProps) {
  props = {
    orientation: "horizontal",
    current: 1,
    steps: ["Cart", "Shipping", "Payment", "Review"],
    ariaLabel: "Progress",
    className: "",
    ...props,
  };
  const [__ctrlState, __setCtrlState] = React.useState<Record<string, any>>({});
  props = bindControllerProps(props, __ctrlState, __setCtrlState);
  return (
    <nav
      data-ctrl={typeof bindControllerProps}
      aria-label={props.ariaLabel}
      className={cn("w-full bg-background-default", props.className)}
    >
      {props.children ? <>{props.children}</> : null}
      {!props.children && props.orientation === "vertical" ? (
        <ol className="flex flex-col">
          {props.steps?.map((step, index) => (
            <li className="flex gap-2" key={index}>
              <div className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                    cva(
                      getStepperStepState(
                        index,
                        props.current,
                        (props.steps || []).length
                      ).stepKey,
                      {
                        completed: "bg-primary-default text-primary-foreground",
                        active:
                          "border-2 border-primary-default bg-background-default text-primary-default",
                        upcoming: "bg-background-muted text-foreground-muted",
                      },
                      "upcoming"
                    )
                  )}
                  aria-current={
                    getStepperStepState(
                      index,
                      props.current,
                      (props.steps || []).length
                    ).isCurrent
                      ? "step"
                      : undefined
                  }
                >
                  {getStepperStepState(
                    index,
                    props.current,
                    (props.steps || []).length
                  ).isCompleted ? (
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={ICON_PATHS.check}
                      />
                    </svg>
                  ) : null}
                  {!getStepperStepState(
                    index,
                    props.current,
                    (props.steps || []).length
                  ).isCompleted ? (
                    <>{index + 1}</>
                  ) : null}
                </span>
                {!getStepperStepState(
                  index,
                  props.current,
                  (props.steps || []).length
                ).isLast ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "w-0.5 flex-1",
                      getStepperStepState(
                        index,
                        props.current,
                        (props.steps || []).length
                      ).isCompleted
                        ? "bg-primary-default"
                        : "bg-border-default"
                    )}
                  />
                ) : null}
              </div>
              <span
                className={cn(
                  "pb-6 pt-1.5 text-sm",
                  cva(
                    getStepperStepState(
                      index,
                      props.current,
                      (props.steps || []).length
                    ).stepKey,
                    {
                      completed: "text-foreground-default font-medium",
                      active: "text-foreground-default font-semibold",
                      upcoming: "text-foreground-muted",
                    },
                    "upcoming"
                  )
                )}
              >
                {step}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
      {!props.children && props.orientation === "horizontal" ? (
        <ol className="flex w-full items-start">
          {props.steps?.map((step, index) => (
            <li className="flex flex-1 flex-col items-center gap-2" key={index}>
              <div className="flex w-full items-center">
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 flex-1",
                    index === 0
                      ? "bg-transparent"
                      : getStepperStepState(
                          index,
                          props.current,
                          (props.steps || []).length
                        ).prevCompleted
                      ? "bg-primary-default"
                      : "bg-border-default"
                  )}
                />
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                    cva(
                      getStepperStepState(
                        index,
                        props.current,
                        (props.steps || []).length
                      ).stepKey,
                      {
                        completed: "bg-primary-default text-primary-foreground",
                        active:
                          "border-2 border-primary-default bg-background-default text-primary-default",
                        upcoming: "bg-background-muted text-foreground-muted",
                      },
                      "upcoming"
                    )
                  )}
                  aria-current={
                    getStepperStepState(
                      index,
                      props.current,
                      (props.steps || []).length
                    ).isCurrent
                      ? "step"
                      : undefined
                  }
                >
                  {getStepperStepState(
                    index,
                    props.current,
                    (props.steps || []).length
                  ).isCompleted ? (
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={ICON_PATHS.check}
                      />
                    </svg>
                  ) : null}
                  {!getStepperStepState(
                    index,
                    props.current,
                    (props.steps || []).length
                  ).isCompleted ? (
                    <>{index + 1}</>
                  ) : null}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 flex-1",
                    getStepperStepState(
                      index,
                      props.current,
                      (props.steps || []).length
                    ).isLast
                      ? "bg-transparent"
                      : getStepperStepState(
                          index,
                          props.current,
                          (props.steps || []).length
                        ).isCompleted
                      ? "bg-primary-default"
                      : "bg-border-default"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-center text-sm",
                  cva(
                    getStepperStepState(
                      index,
                      props.current,
                      (props.steps || []).length
                    ).stepKey,
                    {
                      completed: "text-foreground-default font-medium",
                      active: "text-foreground-default font-semibold",
                      upcoming: "text-foreground-muted",
                    },
                    "upcoming"
                  )
                )}
              >
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
