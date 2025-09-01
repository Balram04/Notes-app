import SplitAuthCard from "@/components/split-auth-card"
import { SignInForm } from "@/components/sign-in-form"

export default function Page() {
  return (
    <SplitAuthCard title="Sign in" subtitle="Please enter your credentials to continue.">
      <SignInForm />
    </SplitAuthCard>
  )
}
