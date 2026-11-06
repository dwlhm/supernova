<script lang="ts">
  import Stepper from "./Stepper.svelte";
  import StepperItem from "./StepperItem.svelte";
</script>

<Stepper orientation="horizontal" ariaLabel="Checkout progress"
  ><StepperItem status="completed" step={1}>Cart</StepperItem><StepperItem
    status="active"
    step={2}
  >
    Shipping
  </StepperItem><StepperItem status="upcoming" step={3}>
    Payment
  </StepperItem><StepperItem status="upcoming" step={4} isLast={true}>
    Review
  </StepperItem></Stepper
>