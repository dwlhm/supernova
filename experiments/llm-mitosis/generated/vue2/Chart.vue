<template>
  <div
    class="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-4 font-sans"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-gray-100"
    >
      <div>
        <h3 class="text-base font-semibold text-gray-900">{{ title }}</h3>
        <template v-if="Boolean(description)">
          <p class="text-xs text-gray-500 mt-0.5">{{ description }}</p>
        </template>
      </div>
      <template v-if="showLegend">
        <div class="flex items-center gap-2 text-xs text-gray-600 font-medium">
          <span class="inline-block w-3 h-3 rounded-sm bg-blue-500"></span
          ><span>{{ seriesLabel || "Series" }}</span>
        </div>
      </template>
    </div>
    <template v-if="canRenderChart">
      <div class="w-full">
        <svg
          viewBox="0 0 500 240"
          class="w-full h-auto overflow-visible select-none"
        >
          <template v-if="showGridLines">
            <template :key="String(y)" v-for="(y, index) in gridLines">
              <line
                stroke="#f1f5f9"
                strokeWidth="1"
                strokeDasharray="4 4"
                :x1="40"
                :y1="y"
                :x2="476"
                :y2="y"
              ></line>
            </template>
          </template>

          <line
            stroke="#cbd5e1"
            strokeWidth="1.5"
            :x1="40"
            :y1="zeroLineY"
            :x2="476"
            :y2="zeroLineY"
          ></line>
          <template v-if="variant === 'bar'">
            <template :key="pt.id" v-for="(pt, index) in computedPoints">
              <rect
                rx="4"
                :x="pt.x"
                :y="pt.y"
                :width="pt.width"
                :height="pt.height"
                :fill="pt.fillColor"
              ></rect>
            </template>
          </template>

          <template v-if="variant === 'line'">
            <path
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              :d="linePath"
            ></path>
            <template :key="pt.id" v-for="(pt, index) in computedPoints">
              <circle
                r="4.5"
                fill="#ffffff"
                stroke="#3b82f6"
                strokeWidth="2.5"
                :cx="pt.cx"
                :cy="pt.cy"
              ></circle>
            </template>
          </template>

          <template v-if="showDataLabels">
            <template
              :key="pt.id + '-label'"
              v-for="(pt, index) in computedPoints"
            >
              <text
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
                fontWeight="500"
                :x="pt.cx"
                :y="pt.labelY"
              >
                {{ pt.value }}
              </text>
            </template>
          </template>

          <template :key="pt.id + '-cat'" v-for="(pt, index) in computedPoints">
            <text
              textAnchor="middle"
              fontSize="11"
              fill="#475569"
              fontWeight="500"
              :x="pt.cx"
              :y="225"
            >
              {{ pt.label }}
            </text>
          </template>
        </svg>
        <table class="sr-only">
          <caption>
            {{
              title
            }}
            - Data Values
          </caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">{{ seriesLabel || "Value" }}</th>
            </tr>
          </thead>
          <tbody>
            <template :key="point.id" v-for="(point, index) in data">
              <tr>
                <td>{{ point.label }}</td>
                <td>{{ point.value }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </template>

    <template v-else>
      <div
        role="alert"
        class="p-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium text-center"
      >
        {{ errorMessage }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "chart",

  props: {
    variant: { default: "bar" },
    data: { default: undefined },
    title: { default: undefined },
    description: { default: undefined },
    showLegend: { default: true },
    seriesLabel: { default: undefined },
    showGridLines: { default: true },
    showDataLabels: { default: true },
  },

  computed: {
    isInvalidVariant() {
      return this.variant !== "bar" && this.variant !== "line";
    },
    isEmpty() {
      return !Array.isArray(this.data) || this.data.length === 0;
    },
    hasInvalidData() {
      if (!Array.isArray(this.data) || this.data.length === 0) {
        return false;
      }
      return this.data.some(
        (d) =>
          !d ||
          typeof d.value !== "number" ||
          !Number.isFinite(d.value) ||
          typeof d.label !== "string"
      );
    },
    errorMessage() {
      if (this.isInvalidVariant) {
        return (
          "Unsupported chart variant: " +
          String(this.variant) +
          ". Please select bar or line."
        );
      }
      if (this.isEmpty) {
        return "No chart data available to display.";
      }
      if (this.hasInvalidData) {
        return "Chart data contains invalid or non-finite values.";
      }
      return "";
    },
    canRenderChart() {
      return !this.isInvalidVariant && !this.isEmpty && !this.hasInvalidData;
    },
    bounds() {
      if (!this.canRenderChart) {
        return {
          min: 0,
          max: 100,
          zeroY: 120,
        };
      }
      const values = this.data.map((d) => d.value);
      let minVal = Math.min(...values);
      let maxVal = Math.max(...values);
      if (minVal === maxVal) {
        if (maxVal === 0) {
          minVal = -10;
          maxVal = 10;
        } else if (maxVal > 0) {
          minVal = 0;
          maxVal = maxVal * 1.25;
        } else {
          minVal = minVal * 1.25;
          maxVal = 0;
        }
      } else {
        if (minVal >= 0) {
          minVal = 0;
          maxVal = maxVal * 1.15;
        } else if (maxVal <= 0) {
          minVal = minVal * 1.15;
          maxVal = 0;
        } else {
          const padding = (maxVal - minVal) * 0.1;
          minVal = minVal - padding;
          maxVal = maxVal + padding;
        }
      }
      const range = maxVal - minVal || 1;
      const zeroY = 24 + 180 * ((maxVal - 0) / range);
      const clampedZeroY = Math.max(24, Math.min(204, zeroY));
      return {
        min: minVal,
        max: maxVal,
        range,
        zeroY: clampedZeroY,
      };
    },
    computedPoints() {
      if (!this.canRenderChart) return [];
      const { max, range, zeroY } = this.bounds;
      const count = this.data.length;
      const plotWidth = 436;
      const slotWidth = plotWidth / count;
      const barWidth = Math.max(8, Math.min(48, slotWidth * 0.6));
      return this.data.map((d, index) => {
        const cx = 40 + slotWidth * index + slotWidth / 2;
        const yVal = 24 + 180 * ((max - d.value) / range);
        const x = cx - barWidth / 2;
        let y = yVal;
        let height = Math.abs(zeroY - yVal);
        if (d.value < 0) {
          y = zeroY;
        }
        if (height < 2) {
          height = 2;
        }
        const isPositive = d.value >= 0;
        const labelY =
          this.variant === "bar"
            ? isPositive
              ? y - 6
              : y + height + 12
            : yVal - 8;
        return {
          id: d.id,
          label: d.label,
          value: d.value,
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          width: Number(barWidth.toFixed(2)),
          height: Number(height.toFixed(2)),
          cx: Number(cx.toFixed(2)),
          cy: Number(yVal.toFixed(2)),
          labelY: Number(labelY.toFixed(2)),
          fillColor: isPositive ? "#3b82f6" : "#ef4444",
        };
      });
    },
    linePath() {
      const pts = this.computedPoints;
      if (pts.length === 0) return "";
      let pathStr = "M " + pts[0].cx + " " + pts[0].cy;
      for (let i = 1; i < pts.length; i++) {
        pathStr = pathStr + " L " + pts[i].cx + " " + pts[i].cy;
      }
      return pathStr;
    },
    gridLines() {
      if (!this.canRenderChart) return [];
      const lines = [];
      const steps = 4;
      for (let i = 0; i <= steps; i++) {
        const y = 24 + (180 / steps) * i;
        lines.push(Number(y.toFixed(2)));
      }
      return lines;
    },
    zeroLineY() {
      return Number(this.bounds.zeroY.toFixed(2));
    },
  },
};
</script>