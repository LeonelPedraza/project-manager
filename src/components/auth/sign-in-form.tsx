import { useState } from "react"
import { supabase } from "@/providers/supabase"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"; 
import { z } from "zod";

import { cn } from "@/utils/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoginFormFooter } from "./login-form-footer"
import { LoginFormHeader } from "./login-form-header"
import { Link, useNavigate } from "react-router"
import { LoginPolicyTerms } from "./login-policy-terms"

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const handleLogin = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const { email, password } = data;
      const { data: res, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log(res);
      console.log(error?.message);
      if (error) throw Error(error.message);
      // Update this route to redirect to an authenticated route. The user already has an active session.
      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      console.error('An unexpected error occurred:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-6">
          <LoginFormHeader>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </LoginFormHeader>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register('email')}
              />
              { errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                {...register('password')}
              />
              { errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              { loading ? "Login..." : "Login" }
            </Button>
            { error && <p className="text-red-500">{error}</p>}
          </div>          
          <LoginFormFooter/>
        </div>
      </form>
      <LoginPolicyTerms/>
    </div>
  )
}
