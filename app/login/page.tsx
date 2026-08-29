import { Suspense } from 'react';
import type { Metadata } from 'next';
import SigninForm from '../../components/sign-in';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to your NextPlay account.',
  openGraph: {
    title: 'Login',
    description: 'Log in to your NextPlay account.',
  },
};

export default async function Login() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-white text-white">
      <div className="flex min-h-dvh w-full flex-row items-stretch justify-center">
        <div className="hidden min-h-dvh w-full flex-col items-center justify-center gap-12 bg-gradient-to-br from-gray-900 to-gray-950 py-16 lg:flex" />
        <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-7 overflow-y-auto bg-white px-4 py-6 min-[390px]:gap-9 sm:px-6 sm:py-10 lg:w-full">
          <h2 className="font-righteous text-center text-3xl leading-tight text-neutral-500 min-[390px]:text-4xl">
            Log in bij NextPlay
          </h2>
          <Suspense fallback={null}>
            <SigninForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
