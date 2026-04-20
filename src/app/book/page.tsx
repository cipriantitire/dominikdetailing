import Link from "next/link";

const fields = [
  "Name",
  "Phone",
  "Email",
  "Vehicle",
  "Postcode",
  "Preferred date",
  "Preferred time",
  "Service",
];

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#090909] px-5 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-[#d7d7d7]">
          Back to home
        </Link>

        <section className="mt-10">
          <p className="text-sm font-semibold text-[#62c275]">
            Booking request
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">
            Tell us what the car needs.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#d7d7d7]">
            This is a request, not an instant booking. Customer requested time
            and the final planned schedule are kept separate until the owner
            confirms the job.
          </p>
        </section>

        <form className="mt-8 grid gap-4 rounded-md border border-white/10 bg-[#151515] p-5">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <label key={field} className="grid gap-2 text-sm font-semibold">
                {field}
                <input
                  className="min-h-11 rounded-md border border-white/10 bg-[#0d0d0d] px-3 text-base font-normal text-white outline-none transition focus:border-[#d63d2e]"
                  placeholder={field}
                />
              </label>
            ))}
          </div>
          <label className="grid gap-2 text-sm font-semibold">
            Notes
            <textarea
              className="min-h-32 rounded-md border border-white/10 bg-[#0d0d0d] px-3 py-3 text-base font-normal text-white outline-none transition focus:border-[#d63d2e]"
              placeholder="Anything we should know about the vehicle or access?"
            />
          </label>
          <button
            type="button"
            className="rounded-md bg-[#d63d2e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ec4b3a]"
          >
            Submit request
          </button>
        </form>
      </div>
    </main>
  );
}
