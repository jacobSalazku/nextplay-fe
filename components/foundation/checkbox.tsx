'use client';

import { useId, type ComponentProps, type ReactElement } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/helpers/utils';

function Checkbox({
  className,
  label,
  children,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root> & {
  label: string;
  children?: React.ReactNode;
}): ReactElement {
  const generatedId = useId();
  const id = props.id ?? `checkbox-${generatedId}`;
  return (
    <label
      htmlFor={id}
      className="flex w-full cursor-pointer items-center justify-between gap-3 px-2 py-1"
    >
      <div className="flex items-center gap-2">
        <CheckboxPrimitive.Root
          id={id}
          data-slot="checkbox"
          className={cn(
            'peer border-input data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator
            data-slot="checkbox-indicator"
            className="flex items-center justify-center text-current transition-none"
          >
            <CheckIcon className="h-4 w-4" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <span className="text-sm select-none">{label}</span>
      </div>
      <div>{children}</div>
    </label>
  );
}
export { Checkbox };
