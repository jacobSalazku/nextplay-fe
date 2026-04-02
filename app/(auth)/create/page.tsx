import { requireAccessToken } from '@/lib/auth/require-acces-token';
import { Link } from '@/components/foundation/button/link';

async function CreatePage() {
  await requireAccessToken();
  return (
    <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex h-screen w-full flex-row items-center justify-center border-2">
        <div className="flex h-full w-full flex-col items-center justify-center gap-12 bg-white px-4 py-16">
          <h2 className="font-righteous text-4xl text-neutral-500">
            To continue
          </h2>
          <div className="container flex flex-col items-center justify-center gap-4 px-4 py-4">
            <Link
              className="w-full py-8 text-lg hover:border-gray-950 hover:bg-gray-600 hover:text-white sm:w-1/3"
              href="/create/create-team"
            >
              Create Team
            </Link>
            <Link
              className="w-full py-8 text-lg hover:border-gray-950 hover:bg-gray-600 hover:text-white sm:w-1/3"
              href="/create/join-team"
            >
              Request to Join
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CreatePage;
