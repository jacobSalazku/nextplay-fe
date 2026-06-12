'use client';

import { useNavigationStore } from '@/store/use-navigation-store';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/foundation/button/button';

const AuthLogoutModal = () => {
  const { setOpenLogOutModal } = useNavigationStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4">
      <div className="max-h-[90vh] w-full max-w-sm overflow-auto rounded-3xl border border-white/10 bg-gray-950 p-5 text-white shadow-2xl shadow-black/50 sm:max-w-md sm:p-6">
        <div className="text-center">
          <h2 className="text-lg font-bold sm:text-xl">Log out?</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            You will be signed out of NextPlay and returned to the login page.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Button
            aria-label="Close Button"
            size="lg"
            onClick={() => setOpenLogOutModal(false)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            aria-label="Logout Button"
            size="lg"
            onClick={() => signOut({ callbackUrl: '/login' })}
            variant="danger"
            className="w-full sm:w-auto"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
export { AuthLogoutModal };
