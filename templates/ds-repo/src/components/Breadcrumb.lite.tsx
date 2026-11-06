import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface BreadcrumbProps {
  type?: '1' | '2' | 'deep';
  showEllipsis?: boolean;
  className?: string;
  children?: any;
}

export default function Breadcrumb(props: BreadcrumbProps) {
  useDefaultProps({
    type: '2',
    showEllipsis: true,
    className: '',
  });

  return (
    <nav
      data-ctrl={typeof bindControllerProps}
      aria-label="Breadcrumb"
       data-type={props.type}
      data-show-ellipsis={props.showEllipsis}
      class={cn('w-full', props.className)}
    >
      <ol class="flex flex-row flex-wrap justify-start items-center gap-1.5 text-sm font-normal">
        {props.children}
      </ol>
    </nav>
  );
}
