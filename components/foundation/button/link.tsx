import type { FC } from 'react';
import NavLink from 'next/link';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/helpers/utils';
import { buttonVariants } from './button';

export type LinkProps = {
  label?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  href: Parameters<typeof NavLink>[0]['href'];
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  VariantProps<typeof buttonVariants>;
const Link: FC<LinkProps> = ({
  className,
  variant,
  children,
  label,
  href,
  ...rest
}) => {
  return (
    <NavLink
      href={href}
      className={cn(
        buttonVariants({
          variant,
          className,
        }),
      )}
      {...rest}
      aria-label={label}
      prefetch
    >
      {label}
      {children}
    </NavLink>
  );
};

export { Link };
