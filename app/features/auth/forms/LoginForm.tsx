import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: LoginFormValues) => void;
    formId: string;
}

export default function LoginForm({ onSubmit, formId }: LoginFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    return (
        <div>
            <h2>Sign In</h2>
            <form id={formId} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input type="email" {...register('email')} placeholder="Email" />
                </div>
                {errors.email && <p>{errors.email.message}</p>}
                <div>
                    <input type="password" {...register('password')} placeholder="Password" />
                </div>
                {errors.password && <p>{errors.password.message}</p>}
            </form>
        </div>
    );
} 