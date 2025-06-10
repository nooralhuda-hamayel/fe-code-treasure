import LoginForm, { type LoginFormValues } from '../forms/LoginForm';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '../../shared';

export function meta() {
  return [
    { title: "Login" },
    { name: "description", content: "Sign in page" },
  ];
}

export default function LoginPage() {
    const formId = "login-form";
    const { handleLogin, isLoggedIn } = useAuth();
    const { refetchUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/dashboard');
        }
    }, []);

    const onSubmit = async (data: LoginFormValues) => {
        const success = await handleLogin(data.email, data.password);
        if (success) {
            await refetchUser();
            navigate('/dashboard');
        }
    };

    return (
        <AuthLayout>
            <div>
                <LoginForm onSubmit={onSubmit} formId={formId} />
                <button type="submit" form={formId}>
                    Sign In
                </button>
            </div>
        </AuthLayout>
    );
} 