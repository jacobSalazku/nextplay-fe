import { usePathname } from 'next/navigation';

export const useLastPathSegment = () => {
  const pathname = usePathname();
  if (!pathname) return '';
  const segments = pathname.split('/').filter(Boolean);
  return segments[segments.length - 1];
};
