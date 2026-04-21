import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-24">
        <div className="text-center md:text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059]">
            Legal
          </span>
          <h1 className="mt-3 text-[32px] font-bold tracking-tight md:text-[40px]">
            Privacy Policy
          </h1>
        </div>
        <div className="mt-8 space-y-6 text-[13px] leading-relaxed text-[#5a5a65]">
          <p>
            Dominik Detailing is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our website and services.
          </p>

          <h2 className="text-[16px] font-semibold text-white">Information We Collect</h2>
          <p>
            When you submit a booking request, we collect your name, phone number, email address, vehicle details, address, and any notes you provide. This information is necessary for us to review your request and contact you.
          </p>

          <h2 className="text-[16px] font-semibold text-white">How We Use Your Information</h2>
          <p>
            We use your information solely to process booking requests, communicate with you about your appointment, and manage our schedule. We do not sell or share your personal data with third parties for marketing purposes.
          </p>

          <h2 className="text-[16px] font-semibold text-white">Data Storage</h2>
          <p>
            Your data is stored securely in our database. We retain booking records for operational and legal purposes. You may request deletion of your data by contacting us.
          </p>

          <h2 className="text-[16px] font-semibold text-white">Cookies</h2>
          <p>
            Our website does not use tracking cookies. Essential cookies may be used to maintain form state during your session.
          </p>

          <h2 className="text-[16px] font-semibold text-white">Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at info@dominikdetailing.co.uk.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
