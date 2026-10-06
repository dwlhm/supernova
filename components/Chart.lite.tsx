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
  type?: "Bar" | "Line" | "Area" | "Donut" | "Pie" | "Stacked Bar" | "Horizontal Bar" | "Scatter" | "Radar" | "Gauge" | "Funnel" | "Waterfall";
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

export default function Chart(props: ChartProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-col gap-4 p-5 rounded-lg shadow-sm " + (props.type === 'Line' ? 'bg-background-page border border-[#f5f5f5]' : props.type === 'Area' ? 'bg-background-page border border-[#f5f5f5]' : props.type === 'Donut' ? 'bg-background-page border border-[#f5f5f5]' : props.type === 'Pie' ? 'bg-background-page border border-[#f5f5f5]' : props.type === 'Stacked Bar' ? 'bg-background-page border border-[#f5f5f5]' : props.type === 'Horizontal Bar' ? 'bg-background-page border border-[#f5f5f5]' : props.type === 'Scatter' ? 'bg-background-page border border-[#f5f5f5]' : props.type === 'Radar' ? 'bg-background-page border border-[#f5f5f5]' : props.type === 'Gauge' ? 'bg-background-page border border-[#f5f5f5]' : props.type === 'Funnel' ? 'bg-background-page border border-[#f5f5f5]' : props.type === 'Waterfall' ? 'bg-background-page border border-[#f5f5f5]' : 'bg-background-page border border-[#f5f5f5]') + (props.className ? " " + props.className : "")}>
      <div className="flex flex-col gap-1 w-full">
        {props.showTitle !== false && (
          <h3 className="text-base font-semibold text-[#0a0a0a]">{props.titleText ?? "Revenue Overview"}</h3>
        )}
        {props.showDescription !== false && (
          <p className="text-sm font-normal text-[#737373]">{props.descriptionText ?? "Weekly revenue breakdown by day"}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row gap-2 items-end w-full">
          <div className="flex flex-col justify-between">
            <p className="text-xs font-normal text-right text-[#525252]">{props.y200 ?? "200"}</p>
            <p className="text-xs font-normal text-right text-[#525252]">{props.y150 ?? "150"}</p>
            <p className="text-xs font-normal text-right text-[#525252]">{props.y100 ?? "100"}</p>
            <span className="text-xs font-normal text-right text-[#525252]">{props.y50 ?? "50"}</span>
            <span className="text-xs font-normal text-right text-[#525252]">{props.y0 ?? "0"}</span>
          </div>
          <div className="flex flex-col w-full flex-1">
            {props.showGridLines !== false && (
              <div className="bg-[#f5f5f5]" />
            )}
            {props.showGridLines !== false && (
              <div className="bg-[#f5f5f5]" />
            )}
            {props.showGridLines !== false && (
              <div className="bg-[#f5f5f5]" />
            )}
            {props.showGridLines !== false && (
              <div className="bg-[#f5f5f5]" />
            )}
            {props.showGridLines !== false && (
              <div className="bg-[#f5f5f5]" />
            )}
            <div className="flex flex-row gap-3 px-2 items-end">
              <div className="flex flex-col bg-[#3b82f6] w-full flex-1">
                {props.showDataLabels !== false && (
                  <p className="text-xs font-medium text-[#0a0a0a]">{props.dataLabel ?? "120"}</p>
                )}
              </div>
              <div className="flex flex-col bg-[#3b82f6] w-full flex-1">
                {props.showDataLabels !== false && (
                  <span className="text-xs font-medium text-[#0a0a0a]">{props.dataLabel2 ?? "80"}</span>
                )}
              </div>
              <div className="flex flex-col bg-[#3b82f6] w-full flex-1">
                {props.showDataLabels !== false && (
                  <p className="text-xs font-medium text-[#0a0a0a]">{props.dataLabel3 ?? "160"}</p>
                )}
              </div>
              <div className="flex flex-col bg-[#3b82f6] w-full flex-1">
                {props.showDataLabels !== false && (
                  <p className="text-xs font-medium text-[#0a0a0a]">{props.dataLabel4 ?? "100"}</p>
                )}
              </div>
              <div className="flex flex-col bg-[#3b82f6] w-full flex-1">
                {props.showDataLabels !== false && (
                  <p className="text-xs font-medium text-[#0a0a0a]">{props.dataLabel5 ?? "140"}</p>
                )}
              </div>
              <div className="flex flex-col bg-[#3b82f6] w-full flex-1">
                {props.showDataLabels !== false && (
                  <span className="text-xs font-medium text-[#0a0a0a]">{props.dataLabel6 ?? "60"}</span>
                )}
              </div>
              <div className="flex flex-col bg-[#3b82f6] w-full flex-1">
                {props.showDataLabels !== false && (
                  <p className="text-xs font-medium text-[#0a0a0a]">{props.dataLabel7 ?? "130"}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2 w-full">
          <div />
          <div className="flex flex-row justify-between w-full flex-1">
            <p className="text-xs font-normal text-center text-[#525252]">{props.xMon ?? "Mon"}</p>
            <p className="text-xs font-normal text-center text-[#525252]">{props.xTue ?? "Tue"}</p>
            <p className="text-xs font-normal text-center text-[#525252]">{props.xWed ?? "Wed"}</p>
            <p className="text-xs font-normal text-center text-[#525252]">{props.xThu ?? "Thu"}</p>
            <p className="text-xs font-normal text-center text-[#525252]">{props.xFri ?? "Fri"}</p>
            <p className="text-xs font-normal text-center text-[#525252]">{props.xSat ?? "Sat"}</p>
            <p className="text-xs font-normal text-center text-[#525252]">{props.xSun ?? "Sun"}</p>
          </div>
        </div>
      </div>
      {props.showLegend !== false && (
        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-row gap-2 items-center">
            <div className="rounded-full bg-[#3b82f6]" />
            <p className="text-xs font-normal text-[#737373]">{props.label ?? "Series 1"}</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="rounded-full bg-[#06b6d4]" />
            <p className="text-xs font-normal text-[#737373]">{props.label2 ?? "Series 2"}</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="rounded-full bg-[#8b5cf6]" />
            <p className="text-xs font-normal text-[#737373]">{props.label3 ?? "Series 3"}</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="rounded-full bg-[#f59e0b]" />
            <p className="text-xs font-normal text-[#737373]">{props.label4 ?? "Series 4"}</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="rounded-full bg-[#ec4899]" />
            <p className="text-xs font-normal text-[#737373]">{props.label5 ?? "Series 5"}</p>
          </div>
        </div>
      )}
      <div className="w-full" />
      {props.children}
    </div>
  );
}
