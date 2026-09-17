import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  UserPlus,
  LogIn,
  KeyRound,
  Globe,
  Camera,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  loginUser,
  registerUser,
  sendOtpToEmail,
  verifyOtpForEmail,
} from '../services/authService';

interface LoginPageProps {
  currentUser?: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onExploreGuest: () => void;
  onDirectCameraScan?: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  onLoginSuccess,
  onExploreGuest,
  onDirectCameraScan,
  onShowToast,
}) => {
  const getInitialMode = () => (window.location.pathname === '/signup' ? 'signup' : 'signin');
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(getInitialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const pathMode = window.location.pathname === '/signup' ? 'signup' : 'signin';
    if (mode !== pathMode && pathMode !== 'signin' && mode !== 'forgot') {
      setMode(pathMode);
    }
  }, [mode]);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Punjab');
  const [role, setRole] = useState<'Farmer / Grower' | 'Agronomist / Scientist' | 'SIH Evaluator / Student'>('Farmer / Grower');
  const [primaryCrop, setPrimaryCrop] = useState('Tomato');
  const [farmLocation, setFarmLocation] = useState('Punjab & Maharashtra Agro-Zone');
  const [rememberMe, setRememberMe] = useState(true);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Validation Error State
  const [validationError, setValidationError] = useState<{
    type: 'NO_ACCOUNT' | 'WRONG_PASSWORD' | 'EMAIL_EXISTS' | 'INVALID_INPUT';
    message: string;
  } | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: '', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, text: 'Weak (< 6 characters)', color: 'bg-rose-500' };
    if (pass.length < 9) return { score: 2, text: 'Medium Strength', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong Password', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const clearErrors = () => {
    if (validationError) setValidationError(null);
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    setMode(newMode);
    setValidationError(null);
    setPassword('');
    setConfirmPassword('');
    if (newMode !== 'signup') {
      setOtp('');
      setOtpSent(false);
      setEmailVerified(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setValidationError({
        type: 'INVALID_INPUT',
        message: 'Please enter your email address before requesting an OTP.',
      });
      return;
    }

    setOtpLoading(true);
    const result = await sendOtpToEmail(email);
    setOtpLoading(false);

    if (!result.success) {
      setValidationError({
        type: 'INVALID_INPUT',
        message: result.message,
      });
      onShowToast('error', 'OTP not sent', result.message);
      return;
    }

    setOtpSent(true);
    setEmailVerified(false);
    setOtp('');
    setValidationError(null);
    onShowToast('success', 'OTP Sent', result.message);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setValidationError({
        type: 'INVALID_INPUT',
        message: 'Please enter the 6-digit verification code sent to your email.',
      });
      return;
    }

    setOtpLoading(true);
    const result = await verifyOtpForEmail(email, otp);
    setOtpLoading(false);

    if (!result.success) {
      setEmailVerified(false);
      setValidationError({
        type: 'INVALID_INPUT',
        message: result.message,
      });
      onShowToast('error', 'Verification Failed', result.message);
      return;
    }

    setEmailVerified(true);
    setValidationError(null);
    onShowToast('success', 'Email Verified', result.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setIsLoading(true);

    try {
      // FORGOT PASSWORD
      if (mode === 'forgot') {
        onShowToast(
          'success',
          'Password Reset Dispatched',
          `Recovery instructions have been sent to ${email || 'your email'}`
        );
        switchMode('signin');
        return;
      }

      if (mode === 'signin') {
        const result = await loginUser(email, password);

        if (!result.success) {
          setValidationError({
            type: result.errorType || 'INVALID_INPUT',
            message: result.message,
          });

          if (result.errorType === 'NO_ACCOUNT') {
            onShowToast('error', 'Account Not Found', 'Naya user hai toh pehle Sign Up karein!');
          } else if (result.errorType === 'WRONG_PASSWORD') {
            onShowToast('error', 'Authentication Failed', 'Galat password! Kripya sahi password enter karein.');
          }
          return;
        }

        if (result.user) {
          onLoginSuccess(result.user);
          onShowToast(
            'success',
            'Signed In Successfully',
            `Welcome back ${result.user.name}`
          );
        }
        return;
      }

      if (mode === 'signup') {
        if (!emailVerified) {
          setValidationError({
            type: 'INVALID_INPUT',
            message: 'Please verify your email using the 6-digit OTP before creating your account.',
          });
          onShowToast('error', 'Email Verification Required', 'Please verify your email before creating your account.');
          return;
        }

        const result = await registerUser({
          name,
          email,
          password,
          confirmPassword,
          role,
          primaryCrop,
          farmLocation: state,
          phone,
        });

        if (!result.success) {
          setValidationError({
            type: result.errorType || 'INVALID_INPUT',
            message: result.message,
          });

          if (result.errorType === 'EMAIL_EXISTS') {
            onShowToast('error', 'Account Already Exists', 'Yeh email pehle se registered hai! Kripya Sign In karein.');
          } else {
            onShowToast('error', 'Validation Error', result.message);
          }
          return;
        }

        if (result.user) {
          onLoginSuccess(result.user);
          onShowToast(
            'success',
            'Registration Completed!',
            `Account created successfully! Welcome ${result.user.name}.`
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-lg font-black text-white tracking-tight">
            Farmer<span className="text-emerald-400">Detect</span>
          </span>
        </div>
      </header>

      {/* Centered Login / Sign Up Card (ONLY LOGIN, NO EXTRA SIDE CONTENT) */}
      <main className="relative z-10 flex-1 w-full max-w-md mx-auto px-4 py-6 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 relative"
        >

          {/* Brand & Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {mode === 'signin' && 'Sign In to Your Account'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'signin' && 'Old / Registered user? Enter your credentials to login'}
              {mode === 'signup' && 'New user? Register your profile to get started'}
              {mode === 'forgot' && 'Enter your registered email address to receive reset link'}
            </p>
          </div>

          {/* Mode Switcher Tabs (Sign In vs Sign Up) */}
          {mode !== 'forgot' && (
            <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200 mb-5">
              <button
                type="button"
                id="tab-btn-signin"
                onClick={() => switchMode('signin')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'signin'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Old User (Sign In)</span>
              </button>
              <button
                type="button"
                id="tab-btn-signup"
                onClick={() => switchMode('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'signup'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>New User (Sign Up)</span>
              </button>
            </div>
          )}

          {/* Dynamic Validation Error Alert Banner */}
          <AnimatePresence>
            {validationError && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div
                  className={`p-3.5 rounded-2xl border text-xs flex flex-col gap-2 ${
                    validationError.type === 'EMAIL_EXISTS'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {validationError.type === 'EMAIL_EXISTS' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span className="font-semibold leading-relaxed">
                      {validationError.message}
                    </span>
                  </div>

                  {/* Switch Action button inside Alert Banner */}
                  {validationError.type === 'NO_ACCOUNT' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setValidationError(null);
                      }}
                      className="self-start mt-0.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition flex items-center gap-1"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Naya Account Banayein (Sign Up)</span>
                    </button>
                  )}

                  {validationError.type === 'EMAIL_EXISTS' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setValidationError(null);
                      }}
                      className="self-start mt-0.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700 transition flex items-center gap-1"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Sign In / Login Karein</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
            {/* Sign Up Fields: Full Name & Role */}
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearErrors();
                      }}
                      placeholder="e.g. Ramesh Kumar Patel"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs text-slate-900 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Role <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                    >
                      <option value="Farmer / Grower">Farmer</option>
                      <option value="Agronomist / Scientist">Agronomist</option>
                      <option value="SIH Evaluator / Student">Evaluator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Primary Crop
                    </label>
                    <select
                      value={primaryCrop}
                      onChange={(e) => setPrimaryCrop(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                    >
                      <option value="Tomato">Tomato</option>
                      <option value="Potato">Potato</option>
                      <option value="Corn">Corn (Maize)</option>
                      <option value="Apple">Apple</option>
                      <option value="Pepper">Pepper</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                {mode === 'signin' && (
                  <span className="text-[10px] text-slate-400">Must be registered</span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearErrors();
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs text-slate-900 outline-none transition"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Email Verification
                  </span>
                  {emailVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || emailVerified}
                    className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {otpLoading ? 'Sending...' : emailVerified ? 'OTP Sent' : otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>

                  {otpSent && !emailVerified && (
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpLoading || otp.length !== 6}
                      className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      Verify OTP
                    </button>
                  )}
                </div>

                {otpSent && !emailVerified && (
                  <div className="mt-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Enter 6-digit OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>
            )}
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(sanitized);
                      clearErrors();
                    }}
                    placeholder="9876543210"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setFarmLocation(e.target.value);
                      clearErrors();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
                    >
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                </div>
              </div>
            )}


            {/* Password Field */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearErrors();
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs text-slate-900 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter for Sign Up */}
                {mode === 'signup' && password.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Strength:</span>
                      <span className="font-semibold">{passwordStrength.text}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200'}`} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Password (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  {confirmPassword && (
                    <span
                      className={`text-[10px] font-bold ${
                        password === confirmPassword ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {password === confirmPassword ? '✓ Passwords Match' : '✗ Do not match'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearErrors();
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs text-slate-900 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me */}
            {mode === 'signin' && (
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <label htmlFor="login-remember" className="text-xs text-slate-600 font-medium">
                  Remember my session
                </label>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              id="primary-login-action-btn"
              className="w-full py-3 px-4 rounded-xl font-bold text-white text-xs bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-[0.99] mt-2"
            >
              {isLoading ? (
                <span>Checking credentials...</span>
              ) : mode === 'signin' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'signup' ? (
                <>
                  <span>Create Account</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>

          {/* Mode switch helper text at bottom */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 text-xs text-center">
            {mode === 'signin' ? (
              <div className="text-slate-600">
                <span>Don't have an account?{' '}</span>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  Sign Up
                </button>
              </div>
            ) : mode === 'signup' ? (
              <div className="text-slate-600">
                <span>Already registered?{' '}</span>
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="font-bold text-emerald-600 hover:underline"
              >
                Back to Sign In
              </button>
            )}

          </div>
        </motion.div>
      </main>

      {/* Clean Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-4 py-4 text-center text-xs text-slate-500">
        <span>© 2026 FarmerDetect • AI Crop Diagnostics Platform</span>
      </footer>
    </div>
  );
};
