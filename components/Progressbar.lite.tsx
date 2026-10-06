export interface ProgressbarProps {
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
}

export default function Progressbar(props: ProgressbarProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"rounded-full" + (props.className ? " " + props.className : "")}>
      <div className="bg-[#e55514]" />
      <div className="bg-[#e55514]" />
      {props.children}
    </div>
  );
}
