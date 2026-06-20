import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success('Login successful!');
      navigate(user.role === 'Customer' ? '/customer/dashboard' : '/provider/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout type="login">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back!</h1>
        <p className="text-gray-500 mt-2 text-sm">Sign in to your GIGVERA account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gig-teal focus:border-transparent outline-none pr-10"
              placeholder="Enter your password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4 text-gig-teal rounded border-gray-300 focus:ring-gig-teal" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <span className="text-sm text-gig-teal hover:underline cursor-pointer">Forgot Password?</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gig-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <div className="text-center">
          <span className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-gig-teal font-semibold hover:underline">Register</Link>
          </span>
        </div>

        <div className="mt-4 p-3 bg-gig-light rounded-lg">
          <p className="text-xs text-gray-500 font-medium mb-1">Demo Accounts:</p>
          <p className="text-xs text-gray-600">Provider: provider@gigvera.com / Provider@123</p>
          <p className="text-xs text-gray-600">Customer: customer@gigvera.com / Customer@123</p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
