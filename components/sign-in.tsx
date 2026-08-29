'use client';

import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from './foundation/button/button';

const DEV_AUTH_ENABLED = process.env.NEXT_PUBLIC_DEV_AUTH_ENABLED === 'true';
const DEV_TEST_EMAILS = [
  'coach.cavs@nextplay.test',
  'player.1@nextplay.test',
  'player.2@nextplay.test',
  'pending.joiner@nextplay.test',
];

const SigninForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/create';
  const [email, setEmail] = useState(DEV_TEST_EMAILS[0]);

  const onDevSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    await signIn('credentials', {
      email: normalizedEmail,
      callbackUrl,
    });
  };

  return (
    <div className="flex w-full max-w-[21.5rem] flex-col items-center justify-center gap-4 bg-white min-[390px]:max-w-sm">
      <Button
        aria-label="signin with google"
        className="flex min-h-12 w-full justify-center rounded-xl border border-neutral-900 bg-neutral-950 px-4 py-3 text-sm text-white shadow-sm hover:bg-neutral-800 min-[390px]:text-base md:text-lg"
        onClick={() => signIn('google', { callbackUrl })}
      >
        Sign In with Google
      </Button>

      {DEV_AUTH_ENABLED && (
        <form onSubmit={onDevSignIn} className="flex w-full flex-col gap-3">
          <label htmlFor="dev-auth-email" className="text-sm text-black/80">
            Dev login email
          </label>
          <input
            id="dev-auth-email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-h-11 w-full rounded-xl border border-black/30 px-3 py-2 text-sm text-black outline-none focus:border-black"
            placeholder="player.1@nextplay.test"
            type="email"
            autoComplete="email"
          />
          <div className="grid max-h-28 grid-cols-1 gap-2 overflow-y-auto pr-1 min-[390px]:max-h-none min-[390px]:grid-cols-2">
            {DEV_TEST_EMAILS.map((seedEmail) => (
              <button
                key={seedEmail}
                type="button"
                onClick={() => setEmail(seedEmail)}
                className="truncate rounded-lg border border-black/30 px-2.5 py-2 text-left text-[11px] text-black/70 hover:border-black hover:text-black min-[390px]:text-xs"
              >
                {seedEmail}
              </button>
            ))}
          </div>
          <Button
            type="submit"
            variant="outline"
            className="min-h-11 w-full rounded-xl border-neutral-900 bg-white text-neutral-950 hover:bg-neutral-950 hover:text-white"
          >
            Sign In with Dev Email
          </Button>
        </form>
      )}
    </div>
  );
};

export default SigninForm;
