import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createSessionSchema = object({
  email: string().min(1, 'Email is required').email('Invalid email'),
  password: string().min(6, 'Password should be 6 characters minimum'),
});

type LoginForm = TypeOf<typeof createSessionSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginForm>({
    resolver: zodResolver(createSessionSchema),
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,
        values,
        {
          withCredentials: true,
        }
      );
      router.push('/');
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  return (
    <>
      <p>{loginError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          placeholder='name@example.com'
          {...register('email')}
        />
        <p>{errors.email?.message as string}</p>
        <label htmlFor='password'>Password</label>
        <input id='password' type='password' {...register('password')} />
        <p>{errors.password?.message as string}</p>
        <button type='submit'>Submit</button>
      </form>
    </>
  );
};

export default LoginPage;
