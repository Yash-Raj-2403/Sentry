import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// ── Types ────────────────────────────────────────────────────────────────────
interface AuthContextValue {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
});

// ── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from persisted Supabase session (localStorage)
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session ?? null);
            setLoading(false);
        });

        // Listen for sign-in / sign-out / token-refresh events
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, newSession: Session | null) => {
                setSession(newSession);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{ session, user: session?.user ?? null, loading, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
    return useContext(AuthContext);
}
