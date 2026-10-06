<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-col gap-4 p-5 rounded-lg shadow-sm ' +
      (type === 'Line'
        ? 'bg-background-page border border-[#f5f5f5]'
        : type === 'Area'
        ? 'bg-background-page border border-[#f5f5f5]'
        : type === 'Donut'
        ? 'bg-background-page border border-[#f5f5f5]'
        : type === 'Pie'
        ? 'bg-background-page border border-[#f5f5f5]'
        : type === 'Stacked Bar'
        ? 'bg-background-page border border-[#f5f5f5]'
        : type === 'Horizontal Bar'
        ? 'bg-background-page border border-[#f5f5f5]'
        : type === 'Scatter'
        ? 'bg-background-page border border-[#f5f5f5]'
        : type === 'Radar'
        ? 'bg-background-page border border-[#f5f5f5]'
        : type === 'Gauge'
        ? 'bg-background-page border border-[#f5f5f5]'
        : type === 'Funnel'
        ? 'bg-background-page border border-[#f5f5f5]'
        : type === 'Waterfall'
        ? 'bg-background-page border border-[#f5f5f5]'
        : 'bg-background-page border border-[#f5f5f5]') +
      (className ? ' ' + className : '')
    "
  >
    <div class="flex flex-col gap-1 w-full">
      <template v-if="showTitle !== false">
        <h3 class="text-base font-semibold text-[#0a0a0a]">
          {{ titleText ?? "Revenue Overview" }}
        </h3>
      </template>

      <template v-if="showDescription !== false">
        <p class="text-sm font-normal text-[#737373]">
          {{ descriptionText ?? "Weekly revenue breakdown by day" }}
        </p>
      </template>
    </div>
    <div class="flex flex-col gap-2 w-full">
      <div class="flex flex-row gap-2 items-end w-full">
        <div class="flex flex-col justify-between">
          <p class="text-xs font-normal text-right text-[#525252]">
            {{ y200 ?? "200" }}
          </p>
          <p class="text-xs font-normal text-right text-[#525252]">
            {{ y150 ?? "150" }}
          </p>
          <p class="text-xs font-normal text-right text-[#525252]">
            {{ y100 ?? "100" }}
          </p>
          <span class="text-xs font-normal text-right text-[#525252]">{{
            y50 ?? "50"
          }}</span
          ><span class="text-xs font-normal text-right text-[#525252]">{{
            y0 ?? "0"
          }}</span>
        </div>
        <div class="flex flex-col w-full flex-1">
          <template v-if="showGridLines !== false">
            <div class="bg-[#f5f5f5]"></div>
          </template>

          <template v-if="showGridLines !== false">
            <div class="bg-[#f5f5f5]"></div>
          </template>

          <template v-if="showGridLines !== false">
            <div class="bg-[#f5f5f5]"></div>
          </template>

          <template v-if="showGridLines !== false">
            <div class="bg-[#f5f5f5]"></div>
          </template>

          <template v-if="showGridLines !== false">
            <div class="bg-[#f5f5f5]"></div>
          </template>

          <div class="flex flex-row gap-3 px-2 items-end">
            <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
              <template v-if="showDataLabels !== false">
                <p class="text-xs font-medium text-[#0a0a0a]">
                  {{ dataLabel ?? "120" }}
                </p>
              </template>
            </div>
            <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
              <template v-if="showDataLabels !== false">
                <span class="text-xs font-medium text-[#0a0a0a]">{{
                  dataLabel2 ?? "80"
                }}</span>
              </template>
            </div>
            <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
              <template v-if="showDataLabels !== false">
                <p class="text-xs font-medium text-[#0a0a0a]">
                  {{ dataLabel3 ?? "160" }}
                </p>
              </template>
            </div>
            <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
              <template v-if="showDataLabels !== false">
                <p class="text-xs font-medium text-[#0a0a0a]">
                  {{ dataLabel4 ?? "100" }}
                </p>
              </template>
            </div>
            <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
              <template v-if="showDataLabels !== false">
                <p class="text-xs font-medium text-[#0a0a0a]">
                  {{ dataLabel5 ?? "140" }}
                </p>
              </template>
            </div>
            <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
              <template v-if="showDataLabels !== false">
                <span class="text-xs font-medium text-[#0a0a0a]">{{
                  dataLabel6 ?? "60"
                }}</span>
              </template>
            </div>
            <div class="flex flex-col bg-[#3b82f6] w-full flex-1">
              <template v-if="showDataLabels !== false">
                <p class="text-xs font-medium text-[#0a0a0a]">
                  {{ dataLabel7 ?? "130" }}
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row gap-2 w-full">
        <div></div>
        <div class="flex flex-row justify-between w-full flex-1">
          <p class="text-xs font-normal text-center text-[#525252]">
            {{ xMon ?? "Mon" }}
          </p>
          <p class="text-xs font-normal text-center text-[#525252]">
            {{ xTue ?? "Tue" }}
          </p>
          <p class="text-xs font-normal text-center text-[#525252]">
            {{ xWed ?? "Wed" }}
          </p>
          <p class="text-xs font-normal text-center text-[#525252]">
            {{ xThu ?? "Thu" }}
          </p>
          <p class="text-xs font-normal text-center text-[#525252]">
            {{ xFri ?? "Fri" }}
          </p>
          <p class="text-xs font-normal text-center text-[#525252]">
            {{ xSat ?? "Sat" }}
          </p>
          <p class="text-xs font-normal text-center text-[#525252]">
            {{ xSun ?? "Sun" }}
          </p>
        </div>
      </div>
    </div>
    <template v-if="showLegend !== false">
      <div class="flex flex-row gap-4 w-full">
        <div class="flex flex-row gap-2 items-center">
          <div class="rounded-full bg-[#3b82f6]"></div>
          <p class="text-xs font-normal text-[#737373]">
            {{ label ?? "Series 1" }}
          </p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <div class="rounded-full bg-[#06b6d4]"></div>
          <p class="text-xs font-normal text-[#737373]">
            {{ label2 ?? "Series 2" }}
          </p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <div class="rounded-full bg-[#8b5cf6]"></div>
          <p class="text-xs font-normal text-[#737373]">
            {{ label3 ?? "Series 3" }}
          </p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <div class="rounded-full bg-[#f59e0b]"></div>
          <p class="text-xs font-normal text-[#737373]">
            {{ label4 ?? "Series 4" }}
          </p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <div class="rounded-full bg-[#ec4899]"></div>
          <p class="text-xs font-normal text-[#737373]">
            {{ label5 ?? "Series 5" }}
          </p>
        </div>
      </div>
    </template>

    <div class="w-full"></div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "chart",

  props: [
    "id",
    "ariaDescribedby",
    "type",
    "className",
    "showTitle",
    "titleText",
    "showDescription",
    "descriptionText",
    "y200",
    "y150",
    "y100",
    "y50",
    "y0",
    "showGridLines",
    "showDataLabels",
    "dataLabel",
    "dataLabel2",
    "dataLabel3",
    "dataLabel4",
    "dataLabel5",
    "dataLabel6",
    "dataLabel7",
    "xMon",
    "xTue",
    "xWed",
    "xThu",
    "xFri",
    "xSat",
    "xSun",
    "showLegend",
    "label",
    "label2",
    "label3",
    "label4",
    "label5",
  ],
};
</script>