export interface TabsProps {
  tab3?: boolean;
  tab4?: boolean;
  tab5?: boolean;
  tab6?: boolean;
  tab7?: boolean;
  tab8?: boolean;
  showIcon?: boolean;
  label?: string;
  showNum?: boolean;
  num?: string;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

export default function Tabs(props: TabsProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-row p-1 justify-center items-center rounded-xl bg-[#f5f5f5]" + (props.className ? " " + props.className : "")}>
      <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg">
        <div className="flex flex-row gap-1 justify-center items-center">
          {props.showIcon !== false && (
            <div>
              <div className="border-2 border-[#0a0a0a]" />
              <div className="border-2 border-[#0a0a0a]" />
              <div className="border-2 border-[#0a0a0a]" />
              <div className="border-2 border-[#0a0a0a]" />
            </div>
          )}
          <p className="text-sm font-medium text-[#0f0e0f]">{props.label ?? "Label"}</p>
          {props.showNum !== false && (
            <div className="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]">
              <span className="text-xs font-medium text-[#7a2e0c]">{props.num ?? "1"}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm">
        <div className="flex flex-row gap-1 justify-center items-center">
          {props.showIcon !== false && (
            <div>
              <div className="border-2 border-[#0a0a0a]" />
              <div className="border-2 border-[#0a0a0a]" />
              <div className="border-2 border-[#0a0a0a]" />
              <div className="border-2 border-[#0a0a0a]" />
            </div>
          )}
          <p className="text-sm font-medium text-[#0a0a0a]">{props.label ?? "Label"}</p>
          {props.showNum !== false && (
            <div className="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]">
              <span className="text-xs font-medium text-[#7a2e0c]">{props.num ?? "1"}</span>
            </div>
          )}
        </div>
      </div>
      {props.tab3 !== false && (
        <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg">
          <div className="flex flex-row gap-1 justify-center items-center">
            {props.showIcon !== false && (
              <div>
                <div className="border-2 border-[#0a0a0a]" />
                <div className="border-2 border-[#0a0a0a]" />
                <div className="border-2 border-[#0a0a0a]" />
                <div className="border-2 border-[#0a0a0a]" />
              </div>
            )}
            <p className="text-sm font-medium text-[#0f0e0f]">{props.label ?? "Label"}</p>
            {props.showNum !== false && (
              <div className="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]">
                <span className="text-xs font-medium text-[#7a2e0c]">{props.num ?? "1"}</span>
              </div>
            )}
          </div>
        </div>
      )}
      {props.tab4 !== false && (
        <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg">
          <div className="flex flex-row gap-1 justify-center items-center">
            {props.showIcon !== false && (
              <div>
                <div className="border-2 border-[#0a0a0a]" />
                <div className="border-2 border-[#0a0a0a]" />
                <div className="border-2 border-[#0a0a0a]" />
                <div className="border-2 border-[#0a0a0a]" />
              </div>
            )}
            <p className="text-sm font-medium text-[#0f0e0f]">{props.label ?? "Label"}</p>
            {props.showNum !== false && (
              <div className="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]">
                <span className="text-xs font-medium text-[#7a2e0c]">{props.num ?? "1"}</span>
              </div>
            )}
          </div>
        </div>
      )}
      {props.tab5 !== false && (
        <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg">
          <div className="flex flex-row gap-1 justify-center items-center">
            {props.showIcon !== false && (
              <div>
                <div className="border-2 border-[#0a0a0a]" />
                <div className="border-2 border-[#0a0a0a]" />
                <div className="border-2 border-[#0a0a0a]" />
                <div className="border-2 border-[#0a0a0a]" />
              </div>
            )}
            <p className="text-sm font-medium text-[#0f0e0f]">{props.label ?? "Label"}</p>
            {props.showNum !== false && (
              <div className="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]">
                <span className="text-xs font-medium text-[#7a2e0c]">{props.num ?? "1"}</span>
              </div>
            )}
          </div>
        </div>
      )}
      {props.tab6 !== false && (
        <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg">
          <div className="flex flex-row gap-1 justify-center items-center">
            {props.showIcon !== false && (
              <div>
                <div className="border-2 border-[#0a0a0a]" />
                <div className="border-2 border-[#0a0a0a]" />
                <div className="border-2 border-[#0a0a0a]" />
                <div className="border-2 border-[#0a0a0a]" />
              </div>
            )}
            <p className="text-sm font-medium text-[#0f0e0f]">{props.label ?? "Label"}</p>
            {props.showNum !== false && (
              <div className="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]">
                <span className="text-xs font-medium text-[#7a2e0c]">{props.num ?? "1"}</span>
              </div>
            )}
          </div>
        </div>
      )}
      {props.tab7 && (
        <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg">
          <div className="flex flex-row gap-1 justify-center items-center">
            {props.showIcon !== false && (
              <div>
                <div className="border border-[#0a0a0a]" />
              </div>
            )}
            <p className="text-sm font-medium text-[#0f0e0f]">{props.label ?? "Tab 7"}</p>
            {props.showNum !== false && (
              <div className="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]">
                <span className="text-xs font-medium text-[#7a2e0c]">{props.num ?? "6"}</span>
              </div>
            )}
          </div>
        </div>
      )}
      {props.tab8 && (
        <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-lg">
          <div className="flex flex-row gap-1 justify-center items-center">
            {props.showIcon !== false && (
              <div>
                <div className="border border-[#0a0a0a]" />
              </div>
            )}
            <p className="text-sm font-medium text-[#0f0e0f]">{props.label ?? "Tab 8"}</p>
            {props.showNum !== false && (
              <div className="flex flex-row p-1 justify-center items-center rounded-full bg-[#ffe8d9]">
                <span className="text-xs font-medium text-[#7a2e0c]">{props.num ?? "6"}</span>
              </div>
            )}
          </div>
        </div>
      )}
      {props.children}
    </div>
  );
}
