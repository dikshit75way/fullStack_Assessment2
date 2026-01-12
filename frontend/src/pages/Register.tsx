import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../services/auth';
import { Input } from '../components/Input';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const registerSchema = yup.object({
  name: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
}).required();

type RegisterFormInputs = yup.InferType<typeof registerSchema>;

export const Register = () => {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "user"
      }).unwrap();
      
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          sign in to existing account
        </Link>
      </p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full Name"
          type="text"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label="Email address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        <Input
          label="Confirm Password"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </div>
      </form>
    </div>
  );
};
