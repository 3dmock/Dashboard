import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';

const API_BASE = 'https://api.3dmock.app/api';

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveSession } = useAuthContext();
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotificationContext();

  const loginFormSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password'),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const redirectUser = () => {
    const redirectLink = searchParams.get('redirectTo');
    if (redirectLink) navigate(redirectLink);
    else navigate('/');
  };

  const login = handleSubmit(async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, values, {
        withCredentials: true,
      });

      const { token, user } = res.data;

      if (!token) {
        showNotification({ message: 'Authentication failed. No token received.', variant: 'danger' });
        return;
      }

      if (!user?.isAdmin) {
        showNotification({ message: 'Admin access required.', variant: 'danger' });
        return;
      }

      // Save flat session so user.token is accessible everywhere
      saveSession({ ...user, token });
      redirectUser();
      showNotification({ message: 'Welcome back! Redirecting...', variant: 'success' });
    } catch (e) {
      const message = e.response?.data?.error ?? 'Login failed. Please try again.';
      showNotification({ message, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  });

  return { loading, login, control };
};

export default useSignIn;
