"use client";
import {
  RegisterMerchantDataType,
  RegisterMerchantType as InputDataType,
  SendResponseType,
} from "@repo/api";
import { useRegisterHook } from "../../hooks";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  ChevronRight,
  Wallet,
  AlertCircle,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StatusEnum, ValidationErrors } from "@/types/types";

import { Download, Lock, Shield } from "lucide-react";

import LoadingOverlay from "@/components/loading-overlay";
import { useAuthSession } from "@/context/session";

export default function IndexPage() {
  const { status } = useAuthSession();

  const router = useRouter();

  //WARNING:
  if (status === "authenticated") {
    router.push("/dashboard");
  }
  const { isLoading, registerMerchant } = useRegisterHook();

  const [inputData, setInputData] = useState<InputDataType>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);

  const [registrationData, setRegistrationData] =
    useState<RegisterMerchantDataType>({} as RegisterMerchantDataType);
  const [mnemonicCopied, setMnemonicCopied] = useState(false);
  const [publicKeyCopied, setPublicKeyCopied] = useState(false);
  const [mnemonicVisible, setMnemonicVisible] = useState(false);
  const [mnemonicConfirmed, setMnemonicConfirmed] = useState(false);
  const mnemonicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newErrors: ValidationErrors = {};

    if (touched.username && inputData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (touched.password && inputData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
  }, [inputData, touched]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setInputData((prev) => ({ ...prev, [id]: value }));
    setTouched((prev) => ({ ...prev, [id]: true }));
  }

  // Handle form submission - update to use isLoading from hook
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate all fields before submission
    setTouched({ username: true, password: true });

    const newErrors: ValidationErrors = {};
    if (inputData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (inputData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) return;

    const response: SendResponseType<RegisterMerchantDataType> =
      await registerMerchant(inputData);

    if (response.status === StatusEnum.success) {
      setRegistrationSuccess(true);
      setRegistrationData(response.data);
    }
  }

  // Copy mnemonic to clipboard
  function copyMnemonic() {
    if (registrationData?.mnemonic) {
      navigator.clipboard.writeText(registrationData.mnemonic);
      setMnemonicCopied(true);
      setTimeout(() => setMnemonicCopied(false), 2000);
    }
  }

  // Copy public key to clipboard
  function copyPublicKey() {
    if (registrationData?.publicKey) {
      navigator.clipboard.writeText(registrationData.publicKey);
      setPublicKeyCopied(true);
      setTimeout(() => setPublicKeyCopied(false), 2000);
    }
  }

  // Download mnemonic as text file
  function downloadMnemonic() {
    if (registrationData?.mnemonic) {
      const element = document.createElement("a");
      const file = new Blob(
        [
          `IMPORTANT: KEEP THIS RECOVERY PHRASE SAFE AND SECURE\n\n` +
            `Username: ${registrationData.username}\n` +
            `Public Key: ${registrationData.publicKey}\n\n` +
            `Recovery Phrase (Mnemonic):\n${registrationData.mnemonic}\n\n` +
            `WARNING: If you lose this recovery phrase, you will permanently lose access to your funds.\n` +
            `Do not share this recovery phrase with anyone.`,
        ],
        { type: "text/plain" },
      );

      element.href = URL.createObjectURL(file);
      element.download = `${registrationData.username}-recovery-phrase.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }

  function goToSignIn() {
    router.push("/signin");
  }

  const isFormValid =
    inputData.username.length >= 3 && inputData.password.length >= 6;

  const mnemonicWords = registrationData?.mnemonic
    ?.split(" ")
    .map((word, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-gray-800/80 rounded-md p-2 border border-gray-700"
      >
        <span className="text-gray-500 text-xs mr-2">{index + 1}.</span>
        <span className="font-mono">{word}</span>
      </div>
    ));

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
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <h1 className="mb-2 font-sans text-2xl font-bold text-white">
              Create Your Account
            </h1>
            <p className="text-sm text-gray-400">
              Join the future of Web3 payments
            </p>
          </div>

          {!registrationSuccess ? (
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
                    value={inputData.username}
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
                    value={inputData.password}
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

              {/* Register button */}
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
                      Creating Account...
                    </>
                  ) : (
                    "Register"
                  )}
                </span>
              </motion.button>

              {/* Sign in link */}
              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-blue-500 hover:text-blue-400"
                >
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              {!mnemonicConfirmed ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10"
                  >
                    <Shield className="h-10 w-10 text-green-500" />
                  </motion.div>

                  <h2 className="mb-2 text-xl font-bold text-white">
                    Save Your Recovery Phrase
                  </h2>
                  <p className="mb-6 text-gray-400">
                    This is the{" "}
                    <span className="text-amber-400 font-medium">ONLY WAY</span>{" "}
                    to recover your wallet if you lose access.
                  </p>

                  {/* Security warning */}
                  <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-left">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-amber-400 text-sm">
                          Critical Security Information
                        </h3>
                        <ul className="mt-2 text-xs text-amber-300/80 space-y-1">
                          <li>
                            • We{" "}
                            <span className="font-bold underline">NEVER</span>{" "}
                            store your recovery phrase
                          </li>
                          <li>
                            • If you lose it, your funds will be{" "}
                            <span className="font-bold">PERMANENTLY LOST</span>
                          </li>
                          <li>• Never share this phrase with anyone</li>
                          <li>• Store it in multiple secure locations</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Mnemonic phrase display */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-300">
                        Recovery Phrase
                      </h3>
                      <button
                        type="button"
                        onClick={() => setMnemonicVisible(!mnemonicVisible)}
                        className="text-xs flex items-center text-gray-400 hover:text-gray-300"
                      >
                        {mnemonicVisible ? (
                          <>
                            <EyeOff size={14} className="mr-1" /> Hide
                          </>
                        ) : (
                          <>
                            <Eye size={14} className="mr-1" /> Show
                          </>
                        )}
                      </button>
                    </div>

                    <div
                      ref={mnemonicRef}
                      className={`relative rounded-lg border border-gray-700 bg-gray-800/50 p-4 ${mnemonicVisible ? "" : "blur-sm hover:blur-[2px]"}`}
                      onClick={() =>
                        !mnemonicVisible && setMnemonicVisible(true)
                      }
                    >
                      {!mnemonicVisible && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-center bg-gray-900/80 px-3 py-2 rounded-lg backdrop-blur-sm">
                            <Lock className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-300">
                              Click to reveal
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-2">
                        {mnemonicWords}
                      </div>
                    </div>

                    {/* Public key display */}
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">
                        Public Key
                      </h3>
                      <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <p className="font-mono text-xs text-gray-300 truncate">
                          {registrationData?.publicKey}
                        </p>
                        <button
                          onClick={copyPublicKey}
                          className="ml-2 p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-700 transition-colors"
                        >
                          {publicKeyCopied ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <motion.button
                      onClick={copyMnemonic}
                      className="flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 py-3 px-4 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-gray-750 hover:text-white"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {mnemonicCopied ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Phrase
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      onClick={downloadMnemonic}
                      className="flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 py-3 px-4 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-gray-750 hover:text-white"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </motion.button>
                  </div>

                  <motion.button
                    onClick={() => setMnemonicConfirmed(true)}
                    className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-px font-medium text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                    <span className="relative flex h-12 items-center justify-center">
                      I've Saved My Recovery Phrase
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </span>
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10"
                  >
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </motion.div>

                  <h2 className="mb-2 text-xl font-bold text-white">
                    Registration Successful!
                  </h2>
                  <p className="mb-6 text-gray-400">
                    Your account has been created successfully.
                  </p>

                  <motion.button
                    onClick={goToSignIn}
                    className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-px font-medium text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                    <span className="relative flex h-12 items-center justify-center">
                      Continue to Sign In
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </span>
                  </motion.button>
                </>
              )}
            </motion.div>
          )}
          {/* Add the LoadingOverlay component to the JSX, right before the closing div of the main container */}
          <LoadingOverlay
            isVisible={isLoading}
            message="Creating your account..."
          />
        </motion.div>

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
