import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const signupSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
    name: z.string().min(1, { message: 'Name is required' }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
    onSubmit: (data: SignupFormValues) => void;
    formId: string;
}

export default function SignupForm({ onSubmit, formId }: SignupFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    return (
        <div>
            <h2>Sign up</h2>
            <form id={formId} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input type="text" {...register('name')} placeholder="Name" />
                </div>
                {errors.name && <p>{errors.name.message}</p>}
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