import LoginForm, { type LoginFormValues } from '../forms/LoginForm';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function meta() {
  return [
    { title: "Login" },
    { name: "description", content: "Sign in page" },
  ];
}

export default function LoginPage() {
    const formId = "login-form";
    const { handleLogin, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/dashboard');
        }
    }, []);

    const onSubmit = async (data: LoginFormValues) => {
        await handleLogin(data.email, data.password);
        navigate('/dashboard');
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