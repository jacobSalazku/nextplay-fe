'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/tw-merge';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    ></RadioGroupPrimitive.Root>
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export { RadioGroup };
