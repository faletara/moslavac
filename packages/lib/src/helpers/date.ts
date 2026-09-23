import { format } from "date-fns";
import { hr } from "date-fns/locale";

/**
 * Klupski datumi se uvijek prikazuju po hrvatskom vremenu. Server na Vercelu
 * radi u UTC-u (a `TZ` je tamo rezervirana varijabla, ne može se postaviti),
 * pa bi bez ovoga termin utakmice ispao 1–2 sata ranije nego što piše na HNS-u.
 */
const CLUB_TIME_ZONE = "Europe/Zagreb";

const ZONED_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: CLUB_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/**
 * Datum čija se *lokalna* polja poklapaju sa zagrebačkim zidnim satom, pa ga
 * `date-fns` (koji čita lokalna polja) formatira isto na svakom serveru.
 */
function zonedDate(dateTime: number | string): Date {
  const parts = ZONED_PARTS.formatToParts(new Date(dateTime));

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  // Ponoć Intl ispisuje kao "24", što `new Date(...)` tumači kao idući dan.
  const hour = get("hour") % 24;

  return new Date(
    get("year"),
    get("month") - 1,
    get("day"),
    hour,
    get("minute"),
    get("second"),
  );
}

export const formatDateTime = (dateTime: number | string) => {
  const date = zonedDate(dateTime);

  return {
    date: format(date, "dd.MM.yyyy.", { locale: hr }),
    time: format(date, "HH:mm"),
  };
};

export const formatDateLong = (dateTime: number | string) => {
  const date = zonedDate(dateTime);

  return format(date, "d. MMMM yyyy.", { locale: hr });
};

export const formatDateShort = (dateTime: number | string) => {
  const date = zonedDate(dateTime);

  return format(date, "dd.MM.yyyy.", { locale: hr });
};

export const formatDateParts = (dateTime: number | string) => {
  const date = zonedDate(dateTime);

  return {
    day: format(date, "d", { locale: hr }),
    monthShort: format(date, "LLL", { locale: hr })
      .replace(".", "")
      .toUpperCase(),
    weekdayShort: format(date, "EEE", { locale: hr })
      .replace(".", "")
      .toUpperCase(),
    time: format(date, "HH:mm"),
  };
};
