"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { EyeIcon, EyeSlashIcon, XCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const router = useRouter();

    // Check if user is already logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/admin/dashboard');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Check if user email ends with @planetvanguard.org
            if (!userCredential.user.email.endsWith('@planetvanguard.org')) {
                throw new Error('Unauthorized access: Invalid domain');
            }

            if (rememberMe) {
                // Firebase handles persistence by default, but you can set a longer session if needed
                // setPersistence(auth, browserLocalPersistence);
                localStorage.setItem('rememberEmail', email);
            } else {
                localStorage.removeItem('rememberEmail');
            }

            router.push('/admin/dashboard');
        } catch (error) {
            console.error(error);
            if (error.message === 'Unauthorized access: Invalid domain') {
                setError('Access denied. Only Planet Vanguard organization emails are allowed.');
            } else {
                switch (error.code) {
                    case 'auth/invalid-credential':
                        setError('Invalid email or password.');
                        break;
                    case 'auth/user-disabled':
                        setError('This account has been disabled.');
                        break;
                    case 'auth/too-many-requests':
                        setError('Too many failed login attempts. Please try again later.');
                        break;
                    default:
                        setError('Failed to log in. Please try again.');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetSent(true);
            setShowResetForm(false);
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/user-not-found') {
                setError('No account found with this email address.');
            } else {
                setError('Failed to send reset email. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Load remembered email if available
        const rememberedEmail = localStorage.getItem('rememberEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 
      dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Heading */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/logo.svg"
                            alt="Planet Vanguard"
                            width={60}
                            height={60}
                            className="h-16 w-auto"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Planet Vanguard Admin
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Sign in to access your dashboard
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                    {/* Main Form */}
                    {!showResetForm ? (
                        <div className="p-8">
                            {resetSent && (
                                <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 p-3 rounded-lg flex items-center gap-2 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Password reset email sent! Check your inbox.
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg flex items-center gap-2 text-sm">
                                    <XCircleIcon className="h-5 w-5" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                      focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800"
                                        placeholder="admin@planetvanguard.org"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                        focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="h-4 w-4 text-emerald-600 border-gray-300 border rounded focus:ring-emerald-500"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            Remember me
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowResetForm(true)}
                                        className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 
                      text-white rounded-lg hover:from-emerald-700 hover:to-teal-600 focus:outline-none focus:ring-2 
                      focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Logging in...
                                            </>
                                        ) : (
                                            <>
                                                Sign in
                                                <ArrowRightIcon className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6">
                                <p className="text-center text-xs text-gray-600 dark:text-gray-400">
                                    Protected area for Planet Vanguard administrators only
                                </p>
                            </div>
                        </div>
                    ) : (
                        // Password Reset Form
                        <div className="p-8">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Reset Your Password</h2>

                            {error && (
                                <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg flex items-center gap-2 text-sm">
                                    <XCircleIcon className="h-5 w-5" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div>
                                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        id="reset-email"
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                      focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowResetForm(false)}
                                        className="w-1/2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white 
                      rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 
                      focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                    >
                                        Back to Login
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-1/2 flex justify-center items-center px-4 py-2 bg-emerald-600 
                      text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 
                      focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70"
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : "Send Reset Link"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                    >
                        ← Return to Planet Vanguard homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}