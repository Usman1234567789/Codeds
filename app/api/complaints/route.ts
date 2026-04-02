import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ComplaintRow = {
  id: string;
  date: string;
  week: string;
  region: string;
  subregion: string;
  city: string | null;
  complaint_type: string;
  status: "open" | "in_progress" | "resolved";
  resolution_time: number | null;
  created_at: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function safeNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function parseWeek(week: string) {
  const match = week.match(/^(\d{4})_W(\d{1,2})$/);
  if (!match) return null;

  return {
    year: Number(match[1]),
    week: Number(match[2]),
  };
}

function sortWeeks(weeks: string[]) {
  return [...weeks].sort((a, b) => {
    const aw = parseWeek(a);
    const bw = parseWeek(b);

    if (!aw || !bw) return a.localeCompare(b);
    if (aw.year !== bw.year) return aw.year - bw.year;
    return aw.week - bw.week;
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const selectedWeek = searchParams.get("week") || "ALL";
    const selectedRegion = searchParams.get("region") || "ALL";
    const selectedStatus = searchParams.get("status") || "ALL";

    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to fetch complaints data." },
        { status: 500 }
      );
    }

    const rows: ComplaintRow[] = (data || []) as ComplaintRow[];

    const allWeeks = sortWeeks(
      Array.from(new Set(rows.map((r) => r.week).filter(Boolean)))
    );

    const allRegions = Array.from(
      new Set(rows.map((r) => r.region).filter(Boolean))
    ).sort();

    const allStatuses = ["open", "in_progress", "resolved"];

    const latestWeek = allWeeks.length ? allWeeks[allWeeks.length - 1] : "ALL";
    const effectiveWeek = selectedWeek === "ALL" ? latestWeek : selectedWeek;

    const filtered = rows.filter((row) => {
      const weekOk = effectiveWeek === "ALL" ? true : row.week === effectiveWeek;
      const regionOk =
        selectedRegion === "ALL" ? true : row.region === selectedRegion;
      const statusOk =
        selectedStatus === "ALL" ? true : row.status === selectedStatus;

      return weekOk && regionOk && statusOk;
    });

    const totalComplaints = filtered.length;
    const resolvedCount = filtered.filter((r) => r.status === "resolved").length;
    const openCount = filtered.filter((r) => r.status === "open").length;
    const inProgressCount = filtered.filter(
      (r) => r.status === "in_progress"
    ).length;
    const pendingCount = openCount + inProgressCount;

    const resolvedTimes = filtered
      .filter((r) => r.status === "resolved")
      .map((r) => safeNumber(r.resolution_time))
      .filter((v) => v > 0);

    const avgResolutionTime =
      resolvedTimes.length > 0
        ? Number(
            (
              resolvedTimes.reduce((sum, val) => sum + val, 0) /
              resolvedTimes.length
            ).toFixed(1)
          )
        : 0;

    const byRegionMap = new Map<string, number>();
    filtered.forEach((row) => {
      byRegionMap.set(row.region, (byRegionMap.get(row.region) || 0) + 1);
    });

    const complaintsByRegion = Array.from(byRegionMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const byTypeMap = new Map<string, number>();
    filtered.forEach((row) => {
      byTypeMap.set(
        row.complaint_type,
        (byTypeMap.get(row.complaint_type) || 0) + 1
      );
    });

    const complaintsByType = Array.from(byTypeMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const trendBase = rows.filter((row) => {
      const regionOk =
        selectedRegion === "ALL" ? true : row.region === selectedRegion;
      const statusOk =
        selectedStatus === "ALL" ? true : row.status === selectedStatus;
      return regionOk && statusOk;
    });

    const byWeekMap = new Map<string, number>();
    trendBase.forEach((row) => {
      byWeekMap.set(row.week, (byWeekMap.get(row.week) || 0) + 1);
    });

    const complaintsTrend = sortWeeks(Array.from(byWeekMap.keys())).map((week) => ({
      week,
      complaints: byWeekMap.get(week) || 0,
    }));

    const bySubregionMap = new Map<string, number>();
    filtered.forEach((row) => {
      bySubregionMap.set(
        row.subregion,
        (bySubregionMap.get(row.subregion) || 0) + 1
      );
    });

    const complaintsBySubregion = Array.from(bySubregionMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const tableRows = [...filtered]
      .sort((a, b) => {
        const dateCmp = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateCmp !== 0) return dateCmp;
        return a.region.localeCompare(b.region);
      })
      .map((r) => ({
        id: r.id,
        date: r.date,
        week: r.week,
        region: r.region,
        subregion: r.subregion,
        city: r.city || "-",
        complaint_type: r.complaint_type,
        status: r.status,
        resolution_time:
          r.status === "resolved" ? safeNumber(r.resolution_time) : 0,
      }));

    return NextResponse.json({
      filters: {
        week: effectiveWeek,
        region: selectedRegion,
        status: selectedStatus,
      },
      options: {
        weeks: allWeeks,
        regions: allRegions,
        statuses: allStatuses,
      },
      cards: {
        totalComplaints,
        resolvedCount,
        pendingCount,
        avgResolutionTime,
      },
      charts: {
        complaintsByRegion,
        complaintsByType,
        complaintsTrend,
        complaintsBySubregion,
      },
      tableRows,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}