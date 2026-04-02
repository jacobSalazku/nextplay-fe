import { redirect } from 'next/navigation';
import UserUpdateForm from '@/features/auth/components/user-update-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export default async function OnboardUser() {
  const session = await getServerSession(authOptions);
  const hasSessionError =
    !!session &&
    'error' in session &&
    typeof session.error === 'string' &&
    session.error.length > 0;

  if (!session?.accessToken || hasSessionError) {
    redirect('/login?error=SessionExpired');
  }

  if (session.user?.hasOnBoarded) {
    redirect('/club');
  }

  return (
    <main className="max flex min-h-screen flex-col items-center justify-center bg-white text-white">
      <div className="flex h-screen max-h-[1024px] w-full flex-row items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center gap-12 px-4 py-16">
          <UserUpdateForm />
        </div>
      </div>
    </main>
  );
}
