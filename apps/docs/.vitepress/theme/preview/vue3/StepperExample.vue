<template>
  <Stepper orientation="horizontal" ariaLabel="Checkout progress"
    ><StepperItem status="completed" :step="1"> Cart </StepperItem
    ><StepperItem status="active" :step="2"> Shipping </StepperItem
    ><StepperItem status="upcoming" :step="3"> Payment </StepperItem
    ><StepperItem status="upcoming" :step="4" :isLast="true">
      Review
    </StepperItem></Stepper
  >
</template>

<script setup lang="ts">
import Stepper from "./Stepper.vue";
import StepperItem from "./StepperItem.vue";
</script>