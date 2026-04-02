import Link from "next/link";
import {
  BarChart3,
  Activity,
  Gauge,
  ShieldCheck,
  LifeBuoy,
  Cpu,
  ArrowRight,
} from "lucide-react";

const dashboards = [
  {
    title: "Customer Support Analytics Dashboard",
    description:
      "Track complaint volume, monitor resolution performance, and analyze support trends across regions.",
    href: "/dashboard/complaints",
    badge: "Live Dashboard",
    icon: LifeBuoy,
    accent: "from-sky-500 to-cyan-500",
  },
  {
    title: "Network Utilization Analytics Dashboard",
    description:
      "Monitor high traffic patterns, identify load concentration, and review network utilization insights.",
    href: "/dashboard/hu",
    badge: "Portfolio Module",
    icon: Gauge,
    accent: "from-lime-500 to-emerald-500",
  },
  {
    title: "Network Efficiency & Optimization Dashboard",
    description:
      "Analyze low utilization trends, uncover underused capacity, and support optimization planning.",
    href: "/dashboard/low-utilized",
    badge: "Portfolio Module",
    icon: BarChart3,
    accent: "from-fuchsia-500 to-pink-500",
  },
  {
    title: "Network Activity Monitoring Dashboard",
    description:
      "Detect inactive sites, monitor traffic gaps, and review operational traffic activity patterns.",
    href: "/dashboard/zero-traffic",
    badge: "Portfolio Module",
    icon: Activity,
    accent: "from-amber-500 to-orange-500",
  },
  {
    title: "Service Availability & Reliability Dashboard",
    description:
      "Review service uptime, abnormal sites, and regional reliability performance from an operations view.",
    href: "/dashboard/eas",
    badge: "Portfolio Module",
    icon: ShieldCheck,
    accent: "from-violet-500 to-indigo-500",
  },
  {
    title: "Power & Infrastructure Monitoring Dashboard",
    description:
      "Track power status, operational site performance, and infrastructure-level monitoring insights.",
    href: "/dashboard/dg",
    badge: "Portfolio Module",
    icon: Cpu,
    accent: "from-rose-500 to-red-500",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.10),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.10),_transparent_30%)]" />
            <div className="relative px-6 py-10 md:px-10 md:py-14">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Analytics Portfolio
              </div>

              <div className="mt-5 max-w-4xl">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                  Interactive Dashboard Showcase
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                  A curated portfolio of analytics dashboards built with
                  Next.js, Supabase, and Recharts. Each module is designed to
                  present complex data in a clear, business-friendly, and
                  visually engaging way.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Stack
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    Next.js · Supabase · Recharts
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Focus
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    Analytics · Monitoring · Operational Insights
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Purpose
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    Portfolio · LinkedIn · Client Demos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {dashboards.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-sm`}
                  >
                    <Icon size={22} />
                  </div>

                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {item.badge}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold leading-snug text-slate-900">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="h-1.5 w-20 rounded-full bg-slate-100">
                    <div
                      className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${item.accent}`}
                    />
                  </div>

                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition group-hover:text-slate-900">
                    Open Dashboard
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                About This Portfolio
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Built for practical, business-ready analytics
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                These dashboards are designed to demonstrate strong data
                storytelling, clear KPI presentation, and professional frontend
                implementation suitable for portfolio showcases, recruiter
                reviews, and client-facing demos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:min-w-[280px]">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  UI Style
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  Clean · Modern · Minimal
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Audience
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  Recruiters · Clients · Teams
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}