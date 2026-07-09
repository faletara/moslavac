import type { Match } from "@/types/hns";

export const groupAndSortMatches = (matches: Match[]) => {
  const grouped: Record<string, Match[]> = matches.reduce(
    (acc: Record<string, Match[]>, match) => {
      const date = new Date(match.dateTimeUTC ?? 0);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      acc[monthYear] = acc[monthYear] || [];
      acc[monthYear].push(match);
      return acc;
    },
    {}
  );

  Object.keys(grouped).forEach((month) => {
    grouped[month].sort(
      (a, b) => (b.dateTimeUTC ?? 0) - (a.dateTimeUTC ?? 0)
    );
  });

  const sortedMonths = Object.keys(grouped).sort((a, b) => {
    const [yearA, monthA] = a.split("-").map(Number);
    const [yearB, monthB] = b.split("-").map(Number);
    return yearB - yearA || monthB - monthA;
  });

  return { grouped, sortedMonths };
};
