<template>
  <button
    type="button"
    :disabled="disabled"
    :class="classes"
    @click="async (event) => handleClick(event)"
  >
    {{ label }}
  </button>
</template>

<script>
export default {
  name: "button",

  props: {
    size: { default: "medium" },
    fullWidth: { default: false },
    variant: { default: "primary" },
    styleType: { default: "solid" },
    onClick: { default: undefined },
    disabled: { default: false },
    label: { default: undefined },
  },

  computed: {
    classes() {
      const base =
        "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";
      const sizeCls =
        this.size === "small"
          ? "h-8 px-3 text-xs rounded-md gap-1.5"
          : "h-10 px-4 text-sm rounded-lg gap-2";
      const widthCls = this.fullWidth ? "w-full" : "";
      let colorCls = "";
      const variant = this.variant || "primary";
      const styleType = this.styleType || "solid";
      if (variant === "primary") {
        if (styleType === "outline") {
          colorCls =
            "border border-blue-600 text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500";
        } else if (styleType === "ghost") {
          colorCls =
            "text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500";
        } else {
          colorCls =
            "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500";
        }
      } else if (variant === "secondary") {
        if (styleType === "outline") {
          colorCls =
            "border border-purple-600 text-purple-600 hover:bg-purple-50 focus-visible:ring-purple-500";
        } else if (styleType === "ghost") {
          colorCls =
            "text-purple-600 hover:bg-purple-50 focus-visible:ring-purple-500";
        } else {
          colorCls =
            "bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500";
        }
      } else if (variant === "positive") {
        if (styleType === "outline") {
          colorCls =
            "border border-green-600 text-green-600 hover:bg-green-50 focus-visible:ring-green-500";
        } else if (styleType === "ghost") {
          colorCls =
            "text-green-600 hover:bg-green-50 focus-visible:ring-green-500";
        } else {
          colorCls =
            "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500";
        }
      } else if (variant === "gradient") {
        if (styleType === "outline") {
          colorCls =
            "border-2 border-purple-600 text-purple-600 hover:bg-purple-50 focus-visible:ring-purple-500";
        } else if (styleType === "ghost") {
          colorCls =
            "text-purple-600 hover:bg-purple-50 focus-visible:ring-purple-500";
        } else {
          colorCls =
            "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:opacity-95 focus-visible:ring-purple-500";
        }
      }
      return [base, sizeCls, widthCls, colorCls].filter(Boolean).join(" ");
    },
  },

  methods: {
    handleClick(event) {
      if (this.onClick && !this.disabled) {
        this.onClick(event);
      }
    },
  },
};
</script>