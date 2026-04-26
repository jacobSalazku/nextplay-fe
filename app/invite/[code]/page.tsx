type InvitePageProps = {
  params: Promise<{ code: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;

  return <div className="p-6 text-white">Invite code: {code}</div>;
}
