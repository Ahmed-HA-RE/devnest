import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { APP_NAME } from '@/lib/constants/app';
import { prisma } from '@/lib/db';
import AccountCard from './_components/account-card';
import ProfileStatsCard from './_components/profile-stats-card';

export const metadata: Metadata = {
  title: 'Profile',
  description: `Manage your ${APP_NAME} account.`,
  robots: {
    index: false,
    follow: false,
  },
};

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect('/sign-in');
  }

  const userId = session.user.id;

  const credentialAccount = await prisma.account.findFirst({
    where: { userId, providerId: 'credential' },
  });

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-2xl font-semibold'>Profile</h2>
        <p className='text-sm text-muted-foreground'>
          Manage your account and see your stats
        </p>
      </div>
      <AccountCard
        name={session.user.name}
        email={session.user.email}
        hasPassword={!!credentialAccount}
      />
      <ProfileStatsCard userId={userId} />
    </div>
  );
};

export default ProfilePage;