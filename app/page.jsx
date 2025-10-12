"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const ref = useRef();
  const [loading, setloading] = useState(false);
  const [gloading, setgloading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const session = useSession();



  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push("/home")
    }
  }, [session?.status, router])

  const handleSubmit = async (e) => {
    setloading(true)
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      toast.error(res.error)
      setloading(false)
    } else {
      toast.success("Logged in")
      router.push("/home")
      setloading(false)

    }

  };

  const SocialAction = () => {
    setgloading(true)
    signIn("google", {
      redirect: false
    })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid Credentials")
        }
        if (callback?.ok && !callback?.error) {
          toast.success("Logged in")
          router.push("/home")
        }
      })
      .finally(() => setgloading(false))

  }

  return (
    <div className="flex items-center justify-center py-20">
      <Card className=" w-[400px] ">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={ref} onSubmit={(e) => { handleSubmit(e); ref.current.reset() }} className="flex flex-col gap-4">
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" placeholder="Enter you Email" required />
            </div>
            <div className="relative">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  placeholder="Enter you Password"
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-500"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button disabled={loading} className="bg-blue-500" type="submit">Login{loading && <Loader2 className="animate-spin h-3 w-3" />}</Button>
          </form>
          <Button variant="outline" disabled={gloading} onClick={SocialAction} className="mt-2 w-full ">
            Sign in with Google
            {gloading && <Loader2 className="animate-spin h-3 w-3" />}
          </Button>

          <p className="mt-4 text-sm">
            Don’t have an account? <Link href="/register" className="underline">Register</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
