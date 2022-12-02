import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createUserSchema = object({
  name: string().min(1, 'Name is required'),
  password: string().min(6, 'Password should be 6 characters minimum'),
  passwordConfirmation: string().min(1, 'Confirmation password is required'),
  email: string().min(1, 'Email is required').email('Invalid email'),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match.',
  path: ['passwordConfirmation'],
});

type RegisterForm = TypeOf<typeof createUserSchema>;

const RegisterPage = () => {
  const router = useRouter();
  const [registerError, setRegisterError] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterForm>({
    resolver: zodResolver(createUserSchema),
  });

  console.log(errors);

  const onSubmit = async (values: RegisterForm) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
        values,
        {
          withCredentials: true,
        }
      );
      router.push('/');
    } catch (error: any) {
      setRegisterError(error.message);
    }
  };

  return (
    <>
      <p>{registerError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          placeholder='name@example.com'
          {...register('email')}
        />
        <p>{errors.email?.message as string}</p>
        <label htmlFor='name'>Name</label>
        <input
          id='name'
          type='text'
          placeholder='Hari Prasad'
          {...register('name')}
        />
        <p>{errors.name?.message as string}</p>
        <label htmlFor='password'>Password</label>
        <input id='password' type='password' {...register('password')} />
        <p>{errors.password?.message as string}</p>
        <label htmlFor='password-confirmation'>Confirm Password</label>
        <input
          id='password-confirmation'
          type='password'
          {...register('passwordConfirmation')}
        />
        <p>{errors.passwordConfirmation?.message as string}</p>
        <button type='submit'>Submit</button>
      </form>
    </>
  );
};

export default RegisterPage;
