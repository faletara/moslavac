"use client";

import {
	addDays,
	addMonths,
	addWeeks,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	isToday,
	startOfDay,
	startOfMonth,
	startOfWeek,
	subMonths,
	subWeeks,
} from "date-fns";
import { hr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
	type CompetitionCategory,
	getCategoryBorderClass,
	getCategoryChipClass,
	getCategoryShortLabel,
	getCompetitionCategory,
} from "@/lib/helpers/competition";
import { buildMatchSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { HnsMatch } from "@/types/hns";

type View = "month" | "week" | "day";

type CalendarEvent = {
	id: number;
	slug: string;
	date: Date;
	home: string;
	away: string;
	competition: string;
	category: CompetitionCategory;
};

interface MatchesCalendarProps {
	matches: HnsMatch[];
}

const WEEKDAY_LABELS = ["pon", "uto", "sri", "čet", "pet", "sub", "ned"];
const WEEKDAY_LABELS_LONG = [
	"Ponedjeljak",
	"Utorak",
	"Srijeda",
	"Četvrtak",
	"Petak",
	"Subota",
	"Nedjelja",
];
const MONTH_VIEW_MAX_EVENTS = 3;

export default function MatchesCalendar({ matches }: MatchesCalendarProps) {
	const router = useRouter();
	const [view, setView] = useState<View>("month");
	const [cursor, setCursor] = useState<Date>(() => new Date());

	// Default to week view on mobile. Done in an effect (not the initial state)
	// to avoid SSR/client hydration mismatch — SSR has no window.matchMedia.
	useEffect(() => {
		if (window.matchMedia("(max-width: 639px)").matches) {
			setView("week");
		}
	}, []);

	const events = useMemo<CalendarEvent[]>(
		() =>
			matches
				.filter((m) => m.id != null && m.dateTimeUTC != null)
				.map((m) => ({
					id: m.id as number,
					slug: buildMatchSlug(m),
					date: new Date(m.dateTimeUTC as number),
					home: m.homeTeam?.name ?? "N/A",
					away: m.awayTeam?.name ?? "N/A",
					competition: m.competition?.name ?? "",
					category: getCompetitionCategory(m.competition?.name),
				}))
				.sort((a, b) => a.date.getTime() - b.date.getTime()),
		[matches],
	);

	const goPrev = () => {
		if (view === "month") setCursor(subMonths(cursor, 1));
		else if (view === "week") setCursor(subWeeks(cursor, 1));
		else setCursor(addDays(cursor, -1));
	};

	const goNext = () => {
		if (view === "month") setCursor(addMonths(cursor, 1));
		else if (view === "week") setCursor(addWeeks(cursor, 1));
		else setCursor(addDays(cursor, 1));
	};

	const goToday = () => setCursor(new Date());

	const headerLabel = useMemo(() => {
		if (view === "month") return format(cursor, "LLLL yyyy.", { locale: hr });
		if (view === "week") {
			const start = startOfWeek(cursor, { weekStartsOn: 1 });
			const end = endOfWeek(cursor, { weekStartsOn: 1 });
			const sameMonth = isSameMonth(start, end);
			return sameMonth
				? `${format(start, "d.", { locale: hr })}–${format(end, "d. LLLL yyyy.", { locale: hr })}`
				: `${format(start, "d. LLL", { locale: hr })} – ${format(end, "d. LLL yyyy.", { locale: hr })}`;
		}
		return format(cursor, "EEEE, d. LLLL yyyy.", { locale: hr });
	}, [cursor, view]);

	const handleEventClick = (slug: string) => router.push(`/utakmice/${slug}`);

	const handleDayClick = (date: Date) => {
		setCursor(date);
		setView("day");
	};

	return (
		<div className="space-y-8">
			<Toolbar
				label={headerLabel}
				view={view}
				onPrev={goPrev}
				onNext={goNext}
				onToday={goToday}
				onSetView={setView}
			/>

			{view === "month" && (
				<MonthView
					cursor={cursor}
					events={events}
					onDayClick={handleDayClick}
					onEventClick={handleEventClick}
				/>
			)}
			{view === "week" && (
				<WeekView
					cursor={cursor}
					events={events}
					onDayClick={handleDayClick}
					onEventClick={handleEventClick}
				/>
			)}
			{view === "day" && (
				<DayView cursor={cursor} events={events} onEventClick={handleEventClick} />
			)}
		</div>
	);
}

/* ------------------------------------------------------------------ */
/* Toolbar                                                            */
/* ------------------------------------------------------------------ */

interface ToolbarProps {
	label: string;
	view: View;
	onPrev: () => void;
	onNext: () => void;
	onToday: () => void;
	onSetView: (v: View) => void;
}

function Toolbar({
	label,
	view,
	onPrev,
	onNext,
	onToday,
	onSetView,
}: ToolbarProps) {
	const views: { value: View; label: string }[] = [
		{ value: "month", label: "Mjesec" },
		{ value: "week", label: "Tjedan" },
		{ value: "day", label: "Dan" },
	];

	return (
		<div className="flex flex-col gap-6 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onToday}
					className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
				>
					Danas
				</button>
				<span className="mx-2 h-3 w-px bg-border/60" aria-hidden />
				<button
					type="button"
					onClick={onPrev}
					aria-label="Prethodni"
					className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
				>
					<ChevronLeft className="size-4" />
				</button>
				<button
					type="button"
					onClick={onNext}
					aria-label="Sljedeći"
					className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
				>
					<ChevronRight className="size-4" />
				</button>
			</div>

			<h2 className="text-2xl font-black uppercase leading-none tracking-tighter sm:text-3xl">
				{label}
			</h2>

			<div className="flex items-center gap-6">
				{views.map((v) => (
					<button
						key={v.value}
						type="button"
						onClick={() => onSetView(v.value)}
						className={cn(
							"text-[0.65rem] font-medium uppercase tracking-[0.3em] transition-colors",
							view === v.value
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{v.label}
					</button>
				))}
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/* Month view                                                         */
/* ------------------------------------------------------------------ */

interface MonthViewProps {
	cursor: Date;
	events: CalendarEvent[];
	onDayClick: (date: Date) => void;
	onEventClick: (slug: string) => void;
}

function MonthView({ cursor, events, onDayClick, onEventClick }: MonthViewProps) {
	const days = useMemo(() => {
		const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
		const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
		const result: Date[] = [];
		let d = start;
		while (d <= end) {
			result.push(d);
			d = addDays(d, 1);
		}
		return result;
	}, [cursor]);

	const eventsByDay = useMemo(() => {
		const map = new Map<string, CalendarEvent[]>();
		for (const ev of events) {
			const key = format(startOfDay(ev.date), "yyyy-MM-dd");
			const list = map.get(key) ?? [];
			list.push(ev);
			map.set(key, list);
		}
		return map;
	}, [events]);

	return (
		<div className="border-t border-l border-border/60">
			<div className="grid grid-cols-7">
				{WEEKDAY_LABELS.map((wd) => (
					<div
						key={wd}
						className="border-r border-b border-border/60 px-2 py-3 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground"
					>
						{wd}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7">
				{days.map((day) => {
					const inMonth = isSameMonth(day, cursor);
					const today = isToday(day);
					const key = format(day, "yyyy-MM-dd");
					const dayEvents = eventsByDay.get(key) ?? [];
					const visible = dayEvents.slice(0, MONTH_VIEW_MAX_EVENTS);
					const overflow = dayEvents.length - visible.length;

					return (
						<div
							key={key}
							className={cn(
								"group relative flex min-h-28 flex-col gap-1.5 border-r border-b border-border/60 p-2 transition-colors",
								!inMonth && "opacity-40",
							)}
						>
							<button
								type="button"
								onClick={() => onDayClick(day)}
								className="self-end text-xs font-medium tabular-nums text-muted-foreground transition-colors hover:text-foreground"
							>
								<span
									className={cn(
										"inline-flex size-6 items-center justify-center",
										today &&
											"rounded-full bg-foreground text-background font-bold",
									)}
								>
									{format(day, "d")}
								</span>
							</button>

							<div className="flex flex-1 flex-col gap-1">
								{visible.map((ev) => (
									<button
										key={ev.id}
										type="button"
										onClick={() => onEventClick(ev.slug)}
										className={cn(
											"flex flex-col gap-0.5 border-l-2 pl-2 text-left transition-opacity hover:opacity-60",
											getCategoryBorderClass(ev.category),
										)}
									>
										<span className="text-[0.6rem] font-medium uppercase tracking-[0.2em] tabular-nums text-muted-foreground">
											{format(ev.date, "HH:mm")}
										</span>
										<span className="line-clamp-1 text-[0.7rem] font-semibold uppercase tracking-wider">
											{ev.home} – {ev.away}
										</span>
									</button>
								))}
								{overflow > 0 && (
									<button
										type="button"
										onClick={() => onDayClick(day)}
										className="self-start pl-2 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
									>
										+{overflow} još
									</button>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/* Week view                                                          */
/* ------------------------------------------------------------------ */

interface WeekViewProps {
	cursor: Date;
	events: CalendarEvent[];
	onDayClick: (date: Date) => void;
	onEventClick: (slug: string) => void;
}

function WeekView({ cursor, events, onDayClick, onEventClick }: WeekViewProps) {
	const days = useMemo(() => {
		const start = startOfWeek(cursor, { weekStartsOn: 1 });
		return Array.from({ length: 7 }, (_, i) => addDays(start, i));
	}, [cursor]);

	const eventsByDay = useMemo(() => {
		const map = new Map<string, CalendarEvent[]>();
		for (const ev of events) {
			const key = format(startOfDay(ev.date), "yyyy-MM-dd");
			const list = map.get(key) ?? [];
			list.push(ev);
			map.set(key, list);
		}
		return map;
	}, [events]);

	return (
		<div className="grid grid-cols-1 border-t border-l border-border/60 sm:grid-cols-7">
			{days.map((day, i) => {
				const today = isToday(day);
				const key = format(day, "yyyy-MM-dd");
				const dayEvents = eventsByDay.get(key) ?? [];
				return (
					<div
						key={key}
						className="flex min-h-56 flex-col gap-4 border-r border-b border-border/60 p-4"
					>
						<button
							type="button"
							onClick={() => onDayClick(day)}
							className="flex flex-col items-start gap-1 text-left"
						>
							<span className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
								{WEEKDAY_LABELS_LONG[i]}
							</span>
							<span
								className={cn(
									"text-2xl font-black uppercase leading-none tracking-tighter tabular-nums",
									today && "underline decoration-2 underline-offset-4",
								)}
							>
								{format(day, "d.")}
							</span>
						</button>

						<div className="flex flex-1 flex-col gap-3 border-t border-border/60 pt-3">
							{dayEvents.length === 0 ? (
								<span className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-muted-foreground/60">
									—
								</span>
							) : (
								dayEvents.map((ev) => (
									<button
										key={ev.id}
										type="button"
										onClick={() => onEventClick(ev.slug)}
										className={cn(
											"flex flex-col gap-1 border-l-2 pl-3 text-left transition-opacity hover:opacity-60",
											getCategoryBorderClass(ev.category),
										)}
									>
										<div className="flex items-center gap-2">
											<span
												className={cn(
													"inline-flex items-center rounded-full px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.15em]",
													getCategoryChipClass(ev.category),
												)}
											>
												{getCategoryShortLabel(ev.category)}
											</span>
											<span className="text-[0.6rem] font-medium uppercase tracking-[0.2em] tabular-nums text-muted-foreground">
												{format(ev.date, "HH:mm")}
											</span>
										</div>
										<span className="line-clamp-2 text-xs font-semibold uppercase tracking-[0.08em]">
											{ev.home} – {ev.away}
										</span>
										{ev.competition && (
											<span className="line-clamp-1 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-muted-foreground">
												{ev.competition}
											</span>
										)}
									</button>
								))
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}

/* ------------------------------------------------------------------ */
/* Day view                                                           */
/* ------------------------------------------------------------------ */

interface DayViewProps {
	cursor: Date;
	events: CalendarEvent[];
	onEventClick: (slug: string) => void;
}

function DayView({ cursor, events, onEventClick }: DayViewProps) {
	const dayEvents = useMemo(
		() => events.filter((e) => isSameDay(e.date, cursor)),
		[events, cursor],
	);

	return (
		<div className="mx-auto max-w-3xl">
			{dayEvents.length === 0 ? (
				<div className="flex flex-col items-center gap-3 border-t border-border/60 py-16">
					<span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
						Nema utakmica
					</span>
				</div>
			) : (
				<ul className="divide-y divide-border/60 border-y border-border/60">
					{dayEvents.map((ev) => (
						<li key={ev.id}>
							<button
								type="button"
								onClick={() => onEventClick(ev.slug)}
								className="grid w-full grid-cols-[auto_1fr] items-center gap-6 px-2 py-6 text-left transition-opacity hover:opacity-60 sm:gap-10 sm:px-4"
							>
								<span className="text-2xl font-black uppercase leading-none tracking-tighter tabular-nums sm:text-3xl">
									{format(ev.date, "HH:mm")}
								</span>
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2">
										<span
											className={cn(
												"inline-flex items-center rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em]",
												getCategoryChipClass(ev.category),
											)}
										>
											{getCategoryShortLabel(ev.category)}
										</span>
										{ev.competition && (
											<span className="line-clamp-1 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
												{ev.competition}
											</span>
										)}
									</div>
									<span className="line-clamp-2 text-sm font-semibold uppercase tracking-widest sm:text-base">
										{ev.home} – {ev.away}
									</span>
								</div>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
