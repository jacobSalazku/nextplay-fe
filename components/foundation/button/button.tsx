import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/tw-merge';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-gray-800 text-white shadow-md transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900',
        primary:
          'bg-linear-to-br from-orange-700/80 to-orange-400 text-white shadow-sm hover:bg-orange-400/90',
        outline:
          'border border-orange-300/30 text-white transition-all duration-200 ease-in-out hover:text-white hover:bg-gray-800 hover:shadow-md px-4 py-2 rounded',
        light:
          'bg-gray-100 text-gray-950 shadow-sm hover:text-white border hover:border-orange-400 hover:bg-transparent',
        ghost:
          'text-gray-400 font-light hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        danger:
          'bg-red-900 text-red-foreground text-white shadow-sm hover:bg-red-800',
        close:
          'rounded p-2 text-gray-900 transition-colors duration-200 hover:bg-gray-800',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        full: 'h-10 w-full',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: React.ReactNode;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, type = 'button', variant, size, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild && type !== 'submit' ? Slot : 'button';

    return (
      <Comp
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
