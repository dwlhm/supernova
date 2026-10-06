import * as React from "react";

export interface StepperProps {
  step1Label?: string;
  step2Label?: string;
  step3Label?: string;
  step4Label?: string;
  type?: "Horizontal" | "Vertical";
  current?: "1" | "2" | "3" | "4";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  stepNumber?: string;
  stepNumber2?: string;
  stepNumber3?: string;
  stepNumber4?: string;
}

function Stepper(props: StepperProps) {
  return (
    <div
      id={props.id}
      aria-describedby={props.ariaDescribedby}
      className={
        "flex flex-row gap--4" + (props.className ? " " + props.className : "")
      }
    >
      <div className="flex flex-col gap-2 items-center">
        <div className="flex flex-row justify-center items-center rounded-full bg-[#e55514]">
          <span className="text-xs font-semibold text-center text-white">
            {props.stepNumber ?? "1"}
          </span>
        </div>
        <p className="text-sm font-medium text-center text-[#0a0a0a]">
          {props.step1Label ?? "Cart"}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-[#d4d4d4] w-full" />
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex flex-row justify-center items-center rounded-full bg-[#f5f5f5]">
          <span className="text-xs font-semibold text-center text-[#737373]">
            {props.stepNumber2 ?? "2"}
          </span>
        </div>
        <p className="text-sm font-medium text-center text-[#737373]">
          {props.step2Label ?? "Shipping"}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-[#d4d4d4] w-full" />
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex flex-row justify-center items-center rounded-full bg-[#f5f5f5]">
          <span className="text-xs font-semibold text-center text-[#737373]">
            {props.stepNumber3 ?? "3"}
          </span>
        </div>
        <p className="text-sm font-medium text-center text-[#737373]">
          {props.step3Label ?? "Payment"}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-[#d4d4d4] w-full" />
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex flex-row justify-center items-center rounded-full bg-[#f5f5f5]">
          <span className="text-xs font-semibold text-center text-[#737373]">
            {props.stepNumber4 ?? "4"}
          </span>
        </div>
        <p className="text-sm font-medium text-center text-[#737373]">
          {props.step4Label ?? "Review"}
        </p>
      </div>
      {props.children}
    </div>
  );
}

export default Stepper;
