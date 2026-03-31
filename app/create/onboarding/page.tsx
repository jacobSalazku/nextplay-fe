import { redirect } from 'next/navigation';

export default async function OnboardUser() {
  const hasOnboarded = 1;

  if (hasOnboarded) {
    redirect('/');
  }

  return (
    <main className="max flex min-h-screen flex-col items-center justify-center bg-white text-white">
      <div className="flex h-screen max-h-[1024px] w-full flex-row items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center gap-12 px-4 py-16">
          HEy
        </div>
      </div>
    </main>
  );
}
