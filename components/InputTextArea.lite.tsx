export interface InputTextAreaProps {
  labelText?: string;
  placeholderText?: string;
  hintErrorText?: string;
  characterCount?: string;
  showRequired?: boolean;
  icon?: any;
  showCharacterCount?: boolean;
  showHint?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  showLabel?: boolean;
  state?: "Default" | "Focus" | "Filled" | "Error" | "Disabled";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  requiredIndicator?: string;
}

export default function InputTextArea(props: InputTextAreaProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-col gap-3 w-full" + (props.className ? " " + props.className : "")}>
      {props.showLabel !== false && (
        <div className="flex flex-row gap-2 items-center w-full">
          <p className="text-sm font-medium text-[#0a0a0a]">{props.labelText ?? "Your message"}</p>
          {props.showRequired && (
            <span className="text-sm font-medium text-[#be123c]">{props.requiredIndicator ?? "*"}</span>
          )}
        </div>
      )}
      <div className="flex flex-row gap-3 px-3 py-1 rounded-lg bg-background-page border border-[#e5e5e5] shadow-sm w-full">
        {props.showLeftIcon && (
          <div>
            <div>
              <div>
                <div className="border-1.5 border-[#737373]" />
                <div className="border-1.5 border-[#737373]" />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-row gap-3">
          <p className="text-base font-normal text-[#525252]">{props.placeholderText ?? "Type your message here."}</p>
        </div>
        {props.showRightIcon && (
          <div>
            <div>
              <div>
                <div className="border-1.5 border-[#737373]" />
                <div className="border-1.5 border-[#737373]" />
              </div>
            </div>
          </div>
        )}
        <div>
          <div className="border border-[#737373]" />
          <div className="border border-[#737373]" />
        </div>
      </div>
      {props.showHint !== false && (
        <div className="flex flex-row gap-3 items-center w-full">
          <p className="text-sm font-normal text-[#737373]">{props.hintErrorText ?? "Your message will be copied to the support team."}</p>
          {props.showCharacterCount !== false && (
            <p className="text-sm font-normal text-right text-[#737373]">{props.characterCount ?? "0 / 200"}</p>
          )}
        </div>
      )}
      {props.children}
    </div>
  );
}
