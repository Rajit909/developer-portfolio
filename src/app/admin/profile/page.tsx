import { getProfile } from '@/lib/api';
import EditProfileForm from '@/components/EditProfileForm';
import { Profile } from '@/lib/types';

export default async function ProfilePage() {
  const profile = await getProfile();

  // The form expects a plain object
  const plainProfile = JSON.parse(JSON.stringify(profile)) as Profile;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Edit Profile</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Update your public-facing portfolio information.
        </p>
      </div>
      <EditProfileForm profile={plainProfile} />
    </div>
  );
}
