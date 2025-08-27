"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginFormData, loginSchema } from "./login.schema";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login(data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Signin error:", error);
      setErrorMessage("Invalid phone number or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
            SIGN IN TO YOUR ACCOUNT
          </CardTitle>
          <div className="w-8 h-0.5 bg-primary mx-auto mt-2"></div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-4 sm:space-y-6">
            {errorMessage && (
              <p className="text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                className="h-11 sm:h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="h-11 sm:h-12 border-gray-300 focus:border-primary focus:ring-primary text-base"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-right">
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors active:text-blue-900"
              >
                Forgot Password?
              </a>
            </div>

            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/80 active:bg-primary/90 text-white font-medium rounded-md transition-colors text-base"
            >
              {isLoading ? "SIGNING IN..." : "LOGIN"}
            </Button>

            <div className="text-center text-sm text-gray-600 pt-2">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="text-primary hover:text-primary/80 active:text-primary/90 font-medium transition-colors"
              >
                Register
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
