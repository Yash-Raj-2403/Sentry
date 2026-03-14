import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
    children: ReactNode;
}

/**
 * Guards any route that requires authentication.
 * - While Supabase is hydrating the session, renders nothing (avoids flash).
 * - If no session, redirects to /login preserving the attempted path so the
 *   user can be bounced back after successful sign-in.
 */
export default function ProtectedRoute({ children }: Props) {
    const { session, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Invisible loading state — prevents flash of redirect
        return (
            <div className="min-h-screen bg-[#030305] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        // Signed out → redirect to login, remembering where the user wanted to go
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
