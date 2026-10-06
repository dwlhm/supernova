<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-row items-center ' +
      (type === 'Image Text'
        ? 'text-[#0a0a0a]'
        : type === 'Image'
        ? 'text-[#0a0a0a]'
        : type === 'Stacked Text'
        ? 'text-[#0a0a0a]'
        : type === 'Avatar Text'
        ? 'text-[#0a0a0a]'
        : type === 'Status'
        ? 'text-[#0a0a0a]'
        : type === 'Number'
        ? 'text-[#0a0a0a]'
        : 'text-[#0a0a0a]') +
      (className ? ' ' + className : '')
    "
  >
    <p class="text-sm font-normal text-[#0a0a0a]">
      {{ value ?? "Cell Value" }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface TableCellValueProps {
  value?: string;
  showAffiliate?: boolean;
  showKomlabs?: boolean;
  showRajaOngkir?: boolean;
  showKomads?: boolean;
  showKomcards?: boolean;
  showKomchat?: boolean;
  showKomclass?: boolean;
  showKompack?: boolean;
  showKomplace?: boolean;
  showKomship?: boolean;
  showKomtim?: boolean;
  showKomed?: boolean;
  showKomstore?: boolean;
  showKomerce?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showMore?: boolean;
  slotName?: any;
  type?:
    | "Text"
    | "Image Text"
    | "Image"
    | "Action"
    | "Badge"
    | "Stacked Text"
    | "Link"
    | "Checkbox"
    | "Toggle"
    | "Avatar Text"
    | "Status"
    | "Number"
    | "Action (Icon)"
    | "Product"
    | "Slot";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

const props = defineProps<TableCellValueProps>();
</script>