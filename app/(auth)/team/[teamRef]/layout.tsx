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
  params: Promise<{ teamRef: string }>;
}>) {
  const { teamRef } = await params;
  const data = await getUser(teamRef);

  return (
    <Providers>
      <TeamProvider user={data} teamRef={teamRef}>
        <Navigation>{children}</Navigation>
        <Toaster />
      </TeamProvider>
    </Providers>
  );
}
