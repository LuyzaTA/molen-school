import { redirect } from "next/navigation";

// Onboarding is now student registration. Middleware already redirects
// /onboarding → /register; this is a server-side fallback.
export default function OnboardingPage() {
  redirect("/register");
}