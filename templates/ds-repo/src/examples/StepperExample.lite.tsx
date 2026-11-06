import Stepper from '../components/Stepper.lite';
import StepperItem from '../components/StepperItem.lite';

export default function StepperExample() {
  return (
    <Stepper orientation="horizontal" ariaLabel="Checkout progress">
      <StepperItem step={1} status="completed">
        Cart
      </StepperItem>
      <StepperItem step={2} status="active">
        Shipping
      </StepperItem>
      <StepperItem step={3} status="upcoming">
        Payment
      </StepperItem>
      <StepperItem step={4} status="upcoming" isLast={true}>
        Review
      </StepperItem>
    </Stepper>
  );
}