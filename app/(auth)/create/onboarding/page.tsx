import UserUpdateForm from '@/features/auth/components/user-update-form';
import { withOnboardingOnlyPage } from '@/lib/auth/with-page-guards';

async function OnboardUser() {
  return (
    <main className="max flex min-h-screen flex-col items-center justify-center bg-white text-white">
      <div className="flex h-screen max-h-256 w-full flex-row items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center gap-12 px-4 py-16">
          <UserUpdateForm />
        </div>
      </div>
    </main>
  );
}

export default withOnboardingOnlyPage(OnboardUser);
