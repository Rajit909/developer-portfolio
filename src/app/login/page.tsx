import { Suspense } from 'react';
import LoginClientPage from './LoginClientPage';

// Force dynamic rendering to prevent this page from being statically built
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginClientPage />
      </Suspense>
    </div>
  );
}
