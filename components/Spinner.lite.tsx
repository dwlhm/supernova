export interface SpinnerProps {
  size?: "12" | "16" | "24" | "32";
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

export default function Spinner(props: SpinnerProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-row gap-3 items-center" + (props.className ? " " + props.className : "")}>
      <div>
        <div className="border border-[#e55514]" />
      </div>
      {props.children}
    </div>
  );
}
