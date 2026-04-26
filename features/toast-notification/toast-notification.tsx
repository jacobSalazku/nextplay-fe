import { Toaster as Sonner } from 'sonner';
import { cn } from '@/lib/helpers/utils';

type ToastNotificationProps = {
  className?: string;
};

const Toaster = ({ className, ...props }: ToastNotificationProps) => {
  return (
    <Sonner
      position="top-center"
      className={cn(className, 'bg-gray-800')}
      {...props}
    />
  );
};
export { Toaster };
