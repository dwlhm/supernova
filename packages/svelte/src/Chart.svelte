<script context="module" lang="ts">
  export interface ChartProps {
    showTitle?: boolean;
    showDescription?: boolean;
    showLegend?: boolean;
    showGridLines?: boolean;
    showDataLabels?: boolean;
    titleText?: string;
    descriptionText?: string;
    content2?: any;
    content3?: any;
    content4?: any;
    content5?: any;
    content6?: any;
    content7?: any;
    content8?: any;
    content9?: any;
    content10?: any;
    content11?: any;
    content?: any;
    type?:
      | "Bar"
      | "Line"
      | "Area"
      | "Donut"
      | "Pie"
      | "Stacked Bar"
      | "Horizontal Bar"
      | "Scatter"
      | "Radar"
      | "Gauge"
      | "Funnel"
      | "Waterfall";
    children?: any;
    className?: string;
    id?: string;
    ariaDescribedby?: string;
    y200?: string;
    y150?: string;
    y100?: string;
    y50?: string;
    y0?: string;
    dataLabel?: string;
    dataLabel2?: string;
    dataLabel3?: string;
    dataLabel4?: string;
    dataLabel5?: string;
    dataLabel6?: string;
    dataLabel7?: string;
    xMon?: string;
    xTue?: string;
    xWed?: string;
    xThu?: string;
    xFri?: string;
    xSat?: string;
    xSun?: string;
    label?: string;
    label2?: string;
    label3?: string;
    label4?: string;
    label5?: string;
  }
</script>

<script lang="ts">
  export let id: ChartProps["id"];
  export let ariaDescribedby: ChartProps["ariaDescribedby"];
  export let type: ChartProps["type"];
  export let className: ChartProps["className"];
  export let showTitle: ChartProps["showTitle"];
  export let titleText: ChartProps["titleText"];
  export let showDescription: ChartProps["showDescription"];
  export let descriptionText: ChartProps["descriptionText"];
  export let y200: ChartProps["y200"];
  export let y150: ChartProps["y150"];
  export let y100: ChartProps["y100"];
  export let y50: ChartProps["y50"];
  export let y0: ChartProps["y0"];
  export let showGridLines: ChartProps["showGridLines"];
  export let showDataLabels: ChartProps["showDataLabels"];
  export let dataLabel: ChartProps["dataLabel"];
  export let dataLabel2: ChartProps["dataLabel2"];
  export let dataLabel3: ChartProps["dataLabel3"];
  export let dataLabel4: ChartProps["dataLabel4"];
  export let dataLabel5: ChartProps["dataLabel5"];
  export let dataLabel6: ChartProps["dataLabel6"];
  export let dataLabel7: ChartProps["dataLabel7"];
  export let xMon: ChartProps["xMon"];
  export let xTue: ChartProps["xTue"];
  export let xWed: ChartProps["xWed"];
  export let xThu: ChartProps["xThu"];
  export let xFri: ChartProps["xFri"];
  export let xSat: ChartProps["xSat"];
  export let xSun: ChartProps["xSun"];
  export let showLegend: ChartProps["showLegend"];
  export let label: ChartProps["label"];
  export let label2: ChartProps["label2"];
  export let label3: ChartProps["label3"];
  export let label4: ChartProps["label4"];
  export let label5: ChartProps["label5"];
</script>

<div
  {id}
  aria-describedby={ariaDescribedby}
  class={"flex flex-col gap-4 p-5 rounded-lg shadow-sm " +
    (type === "Line"
      ? "bg-background-page border border-[#f5f5f5]"
      : type === "Area"
      ? "bg-background-page border border-[#f5f5f5]"
      : type === "Donut"
      ? "bg-background-page border border-[#f5f5f5]"
      : type === "Pie"
      ? "bg-background-page border border-[#f5f5f5]"
      : type === "Stacked Bar"
      ? "bg-background-page border border-[#f5f5f5]"
      : type === "Horizontal Bar"
      ? "bg-background-page border border-[#f5f5f5]"
      : type === "Scatter"
      ? "bg-background-page border border-[#f5f5f5]"
      : type === "Radar"
      ? "bg-background-page border border-[#f5f5f5]"
      : type === "Gauge"
      ? "bg-background-page border border-[#f5f5f5]"
      : type === "Funnel"
      ? "bg-background-page border border-[#f5f5f5]"
      : type === "Waterfall"
      ? "bg-background-page border border-[#f5f5f5]"
      : "bg-background-page border border-[#f5f5f5]") +
    (className ? " " + className : "")}
