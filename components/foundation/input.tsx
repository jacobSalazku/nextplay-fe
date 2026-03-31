import { forwardRef } from 'react';
import { cn } from '@/lib/helpers/utils';
import { cva } from 'class-variance-authority';
import { type FieldError, type UseFormRegisterReturn } from 'react-hook-form';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: FieldError;
  errorMessage?: string;
  register?: UseFormRegisterReturn;
  labelColor?: 'default' | 'light' | 'danger';
  variant?: 'default' | 'error' | 'dark';
};

const labelColorMap = {
  default: 'text-gray-900',
  light: 'text-white',
  danger: 'text-red-500',
};

const inputVariants = cva(
  'w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus:ring-yellow-500 bg-gray-800',
        error:
          'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 ',
        dark: 'bg-neutral-200 text-white border-orange-300/30 placeholder-gray-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      errorMessage,
      register,
      className,
      labelColor,
      variant = 'default',
      ...props
    },
    ref,
  ) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={id}
          className={cn(
            labelColorMap[labelColor ?? 'default'],
            'block text-sm font-medium',
          )}
        >
          {label}
        </label>
        <input
          id={id}
          className={cn(
            inputVariants({ variant: error ? 'error' : variant }),
            className,
          )}
          {...(register ?? {})}
          {...props}
          ref={ref}
        />
        {error && errorMessage && (
          <p
            aria-errormessage={`${errorMessage}`}
            className="text-sm text-red-500"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
