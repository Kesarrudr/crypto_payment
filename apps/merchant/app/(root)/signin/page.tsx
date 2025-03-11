"use client";

import { showErrorNotification } from "@/components/error-card";
import LoadingOverlay from "@/components/loading-overlay";
import { useAuthSession } from "@/context/session";
import { FormErrors, ValidationErrors } from "@/types/types";
import { LoginMerchantType } from "@repo/api";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Eye, EyeOff, LogIn, XCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const [credentials, setCredentials] = useState<LoginMerchantType>({
    username: "",
    password: "",
  });
  const { status } = useAuthSession();

  //WARNING: Should be a protected route
  if (status === "authenticated") {
    router.push("/dashboard");
  }

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    const newErrors: ValidationErrors = {};

    if (touched.username && credentials.username.length < 1) {
      newErrors.username = "Invalid UserName";
    }

    if (touched.password && credentials.password.length < 1) {
      newErrors.password = "Invalid Password";
    }

    setErrors(newErrors);
  }, [credentials, touched]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
    setTouched((prev) => ({ ...prev, [id]: true }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setTouched({ username: true, password: true });

    const newErrors: ValidationErrors = {};
    if (credentials.username.length < 1) {
      newErrors.username = "Invalid Username";
    }
    if (credentials.password.length < 1) {
      newErrors.password = "Invalid Password";
    }

    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) return;

    setErrors({});
    try {
      setisLoading(true);
      const res = await signIn("credentials", {
        username: credentials.username,
        password: credentials.password,
        redirect: false,
      });

      if (res?.error) {
        showErrorNotification(res.error, 401);
      }

      if (res?.ok) {
        router.push("/dashboard");
      }
    } finally {
      setisLoading(false);
    }
  }

  const isFormValid = credentials.username && credentials.password;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 p-4">
      <div className="relative w-full max-w-md">
        {/* Background decorative elements */}
        <div className="absolute -top-32 -left-40 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-40 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"></div>

        {/* Main container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80 p-8 backdrop-blur-xl"
          style={{
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.1)",
          }}
        >
          {/* Logo and title */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <h1 className="mb-2 font-sans text-2xl font-bold text-white">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username field */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <div className="relative">
                <motion.input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={handleOnChange}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, username: true }))
                  }
                  className={`w-full rounded-lg border bg-gray-800/50 p-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 ${
                    errors.username && touched.username
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : touched.username && !errors.username
                        ? "border-green-500/50 focus:ring-green-500/20"
                        : "border-gray-700 focus:ring-blue-500/20"
                  }`}
                  animate={
                    errors.username && touched.username
                      ? { x: [0, -10, 10, -10, 10, 0] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                />

                {/* Validation icon */}
                <AnimatePresence>
                  {touched.username && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {errors.username ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {errors.username && touched.username && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 text-xs text-red-400"
                  >
                    {errors.username}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <motion.input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={credentials.password}
                  onChange={handleOnChange}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, password: true }))
                  }
                  className={`w-full rounded-lg border bg-gray-800/50 p-3 pr-10 text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 ${
                    errors.password && touched.password
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : touched.password && !errors.password
                        ? "border-green-500/50 focus:ring-green-500/20"
                        : "border-gray-700 focus:ring-blue-500/20"
                  }`}
                  animate={
                    errors.password && touched.password
                      ? { x: [0, -10, 10, -10, 10, 0] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                />

                {/* Toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {errors.password && touched.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 text-xs text-red-400"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Login button */}
            <motion.button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-px font-medium text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] disabled:cursor-not-allowed disabled:opacity-70`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <span className="relative flex h-12 items-center justify-center">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging In...
                  </>
                ) : (
                  "Login"
                )}
              </span>
            </motion.button>

            {/* Sign in link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don't hava an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                Create an account
              </Link>
            </p>
          </form>
        </motion.div>

        <LoadingOverlay isVisible={isLoading} message="Logging In..." />

        {/* Web3 branding */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Powered by{" "}
            <span className="font-medium text-blue-500">Web3 Payments</span>
          </p>
        </div>
      </div>
    </div>
  );
}
