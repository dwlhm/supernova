import * as React from "react";

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

function Chart(props: ChartProps) {
  props = {
    variant: "bar",
    showLegend: true,
    showGridLines: true,
    showDataLabels: true,
    ...props,
  };
  function isInvalidVariant() {
    return props.variant !== "bar" && props.variant !== "line";
  }

  function isEmpty() {
    return !Array.isArray(props.data) || props.data.length === 0;
  }

  function hasInvalidData() {
    if (!Array.isArray(props.data) || props.data.length === 0) {
      return false;
    }
    return props.data.some(
      (d) =>
        !d ||
        typeof d.value !== "number" ||
        !Number.isFinite(d.value) ||
        typeof d.label !== "string"
    );
  }

  function errorMessage() {
    if (isInvalidVariant()) {
      return (
        "Unsupported chart variant: " +
        String(props.variant) +
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
  }

  function canRenderChart() {
    return !isInvalidVariant() && !isEmpty() && !hasInvalidData();
  }

  function bounds() {
    if (!canRenderChart()) {
      return {
        min: 0,
        max: 100,
        zeroY: 120,
      };
    }
    const values = props.data.map((d) => d.value);
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
  }

  function computedPoints() {
    if (!canRenderChart()) return [];
    const { max, range, zeroY } = bounds();
    const count = props.data.length;
    const plotWidth = 436;
    const slotWidth = plotWidth / count;
    const barWidth = Math.max(8, Math.min(48, slotWidth * 0.6));
    return props.data.map((d, index) => {
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
        props.variant === "bar"
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
  }

  function linePath() {
    const pts = computedPoints();
    if (pts.length === 0) return "";
    let pathStr = "M " + pts[0].cx + " " + pts[0].cy;
    for (let i = 1; i < pts.length; i++) {
      pathStr = pathStr + " L " + pts[i].cx + " " + pts[i].cy;
    }
    return pathStr;
  }

  function gridLines() {
    if (!canRenderChart()) return [];
    const lines = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const y = 24 + (180 / steps) * i;
      lines.push(Number(y.toFixed(2)));
    }
    return lines;
  }

  function zeroLineY() {
    return Number(bounds().zeroY.toFixed(2));
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-gray-100">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {props.title}
          </h3>
          {Boolean(props.description) ? (
            <p className="text-xs text-gray-500 mt-0.5">{props.description}</p>
          ) : null}
        </div>
        {props.showLegend ? (
          <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
            <span className="inline-block w-3 h-3 rounded-sm bg-blue-500" />
            <span>{props.seriesLabel || "Series"}</span>
          </div>
        ) : null}
      </div>
      {canRenderChart() ? (
        <div className="w-full">
          <svg
            viewBox="0 0 500 240"
            className="w-full h-auto overflow-visible select-none"
          >
            {props.showGridLines ? (
              <>
                {gridLines()?.map((y) => (
                  <line
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    key={String(y)}
                    x1={40}
                    y1={y}
                    x2={476}
                    y2={y}
                  />
                ))}
              </>
            ) : null}
            <line
              stroke="#cbd5e1"
              strokeWidth="1.5"
              x1={40}
              y1={zeroLineY()}
              x2={476}
              y2={zeroLineY()}
            />
            {props.variant === "bar" ? (
              <>
                {computedPoints()?.map((pt) => (
                  <rect
                    rx="4"
                    key={pt.id}
                    x={pt.x}
                    y={pt.y}
                    width={pt.width}
                    height={pt.height}
                    fill={pt.fillColor}
                  />
                ))}
              </>
            ) : null}
            {props.variant === "line" ? (
              <>
                <path
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={linePath()}
                />
                {computedPoints()?.map((pt) => (
                  <circle
                    r="4.5"
                    fill="#ffffff"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    key={pt.id}
                    cx={pt.cx}
                    cy={pt.cy}
                  />
                ))}
              </>
            ) : null}
            {props.showDataLabels ? (
              <>
                {computedPoints()?.map((pt) => (
                  <text
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                    fontWeight="500"
                    key={pt.id + "-label"}
                    x={pt.cx}
                    y={pt.labelY}
                  >
                    {pt.value}
                  </text>
                ))}
              </>
            ) : null}
            {computedPoints()?.map((pt) => (
              <text
                textAnchor="middle"
                fontSize="11"
                fill="#475569"
                fontWeight="500"
                key={pt.id + "-cat"}
                x={pt.cx}
                y={225}
              >
                {pt.label}
              </text>
            ))}
          </svg>
          <table className="sr-only">
            <caption>{props.title} - Data Values</caption>
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">{props.seriesLabel || "Value"}</th>
              </tr>
            </thead>
            <tbody>
              {props.data?.map((point) => (
                <tr key={point.id}>
                  <td>{point.label}</td>
                  <td>{point.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          role="alert"
          className="p-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium text-center"
        >
          {errorMessage()}
        </div>
      )}
    </div>
  );
}

export default Chart;
