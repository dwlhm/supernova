<script context="module" lang="ts">
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
</script>

<script lang="ts">
  export let id: StepperProps["id"];
  export let ariaDescribedby: StepperProps["ariaDescribedby"];
  export let className: StepperProps["className"];
  export let stepNumber: StepperProps["stepNumber"];
  export let step1Label: StepperProps["step1Label"];
  export let stepNumber2: StepperProps["stepNumber2"];
  export let step2Label: StepperProps["step2Label"];
  export let stepNumber3: StepperProps["stepNumber3"];
  export let step3Label: StepperProps["step3Label"];
  export let stepNumber4: StepperProps["stepNumber4"];
  export let step4Label: StepperProps["step4Label"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-row gap--4" + (className ? " " + className : "")}
>
  <div class="flex flex-col gap-2 items-center">
    <div
      class="flex flex-row justify-center items-center rounded-full bg-[#e55514]"
    >
      <span class="text-xs font-semibold text-center text-white"
        >{stepNumber ?? "1"}</span
      >
    </div>
    <p class="text-sm font-medium text-center text-[#0a0a0a]">
      {step1Label ?? "Cart"}
    </p>
  </div>
  <div class="flex flex-col justify-center items-center">
    <div class="bg-[#d4d4d4] w-full" />
  </div>
  <div class="flex flex-col gap-2 items-center">
    <div
      class="flex flex-row justify-center items-center rounded-full bg-[#f5f5f5]"
    >
      <span class="text-xs font-semibold text-center text-[#737373]"
        >{stepNumber2 ?? "2"}</span
      >
    </div>
    <p class="text-sm font-medium text-center text-[#737373]">
      {step2Label ?? "Shipping"}
    </p>
  </div>
  <div class="flex flex-col justify-center items-center">
    <div class="bg-[#d4d4d4] w-full" />
  </div>
  <div class="flex flex-col gap-2 items-center">
    <div
      class="flex flex-row justify-center items-center rounded-full bg-[#f5f5f5]"
    >
      <span class="text-xs font-semibold text-center text-[#737373]"
        >{stepNumber3 ?? "3"}</span
      >
    </div>
    <p class="text-sm font-medium text-center text-[#737373]">
      {step3Label ?? "Payment"}
    </p>
  </div>
  <div class="flex flex-col justify-center items-center">
    <div class="bg-[#d4d4d4] w-full" />
  </div>
  <div class="flex flex-col gap-2 items-center">
    <div
      class="flex flex-row justify-center items-center rounded-full bg-[#f5f5f5]"
    >
      <span class="text-xs font-semibold text-center text-[#737373]"
        >{stepNumber4 ?? "4"}</span
      >
    </div>
    <p class="text-sm font-medium text-center text-[#737373]">
      {step4Label ?? "Review"}
    </p>
  </div>
  <slot />
</div>