import { useDefaultProps } from '@builder.io/mitosis';
import { cn, bindControllerProps } from './utils';

export interface BreadcrumbProps {
  ariaLabel?: string;
  className?: string;
  children?: any;
}

export default function Breadcrumb(props: BreadcrumbProps) {
  useDefaultProps({
    ariaLabel: 'Breadcrumb',
    className: '',
  });

  return (
    <nav
      data-ctrl={typeof bindControllerProps}
      aria-label={props.ariaLabel}
      class={cn('w-full', props.className)}
    >
      <ol class="flex flex-row flex-wrap justify-start items-center gap-1.5 text-sm font-normal text-foreground-muted">
        {props.children}
      </ol>
    </nav>
  );
}
