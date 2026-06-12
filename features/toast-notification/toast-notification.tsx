import { cn } from '@/utils/tw-merge';
import { Toaster as Sonner } from 'sonner';

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
