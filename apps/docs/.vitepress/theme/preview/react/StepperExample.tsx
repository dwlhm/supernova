import * as React from "react";
import Stepper from "./Stepper";
import StepperItem from "./StepperItem";

function StepperExample(props: any) {
  return (
    <Stepper orientation="horizontal" ariaLabel="Checkout progress">
      <StepperItem status="completed" step={1}>
        Cart
      </StepperItem>
      <StepperItem status="active" step={2}>
        Shipping
      </StepperItem>
      <StepperItem status="upcoming" step={3}>
        Payment
      </StepperItem>
      <StepperItem status="upcoming" step={4} isLast>
        Review
      </StepperItem>
    </Stepper>
  );
}

Object.assign(StepperExample, { Stepper, StepperItem });

export default StepperExample;