>
  <div class="flex flex-col gap-1 w-full">
    {#if showTitle !== false}
      <h3 class="text-base font-semibold text-[#0a0a0a]">
        {titleText ?? "Revenue Overview"}
      </h3>
    {/if}
    {#if showDescription !== false}
      <p class="text-sm font-normal text-[#737373]">
        {descriptionText ?? "Weekly revenue breakdown by day"}
      </p>
    {/if}
  </div>
  <div class="flex flex-col gap-2 w-full">
    <div class="flex flex-row gap-2 items-end w-full">
      <div class="flex flex-col justify-between">
        <p class="text-xs font-normal text-right text-[#525252]">
          {y200 ?? "200"}
        </p>
        <p class="text-xs font-normal text-right text-[#525252]">
          {y150 ?? "150"}
        </p>
        <p class="text-xs font-normal text-right text-[#525252]">
          {y100 ?? "100"}
        </p>
        <span class="text-xs font-normal text-right text-[#525252]"
          >{y50 ?? "50"}</span
        ><span class="text-xs font-normal text-right text-[#525252]"
          >{y0 ?? "0"}</span
        >
      </div>
      <div class="flex flex-col w-full flex-1">
        {#if showGridLines !== false}
          <div class="bg-[#f5f5f5]" />
        {/if}
        {#if showGridLines !== false}
          <div class="bg-[#f5f5f5]" />
        {/if}
        {#if showGridLines !== false}
          <div class="bg-[#f5f5f5]" />
        {/if}
        {#if showGridLines !== false}
          <div class="bg-[#f5f5f5]" />
        {/if}
        {#if showGridLines !== false}
          <div class="bg-[#f5f5f5]" />
        {/if}
        <div class="flex flex-row gap-3 px-2 items-end">
          <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
            {#if showDataLabels !== false}
              <p class="text-xs font-medium text-[#0a0a0a]">
                {dataLabel ?? "120"}
              </p>
            {/if}
          </div>
          <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
            {#if showDataLabels !== false}
              <span class="text-xs font-medium text-[#0a0a0a]"
                >{dataLabel2 ?? "80"}</span
              >
            {/if}
          </div>
          <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
            {#if showDataLabels !== false}
              <p class="text-xs font-medium text-[#0a0a0a]">
                {dataLabel3 ?? "160"}
              </p>
            {/if}
          </div>
          <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
            {#if showDataLabels !== false}
              <p class="text-xs font-medium text-[#0a0a0a]">
                {dataLabel4 ?? "100"}
              </p>
            {/if}
          </div>
          <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
            {#if showDataLabels !== false}
              <p class="text-xs font-medium text-[#0a0a0a]">
                {dataLabel5 ?? "140"}
              </p>
            {/if}
          </div>
          <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
            {#if showDataLabels !== false}
              <span class="text-xs font-medium text-[#0a0a0a]"
                >{dataLabel6 ?? "60"}</span
              >
            {/if}
          </div>
          <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
            {#if showDataLabels !== false}
              <p class="text-xs font-medium text-[#0a0a0a]">
                {dataLabel7 ?? "130"}
              </p>
            {/if}
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row gap-2 w-full">
      <div />
      <div class="flex flex-row justify-between w-full flex-1">
        <p class="text-xs font-normal text-center text-[#525252]">
          {xMon ?? "Mon"}
        </p>
        <p class="text-xs font-normal text-center text-[#525252]">
          {xTue ?? "Tue"}
        </p>
        <p class="text-xs font-normal text-center text-[#525252]">
          {xWed ?? "Wed"}
        </p>
        <p class="text-xs font-normal text-center text-[#525252]">
          {xThu ?? "Thu"}
        </p>
        <p class="text-xs font-normal text-center text-[#525252]">
          {xFri ?? "Fri"}
        </p>
        <p class="text-xs font-normal text-center text-[#525252]">
          {xSat ?? "Sat"}
        </p>
        <p class="text-xs font-normal text-center text-[#525252]">
          {xSun ?? "Sun"}
        </p>
      </div>
    </div>
  </div>
  {#if showLegend !== false}
    <div class="flex flex-row gap-4 w-full">
      <div class="flex flex-row gap-2 items-center">
        <div class="rounded-full bg-[#3b82f6]" />
        <p class="text-xs font-normal text-[#737373]">{label ?? "Series 1"}</p>
      </div>
      <div class="flex flex-row gap-2 items-center">
        <div class="rounded-full bg-[#06b6d4]" />
        <p class="text-xs font-normal text-[#737373]">{label2 ?? "Series 2"}</p>
      </div>
      <div class="flex flex-row gap-2 items-center">
        <div class="rounded-full bg-[#8b5cf6]" />
        <p class="text-xs font-normal text-[#737373]">{label3 ?? "Series 3"}</p>
      </div>
      <div class="flex flex-row gap-2 items-center">
        <div class="rounded-full bg-[#f59e0b]" />
        <p class="text-xs font-normal text-[#737373]">{label4 ?? "Series 4"}</p>
      </div>
      <div class="flex flex-row gap-2 items-center">
        <div class="rounded-full bg-[#ec4899]" />
        <p class="text-xs font-normal text-[#737373]">{label5 ?? "Series 5"}</p>
      </div>
    </div>
  {/if}
  <div class="w-full" />
  <slot />
</div>