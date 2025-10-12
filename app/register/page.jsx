"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {toast} from "sonner";
import Link from "next/link";
export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const ref = useRef();
  const handleSubmit = async (e) => {
    setloading(true)
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setloading(false)
      router.push("/");
      toast.success("Account created ")
    } else {
      const data = await res.json();
      toast.error(data.message);
      setloading(false)
    }
  };


  return (
    <div className="flex items-center justify-center py-10">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={ref} onSubmit={(e) => { handleSubmit(e); ref.current.reset() }} className="flex flex-col gap-4">
            <Label>Name</Label>
            <Input onChange={(e) => setFormData({ ...formData, name: e.target.value })} name="name" placeholder='Enter your Name' />
            <Label>Email</Label>
            <Input onChange={(e) => setFormData({ ...formData, email: e.target.value })} name="email" placeholder="Enter your Email" />

            <div className="relative">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength="8"
                  pattern="[A-Za-z0-9]{8,}"
                  placeholder="Enter password (min 8 characters)"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button disabled={loading} className="bg-blue-500" type="submit">Register{loading && <Loader2 className="animate-spin h-3 w-3" />}</Button>
          </form>
          <p className="mt-4 text-sm">
            Already have an account? <Link href="/" className="underline">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
