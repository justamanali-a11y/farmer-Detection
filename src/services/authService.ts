import { UserProfile } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '');

const normalizeRole = (value?: string): UserProfile['role'] => {
  const normalized = (value || '').toLowerCase();

  if (normalized.includes('scientist') || normalized.includes('agronomist')) {
    return 'Agronomist / Scientist';
  }

  if (normalized.includes('evaluator') || normalized.includes('student') || normalized.includes('jury')) {
    return 'SIH Evaluator / Student';
  }

  return 'Farmer / Grower';
};

const mapRoleToBackendCategory = (role: UserProfile['role']) => {
  switch (role) {
    case 'Agronomist / Scientist':
      return 'Agronomist';
    case 'SIH Evaluator / Student':
      return 'Student';
    default:
      return 'Farmer';
  }
};

const toUserProfile = (user: any): UserProfile => ({
  id: user.id || user._id || `usr-${Date.now()}`,
  name: user.name || 'Farmer',
  email: user.email || '',
  role: normalizeRole(user.role || user.category),
  farmLocation: user.location || user.farmLocation || 'India Agro-Zone',
  primaryCrops: Array.isArray(user.primaryCrops) && user.primaryCrops.length > 0
    ? user.primaryCrops
    : user.crop
      ? [user.crop]
      : ['Tomato'],
  avatarUrl: user.avatarUrl || user.profileImage || user.imageUrl || '',
  memberSince: user.createdAt
    ? new Date(user.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })
    : 'Current Season',
  savedScansCount: user.savedScansCount ?? 0,
});

const persistLocalUser = (user: UserProfile) => {
  try {
    localStorage.setItem('farmerdetect_user', JSON.stringify(user));
  } catch {
    // ignore storage issues
  }
};

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  errorType?: 'NO_ACCOUNT' | 'WRONG_PASSWORD' | 'EMAIL_EXISTS' | 'INVALID_INPUT';
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const sendOtpToEmail = async (emailInput: string): Promise<{ success: boolean; message: string }> => {
  const email = emailInput.trim().toLowerCase();

  if (!email || !validateEmail(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address before requesting OTP.',
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: response.ok,
      message: data.message || 'OTP request failed.',
    };
  } catch {
    return {
      success: false,
      message: 'Unable to connect to the backend. Please try again in a moment.',
    };
  }
};

export const verifyOtpForEmail = async (emailInput: string, otpInput: string): Promise<{ success: boolean; message: string }> => {
  const email = emailInput.trim().toLowerCase();
  const otp = otpInput.trim();

  if (!email || !validateEmail(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address before verifying OTP.',
    };
  }

  if (!otp || otp.length !== 6) {
    return {
      success: false,
      message: 'Please enter the 6-digit OTP sent to your email.',
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: response.ok,
      message: data.message || 'OTP verification failed.',
    };
  } catch {
    return {
      success: false,
      message: 'Unable to verify OTP right now. Please try again.',
    };
  }
};

export const loginUser = async (emailInput: string, passwordInput: string): Promise<AuthResult> => {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  if (!email || !validateEmail(email)) {
    return {
      success: false,
      errorType: 'INVALID_INPUT',
      message: 'Please enter a valid email address.',
    };
  }

  if (!password) {
    return {
      success: false,
      errorType: 'INVALID_INPUT',
      message: 'Please enter your account password.',
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.user) {
      const user = toUserProfile(data.user);
      persistLocalUser(user);
      return {
        success: true,
        user,
        message: data.message || `Welcome back, ${user.name}! Login successful.`,
      };
    }

    if (response.status === 401) {
      return {
        success: false,
        errorType: 'WRONG_PASSWORD',
        message: data.message || 'Incorrect password.',
      };
    }

    return {
      success: false,
      errorType: 'NO_ACCOUNT',
      message: data.message || 'Unable to login right now. Please check your credentials and try again.',
    };
  } catch {
    return {
      success: false,
      errorType: 'INVALID_INPUT',
      message: 'Unable to connect to the backend server. Please make sure the backend is running on port 5001.',
    };
  }
};

export const registerUser = async (params: {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: 'Farmer / Grower' | 'Agronomist / Scientist' | 'SIH Evaluator / Student';
  primaryCrop?: string;
  farmLocation?: string;
  phone?: string;
}): Promise<AuthResult> => {
  const name = params.name.trim();
  const email = params.email.trim().toLowerCase();
  const password = params.password.trim();
  const confirmPassword = params.confirmPassword?.trim();
  const phone = (params.phone || '').trim();
  const location = params.farmLocation?.trim() || 'India Agro-Zone';

  if (!name || name.length < 2) {
    return {
      success: false,
      errorType: 'INVALID_INPUT',
      message: 'Please enter your full name (minimum 2 characters).',
    };
  }

  if (!email || !validateEmail(email)) {
    return {
      success: false,
      errorType: 'INVALID_INPUT',
      message: 'Please enter a valid email address.',
    };
  }

  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    return {
      success: false,
      errorType: 'INVALID_INPUT',
      message: 'Please enter a valid 10-digit mobile number.',
    };
  }

  if (!password || password.length < 8) {
    return {
      success: false,
      errorType: 'INVALID_INPUT',
      message: 'Password must be at least 8 characters long.',
    };
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return {
      success: false,
      errorType: 'INVALID_INPUT',
      message: 'Passwords do not match! Both passwords must be identical.',
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
        location,
        farmSize: 5,
        crop: params.primaryCrop || 'Tomato',
        category: mapRoleToBackendCategory(params.role),
        season: 'Kharif',
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.user) {
      const user = toUserProfile(data.user);
      persistLocalUser(user);
      return {
        success: true,
        user,
        message: data.message || `Account created successfully! Welcome ${user.name}.`,
      };
    }

    if (response.status === 409) {
      return {
        success: false,
        errorType: 'EMAIL_EXISTS',
        message: data.message || 'This email is already registered.',
      };
    }

    return {
      success: false,
      errorType: 'INVALID_INPUT',
      message: data.message || 'Unable to create your account right now.',
    };
  } catch {
    return {
      success: false,
      errorType: 'INVALID_INPUT',
      message: 'Unable to connect to the backend server. Please make sure the backend is running on port 5001.',
    };
  }
};

export const getLocalSessionUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem('farmerdetect_user');
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
};
