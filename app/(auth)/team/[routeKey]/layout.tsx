import { Metadata } from 'next';
import { TeamProvider } from '@/context/team-context';
import { Toaster } from 'sonner';
import { Providers } from '@/app/providers';
import { getUser } from '@/api/user/get-user';
import { Navigation } from '@/components/navigation';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_BASE_URL ?? ''),
  title: {
    default: 'Next Play ',
    template: ' %s | Next Play',
  },
  icons: [
    {
      url: '/next-play-logo.png',
    },
  ],
  description:
    'Next Play is a platform for sports teams to manage their team, schedule matches, and track statistics.',

  openGraph: {
    type: 'website',
    url: `${process.env.NEXT_BASE_URL}`,
    title: 'Next Play',
    description:
      'Next Play is a platform for sports teams to manage their team, schedule matches, and track statistics.',
    images: [
      {
        url: '/next-play-logo.png',
        width: 48,
        height: 48,
        alt: 'Next Play Logo',
      },
    ],
  },
};

export default async function TeamLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ routeKey: string }>;
}>) {
  const { routeKey } = await params;
  const data = await getUser(routeKey);

  return (
    <Providers>
      <TeamProvider user={data} routeKey={routeKey}>
        <Navigation>{children}</Navigation>
        <Toaster />
      </TeamProvider>
    </Providers>
  );
}
