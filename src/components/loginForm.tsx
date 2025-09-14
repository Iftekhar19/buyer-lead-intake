"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/zod-schemas/schemas";
import { useState } from "react";
import { loginAction } from "@/actions/liginAction";

export default function LoginForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    setMessage("");

    try {
     const res=await loginAction(data)
     console.log(res)
      if (!res.success) {
        setMessage( "Login failed");
      } else {
        setMessage(`Welcome ${res?.name}`);
      }
    } catch (err) {
        console.log(err)
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
      <input
        type="email"
        placeholder="Email"
        {...register("email")}
        className="border rounded p-2"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Password"
        {...register("password")}
        className="border rounded p-2"
      />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded p-2"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && <p className="text-sm text-center mt-2">{message}</p>}
    </form>
  );
}
