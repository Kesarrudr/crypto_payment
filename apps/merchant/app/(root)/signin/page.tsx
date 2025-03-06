"use client";

import { useAuthSession } from "@/context/session";
import { RegisterMerchantType } from "@repo/api";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const [userData, setUserData] = useState<RegisterMerchantType>({
    username: "",
    password: "",
  });
  const { status } = useAuthSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  //
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard"); // Redirect if logged in
    }
  }, [status, router]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    setIsLoading(true);

    const res = await signIn("credentials", {
      username: userData.username,
      password: userData.password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <input
          id="username"
          type="text"
          placeholder="Username"
          onChange={handleOnChange}
          value={userData.username}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          onChange={handleOnChange}
          value={userData.password}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
