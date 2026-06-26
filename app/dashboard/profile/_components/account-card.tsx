import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ChangePasswordDialog from './change-password-dialog';
import ChangeUsernameDialog from './change-username-dialog';
import DeleteAccountDialog from './delete-account-dialog';

interface AccountCardProps {
  name: string;
  email: string;
  hasPassword: boolean;
}

const AccountCard = ({ name, email, hasPassword }: AccountCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account settings.</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm font-medium'>{name}</p>
            <p className='text-sm text-muted-foreground'>{email}</p>
          </div>
          <ChangeUsernameDialog currentName={name} />
        </div>

        <Separator />

        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm font-medium'>Password</p>
            <p className='text-sm text-muted-foreground'>
              {hasPassword
                ? 'Change your account password.'
                : 'Set a password to sign in without a social provider.'}
            </p>
          </div>
          <ChangePasswordDialog hasPassword={hasPassword} email={email} />
        </div>

        <Separator />

        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm font-medium'>Delete Account</p>
            <p className='text-sm text-muted-foreground'>
              Permanently delete your account and all your data.
            </p>
          </div>
          <DeleteAccountDialog />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
