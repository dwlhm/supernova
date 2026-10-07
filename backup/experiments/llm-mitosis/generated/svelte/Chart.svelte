<script context="module" lang="ts">
  export interface ChartDataPoint {
    id: string;
    label: string;
    value: number;
  }

  export interface ChartProps {
    title: string;
    description?: string;
    seriesLabel?: string;
    variant?: "bar" | "line";
    data: ChartDataPoint[];
    showLegend?: boolean;
    showGridLines?: boolean;
    showDataLabels?: boolean;
  }
</script>

<script lang="ts">
  export let variant: ChartProps["variant"] = "bar";
  export let data: ChartProps["data"];
  export let title: ChartProps["title"];
  export let description: ChartProps["description"];
  export let showLegend: ChartProps["showLegend"] = true;
  export let seriesLabel: ChartProps["seriesLabel"];
  export let showGridLines: ChartProps["showGridLines"] = true;
  export let showDataLabels: ChartProps["showDataLabels"] = true;

  $: isInvalidVariant = () => {
    return variant !== "bar" && variant !== "line";
  };
  $: isEmpty = () => {
    return !Array.isArray(data) || data.length === 0;
  };
  $: hasInvalidData = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }
    return data.some(
      (d) =>
        !d ||
        typeof d.value !== "number" ||
        !Number.isFinite(d.value) ||
        typeof d.label !== "string"
    );
  };
  $: errorMessage = () => {
    if (isInvalidVariant()) {
      return (
        "Unsupported chart variant: " +
        String(variant) +
        ". Please select bar or line."
      );
    }
    if (isEmpty()) {
      return "No chart data available to display.";
    }
    if (hasInvalidData()) {
      return "Chart data contains invalid or non-finite values.";
    }
    return "";
  };
  $: canRenderChart = () => {
    return !isInvalidVariant() && !isEmpty() && !hasInvalidData();
  };
  $: bounds = () => {
    if (!canRenderChart()) {
      return {
        min: 0,
        max: 100,
        zeroY: 120,
      };
    }
    const values = data.map((d) => d.value);
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
  };
  $: computedPoints = () => {
    if (!canRenderChart()) return [];
    const { max, range, zeroY } = bounds();
    const count = data.length;
    const plotWidth = 436;
    const slotWidth = plotWidth / count;
    const barWidth = Math.max(8, Math.min(48, slotWidth * 0.6));
    return data.map((d, index) => {
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
        variant === "bar" ? (isPositive ? y - 6 : y + height + 12) : yVal - 8;
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
  };
  $: linePath = () => {
    const pts = computedPoints();
    if (pts.length === 0) return "";
    let pathStr = "M " + pts[0].cx + " " + pts[0].cy;
    for (let i = 1; i < pts.length; i++) {
      pathStr = pathStr + " L " + pts[i].cx + " " + pts[i].cy;
    }
    return pathStr;
  };
  $: gridLines = () => {
    if (!canRenderChart()) return [];
    const lines = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const y = 24 + (180 / steps) * i;
      lines.push(Number(y.toFixed(2)));
    }
    return lines;
  };
  $: zeroLineY = () => {
    return Number(bounds().zeroY.toFixed(2));
  };
</script>

<div
  class="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-4 font-sans"
>
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-gray-100"
  >
    <div>
      <h3 class="text-base font-semibold text-gray-900">{title}</h3>
      {#if Boolean(description)}
        <p class="text-xs text-gray-500 mt-0.5">{description}</p>
      {/if}
    </div>
    {#if showLegend}
      <div class="flex items-center gap-2 text-xs text-gray-600 font-medium">
        <span class="inline-block w-3 h-3 rounded-sm bg-blue-500" /><span
          >{seriesLabel || "Series"}</span
        >
      </div>
    {/if}
  </div>
  {#if canRenderChart()}
    <div class="w-full">
      <svg
        viewBox="0 0 500 240"
        class="w-full h-auto overflow-visible select-none"
      >
        {#if showGridLines}
          {#each gridLines() as y (String(y))}
            <line
              stroke="#f1f5f9"
              strokeWidth="1"
              strokeDasharray="4 4"
              x1={40}
              y1={y}
              x2={476}
              y2={y}
            />
          {/each}
        {/if}<line
          stroke="#cbd5e1"
          strokeWidth="1.5"
          x1={40}
          y1={zeroLineY()}
          x2={476}
          y2={zeroLineY()}
        />
        {#if variant === "bar"}
          {#each computedPoints() as pt (pt.id)}
            <rect
              rx="4"
              x={pt.x}
              y={pt.y}
              width={pt.width}
              height={pt.height}
              fill={pt.fillColor}
            />
          {/each}
        {/if}
        {#if variant === "line"}
          <path
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d={linePath()}
          />

          {#each computedPoints() as pt (pt.id)}
            <circle
              r="4.5"
              fill="#ffffff"
              stroke="#3b82f6"
              strokeWidth="2.5"
              cx={pt.cx}
              cy={pt.cy}
            />
          {/each}
        {/if}
        {#if showDataLabels}
          {#each computedPoints() as pt (pt.id + "-label")}
            <text
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
              fontWeight="500"
              x={pt.cx}
              y={pt.labelY}>{pt.value}</text
            >
          {/each}
        {/if}
        {#each computedPoints() as pt (pt.id + "-cat")}
          <text
            textAnchor="middle"
            fontSize="11"
            fill="#475569"
            fontWeight="500"
            x={pt.cx}
            y={225}>{pt.label}</text
          >
        {/each}
      </svg>
      <table class="sr-only">
        <caption>{title} - Data Values</caption><thead
          ><tr
            ><th scope="col">Category</th><th scope="col"
              >{seriesLabel || "Value"}</th
            ></tr
          ></thead
        ><tbody>
          {#each data as point (point.id)}
            <tr><td>{point.label}</td><td>{point.value}</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div
      role="alert"
      class="p-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium text-center"
    >
      {errorMessage()}
    </div>
  {/if}
</div>