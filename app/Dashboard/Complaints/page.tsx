"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

type DashboardResponse = {
  filters: {
    week: string;
    region: string;
    status: string;
  };
  options: {
    weeks: string[];
    regions: string[];
    statuses: string[];
  };
  cards: {
    totalComplaints: number;
    resolvedCount: number;
    pendingCount: number;
    avgResolutionTime: number;
  };
  charts: {
    complaintsByRegion: { name: string; value: number }[];
    complaintsByType: { name: string; value: number }[];
    complaintsTrend: { week: string; complaints: number }[];
    complaintsBySubregion: { name: string; value: number }[];
  };
  tableRows: {
    id: string;
    date: string;
    week: string;
    region: string;
    subregion: string;
    city: string;
    complaint_type: string;
    status: string;
    resolution_time: number;
  }[];
};

const COLORS = {
  green: "#92d050",
  pink: "#f1379b",
  blue: "#3b82f6",
  orange: "#f59e0b",
  slate: "#475569",
  border: "#e2e8f0",
  text: "#0f172a",
  subtext: "#64748b",
  bg: "#f8fafc",
  card: "#ffffff",
};

const PIE_COLORS = [
  COLORS.green,
  COLORS.pink,
  COLORS.blue,
  COLORS.orange,
  "#14b8a6",
];

function formatStatus(status: string) {
  if (status === "in_progress") return "In Progress";
  if (status === "open") return "Open";
  if (status === "resolved") return "Resolved";
  return status;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xl">
      {label ? (
        <p className="mb-1 text-sm font-semibold text-slate-900">{label}</p>
      ) : null}
      {payload.map((entry: any, idx: number) => (
        <p key={idx} className="text-sm text-slate-700">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

function LoadingDashboard() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-[#92d050]" />
        <h3 className="mt-5 text-xl font-bold text-slate-900">
          Loading dashboard...
        </h3>
        <p className="mt-2 text-center text-sm text-slate-500">
          Please wait while the latest complaints data is being prepared.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  accent,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div
        className="mb-4 h-2 w-16 rounded-full"
        style={{ backgroundColor: accent }}
      />
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </h3>
      {subtitle ? <p className="mt-2 text-xs text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function ComplaintsDashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [week, setWeek] = useState("ALL");
  const [region, setRegion] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  async function fetchDashboard() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        week,
        region,
        status,
      });

      const res = await fetch(`/api/complaints?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const json: DashboardResponse = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, [week, region, status]);

  useEffect(() => {
    if (!data) return;

    if (week === "ALL" && data.filters.week && data.filters.week !== "ALL") {
      setWeek(data.filters.week);
    }
  }, [data, week]);

  const subregionChartData = useMemo(() => {
    if (!data) return [];
    return data.charts.complaintsBySubregion.slice(0, 10);
  }, [data]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
        <LoadingDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Customer Support Analytics
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Complaints Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Monitor complaint volume, track resolution status, and analyze
                operational trends across regions and complaint types.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Week
                </label>
                <select
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400"
                >
                  <option value="ALL">All</option>
                  {data?.options.weeks.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400"
                >
                  <option value="ALL">All</option>
                  {data?.options.regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400"
                >
                  <option value="ALL">All</option>
                  {data?.options.statuses.map((s) => (
                    <option key={s} value={s}>
                      {formatStatus(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingDashboard />
        ) : data ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Complaints"
                value={data.cards.totalComplaints}
                subtitle="Filtered complaint count"
                accent={COLORS.blue}
              />
              <StatCard
                title="Resolved"
                value={data.cards.resolvedCount}
                subtitle="Successfully resolved cases"
                accent={COLORS.green}
              />
              <StatCard
                title="Pending"
                value={data.cards.pendingCount}
                subtitle="Open + in progress"
                accent={COLORS.pink}
              />
              <StatCard
                title="Avg Resolution Time"
                value={`${data.cards.avgResolutionTime} hrs`}
                subtitle="Based on resolved complaints"
                accent={COLORS.orange}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <SectionCard title="Complaints by Region">
                <div className="h-[330px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.charts.complaintsByRegion}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#475569", fontSize: 12 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={{ stroke: "#cbd5e1" }}
                      />
                      <YAxis
                        tick={{ fill: "#475569", fontSize: 12 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={{ stroke: "#cbd5e1" }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="value"
                        name="Complaints"
                        fill={COLORS.green}
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard title="Complaints by Type">
                <div className="h-[330px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.charts.complaintsByType}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) =>
                          `${name} ${(((percent ?? 0) as number) * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {data.charts.complaintsByType.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.name}-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: "#334155", fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <SectionCard title="Complaints Trend">
                <div className="h-[330px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.charts.complaintsTrend}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="week"
                        tick={{ fill: "#475569", fontSize: 12 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={{ stroke: "#cbd5e1" }}
                      />
                      <YAxis
                        tick={{ fill: "#475569", fontSize: 12 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={{ stroke: "#cbd5e1" }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: "#334155", fontSize: "12px" }} />
                      <Line
                        type="monotone"
                        dataKey="complaints"
                        name="Complaints"
                        stroke={COLORS.pink}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard title="Top Subregions">
                <div className="h-[330px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={subregionChartData}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        tick={{ fill: "#475569", fontSize: 12 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={{ stroke: "#cbd5e1" }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={85}
                        tick={{ fill: "#475569", fontSize: 12 }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={{ stroke: "#cbd5e1" }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="value"
                        name="Complaints"
                        fill={COLORS.blue}
                        radius={[0, 10, 10, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>
            </div>

            <SectionCard title="Complaint Details">
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      {[
                        "Date",
                        "Week",
                        "Region",
                        "Subregion",
                        "City",
                        "Type",
                        "Status",
                        "Resolution Time",
                      ].map((head) => (
                        <th
                          key={head}
                          className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {data.tableRows.length > 0 ? (
                      data.tableRows.map((row) => (
                        <tr key={row.id} className="transition hover:bg-slate-50">
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">
                            {row.date}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">
                            {row.week}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">
                            {row.region}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">
                            {row.subregion}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">
                            {row.city}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">
                            {row.complaint_type}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                row.status === "resolved"
                                  ? "bg-green-100 text-green-700"
                                  : row.status === "in_progress"
                                  ? "bg-pink-100 text-pink-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {formatStatus(row.status)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">
                            {row.status === "resolved"
                              ? `${row.resolution_time} hrs`
                              : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-10 text-center text-sm text-slate-500"
                        >
                          No records found for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </>
        ) : (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load dashboard data.
          </div>
        )}
      </div>
    </div>
  );
}