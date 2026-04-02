import { JoinTeamForm } from "@/features/auth/components/join-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Team",
  description: "Join an existing team to manage your players and playbook.",
  openGraph: {
    title: "Join Team",
    description: "Join an existing team to manage your players and playbook.",
  },
};

async function JoinTeamPage() {
  return (
    <main className="max flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="flex h-screen w-full flex-row items-center justify-center border-2">
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-white px-4">
          <h2 className="font-righteous text-4xl tracking-wide text-neutral-500">
            To continue
          </h2>
          <JoinTeamForm />
        </div>
      </div>
    </main>
  );
}

export default JoinTeamPage;
