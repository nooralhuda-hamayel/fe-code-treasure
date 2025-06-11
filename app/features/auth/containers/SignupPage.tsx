import SignupForm, { type SignupFormValues } from '../forms/SignupForm';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '../../shared';

export function meta() {
  return [
    { title: "Signup" },
    { name: "description", content: "Sign in page" },
  ];
}

export default function SignupPage() {
    const formId = "signup-form";
    const { handleSignup, isLoggedIn } = useAuth();
    const { refetchUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/dashboard');
        }
    }, []);

    const onSubmit = async (data: SignupFormValues) => {
        const success = await handleSignup(data.name, data.email, data.password);
        if (success) {
            await refetchUser();
            navigate('/dashboard');
        }
    };

    return (
        <AuthLayout>
            <div>
                <SignupForm onSubmit={onSubmit} formId={formId} />
                <button type="submit" form={formId}>
                    Sign up
                </button>
            </div>
        </AuthLayout>
    );
} 