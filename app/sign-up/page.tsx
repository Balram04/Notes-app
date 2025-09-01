import SplitAuthCard from "@/components/split-auth-card"
import { SignUpForm } from "@/components/sign-up-form"

export default function Page() {
  return (
    <SplitAuthCard title="Sign up" subtitle="Create your account to get started.">
      <SignUpForm />
    </SplitAuthCard>
  )
}
