import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Terms of Service
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#a3a3a3]">
          <p>
            By using the Dominik Detailing website and submitting a booking request, you agree to these terms of service.
          </p>

          <h2 className="text-lg font-semibold text-white">Booking Requests</h2>
          <p>
            Submitting a form on this website constitutes a booking request, not a confirmed appointment. All requests are subject to review and confirmation by Dominik Detailing. We reserve the right to decline or reschedule any request based on availability.
          </p>

          <h2 className="text-lg font-semibold text-white">Pricing</h2>
          <p>
            All prices listed are starting prices and may vary based on vehicle size, condition, and selected extras. A final quote will be provided before confirmation.
          </p>

          <h2 className="text-lg font-semibold text-white">Cancellation</h2>
          <p>
            We request at least 24 hours notice for cancellations or rescheduling. Late cancellations may incur a fee.
          </p>

          <h2 className="text-lg font-semibold text-white">Satisfaction Guarantee</h2>
          <p>
            We stand behind our work. If you are not satisfied with the service, please contact us within 48 hours and we will make it right.
          </p>

          <h2 className="text-lg font-semibold text-white">Liability</h2>
          <p>
            Dominik Detailing takes every precaution to protect your vehicle. However, we are not liable for pre-existing damage or conditions that are revealed during the detailing process.
          </p>

          <h2 className="text-lg font-semibold text-white">Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of our services constitutes acceptance of the updated terms.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
