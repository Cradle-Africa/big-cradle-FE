"use client";
import LoginImage from "@/app/components/LoginImage";
import ForgotPassword from "@/app/components/user/ForgotPassword";
import { addToken, addUser } from "@/app/utils/user/userData";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import ForgotPasswordCode from "../../../components/user/ForgotPasswordCode";
import ResetPassword from "../../../components/user/ResetPassword";
import { signInService } from "../../../services/user/userService";
import { validateSignIn } from "../validation/userValidation";
import LogoWithText from "@/public/images/logo-with-text.png"

export default function SignInPage() {
  const [openReset, setOpenReset] = useState(false);
  const [openResetCode, setOpenResetCode] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateSignIn(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      toast.loading("Loading...");
      const response = await signInService(payload);
      addUser(response.data);
      addToken(response.accessToken);
      if (response.data.role === "business") {
        localStorage.setItem("businessId", response.data.id);
      } else if (response.data.role === "admin") {
        localStorage.setItem("adminUserId", response.data.id);
      }
      toast.dismiss();
      toast.success("Signed in successfully!");
      window.location.href = "/";
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.dismiss();
        toast.error(error.message || "Sign in failed");
      } else {
        toast.dismiss();
        toast.error("Sign in failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-between gap-16 md:py-0 bg-white">
      <div className="flex items-center justify-center w-full max-w-[400px] md:px-12 py-4 bg-white">
        {openReset && (
          <ForgotPassword
            openReset={openReset}
            setOpenReset={setOpenReset}
            openResetCode={openResetCode}
            setOpenResetCode={setOpenResetCode}
            setEmail={setEmail}
          />
        )}

        {openResetCode && (
          <ForgotPasswordCode
            openResetCode={openResetCode}
            setOpenResetCode={setOpenResetCode}
            setOpenResetPassword={setOpenResetPassword}
            setResetToken={setResetToken}
          />
        )}

        {openResetPassword && (
          <ResetPassword
            email={email}
            resetToken={resetToken}
            setopenResetPassword={setOpenResetPassword}
          />
        )}

        <div className="w-full max-w-md space-y-6 text-sm">
          <Image
            src={LogoWithText}
            width={200}
            height={200}
            alt="Big Cradle Logo"
            className="mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-700">
            Welcome to Big Cradle
          </h3>
          <p className="text-gray-700 text-sm">
            Do not have an account with us?
            <Link href="/pages/user/signup" className="underline ml-1">
              Sign up
            </Link>
          </p>
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md text-gray-700 py-2 hover:cursor-pointer">
            <FcGoogle className="text-md font-semibold" />
            Continue with Google
          </button>

          <div className="flex items-center gap-2">
            <hr className="flex-grow border-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none "
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none "
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Forgot password?
              <a
                className="underline ml-1 text-blue-500 hover:cursor-pointer"
                onClick={() => setOpenReset(!openReset)}
              >
                Reset now
              </a>
            </p>
            <hr className="mt-5 border-gray-200" />

            <button
              type="submit"
              className={`w-full py-2 rounded-md hover:cursor-pointer text-gray-400 bg-gray-200 ${
                isSubmitting
                  ? "bg-gray-300"
                  : "shadow-md hover:text-white hover:bg-gradient-to-br hover:from-[#578CFF] hover:to-[#0546D2] hover:opacity-90"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
      <LoginImage />
    </div>
  );
}
