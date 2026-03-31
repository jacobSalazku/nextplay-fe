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
    <main className="max flex min-h-screen flex-col items-center justify-center text-white">
      <div className="flex h-screen w-full flex-row items-center justify-center">
        <div className="hidden h-full w-full flex-col items-center justify-center gap-12 bg-gradient-to-br from-gray-900 to-gray-950 py-16 lg:flex"></div>
        <div className="flex h-full w-full flex-col items-center justify-center gap-12 bg-white px-4 py-16">
          <h2 className="font-righteous text-4xl text-neutral-500">
            Log in bij NextPlay
          </h2>
          <SigninForm />
        </div>
      </div>
    </main>
  );
}
