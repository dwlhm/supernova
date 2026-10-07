<template>
  <div role="img" :class="classes" :aria-label="accessibleLabel">
    <template v-if="Boolean(src)">
      <img
        class="w-full h-full object-cover"
        :src="src"
        :alt="accessibleLabel"
      />
    </template>

    <template v-else>
      <span>{{ initialsText }}</span>
    </template>
  </div>
</template>

<script>
export default {
  name: "avatar",

  props: {
    initials: { default: "" },
    name: { default: "" },
    shape: { default: "round" },
    size: { default: "medium" },
    color: { default: "primary" },
    alt: { default: "" },
    src: { default: undefined },
  },

  computed: {
    initialsText() {
      if (this.initials && this.initials.trim()) {
        return this.initials.trim().slice(0, 2).toUpperCase();
      }
      if (this.name && this.name.trim()) {
        const parts = this.name.trim().split(/\s+/);
        if (parts.length >= 2) {
          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0].slice(0, 2).toUpperCase();
      }
      return "?";
    },
    classes() {
      const base =
        "inline-flex items-center justify-center font-medium text-white overflow-hidden select-none shrink-0";
      const shapeCls = this.shape === "square" ? "rounded-lg" : "rounded-full";
      const sizeCls =
        this.size === "small" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
      let colorCls = "bg-blue-600";
      if (this.color === "secondary") {
        colorCls = "bg-purple-600";
      } else if (this.color === "positive") {
        colorCls = "bg-green-600";
      }
      return [base, shapeCls, sizeCls, colorCls].join(" ");
    },
    accessibleLabel() {
      return this.alt || this.name || "User avatar";
    },
  },
};
</script>