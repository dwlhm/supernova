// This file was generated automatically by Supernova Mitosis Exporter. Do not edit directly.

export const tokens = {
  "colors": {
    "black": "#000000",
    "white": "#ffffff",
    "colorBaseGray200": "#e5e7eb",
    "colorBaseGray300": "#d1d5db",
    "colorBaseGray500": "#6b7280",
    "colorBaseGray600": "#4b5563",
    "colorBaseGray700": "#374151",
    "colorBaseBlue200": "#bfdbfe",
    "colorBaseBlue300": "#93c5fd",
    "colorBaseBlue500": "#3b82f6",
    "colorBaseBlue600": "#2563eb",
    "colorBaseBlue700": "#1d4ed8",
    "colorBasePurple200": "#e9d5ff",
    "colorBasePurple300": "#d8b4fe",
    "colorBasePurple500": "#a855f7",
    "colorBasePurple600": "#9333ea",
    "colorBasePurple700": "#7e22ce",
    "colorBaseGreen200": "#bbf7d0",
    "colorBaseGreen300": "#86efac",
    "colorBaseGreen500": "#22c55e",
    "colorBaseGreen600": "#16a34a",
    "colorBaseGreen700": "#15803d",
    "page": "#ffffff",
    "colorBackgroundNeutral": "#f9fafb",
    "colorBackgroundPrimary": "#2563eb",
    "primaryHighlighted": "#1d4ed8",
    "colorBackgroundPrimaryFaded": "#dbeafe",
    "colorBackgroundSecondary": "#f3f4f6",
    "secondaryHighlighted": "#e5e7eb",
    "blur": "rgba(255, 255, 255, 0.8)",
    "blurNeutral": "rgba(243, 244, 246, 0.8)",
    "colorForegroundPrimary": "#ffffff",
    "colorForegroundSecondary": "#4b5563",
    "colorForegroundNeutral": "#111827",
    "neutralFaded": "#6b7280",
    "colorForegroundPositive": "#16a34a",
    "disabled": "#9ca3af",
    "colorBorderPrimary": "#2563eb",
    "colorBorderPrimaryFaded": "rgba(147, 197, 253, 0.5)",
    "colorBorderSecondary": "#e5e7eb",
    "secondaryFaded": "rgba(243, 244, 246, 0.6)",
    "colorBorderNeutral": "#d1d5db",
    "focus": "#3b82f6",
    "colorBorderPositive": "#22c55e",
    "positiveFaded": "rgba(134, 239, 172, 0.5)"
  },
  "typography": {
    "heading1": {
      "fontFamily": "Inter",
      "fontSize": "36px",
      "fontWeight": "600",
      "lineHeight": "44px",
      "letterSpacing": "0px"
    },
    "heading2": {
      "fontFamily": "Inter",
      "fontSize": "28px",
      "fontWeight": "600",
      "lineHeight": "36px",
      "letterSpacing": "0px"
    },
    "heading3": {
      "fontFamily": "Inter",
      "fontSize": "18px",
      "fontWeight": "600",
      "lineHeight": "28px",
      "letterSpacing": "0px"
    },
    "body1": {
      "fontFamily": "Inter",
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": "24px",
      "letterSpacing": "0px"
    },
    "body2": {
      "fontFamily": "Inter",
      "fontSize": "14px",
      "fontWeight": "500",
      "lineHeight": "20px",
      "letterSpacing": "0px"
    },
    "body3": {
      "fontFamily": "Inter",
      "fontSize": "12px",
      "fontWeight": "400",
      "lineHeight": "16px",
      "letterSpacing": "0px"
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px"
  },
  "radii": {
    "none": "0px",
    "sm": "4px",
    "md": "8px",
    "lg": "16px",
    "full": "9999px"
  },
  "shadows": {
    "raised": "0px 1px 3px -1px rgba(0, 0, 0, 0.1), 0px 2px 3px -3px rgba(0, 0, 0, 0.1)",
    "overlay": "0px 15px 25px 0px rgba(0, 0, 0, 0.15), 0px 5px 10px 0px rgba(0, 0, 0, 0.1)"
  },
  "borders": {
    "subtle": {
      "width": "1px",
      "style": "solid",
      "color": "#e5e7eb"
    },
    "focus": {
      "width": "2px",
      "style": "solid",
      "color": "#2563eb"
    }
  }
} as const;

export type Tokens = typeof tokens;
export default tokens;
