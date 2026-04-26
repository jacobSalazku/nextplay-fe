import { usePathname } from 'next/navigation';

export const useNavRoute = () => {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const isTeamRoute = segments[1] === 'team';
  const segment = isTeamRoute
    ? (segments[3] ?? 'dashboard')
    : (segments[2] ?? segments[1] ?? 'dashboard');

  const title = segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return title;
};
