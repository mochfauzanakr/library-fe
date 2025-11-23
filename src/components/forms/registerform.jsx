import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "../ui/checkbox"
import Link from "next/link"

export function RegisterForm() {
  return (
    <form className="gap-2 justify-center flex flex-col w-3/4">
      <h1 className="font-bold text-4xl mb-2">Create An Account</h1>
      <h2 className="mb-8"> already have an account? <Link href='/login' className="text-blue-600">Login</Link></h2>
      <Input type="text" placeholder="Username" className="mb-2 h-12"/>
      <Input type="email" placeholder="Email" className="mb-2 h-12"/>
      <Input type="password" placeholder="Password" className="mb-2 h-12"/>
      <div className="mb-8">
        <Checkbox id='terms'/>
        <label htmlFor="terms" className="text-sm ml-2">I agree to the <Link className="text-blue-600" href='/'>terms and conditions</Link></label>
      </div>
      <Button type="submit" className="w-full">Log In</Button>
    </form>
  );
}