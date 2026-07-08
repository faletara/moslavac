import { format } from "date-fns";
import { hr } from "date-fns/locale";

export const formatDateTime = (dateTime: number | string) => {
  const date = new Date(dateTime);
  return {
    date: format(date, "dd.MM.yyyy.", { locale: hr }),
    time: format(date, "HH:mm"),
  };
};

export const formatDateLong = (dateTime: number | string) => {
  const date = new Date(dateTime);
  return format(date, "d. MMMM yyyy.", { locale: hr });
};

export const formatDateShort = (dateTime: number | string) => {
  const date = new Date(dateTime);
  return format(date, "dd.MM.yyyy.", { locale: hr });
};

export const formatDateParts = (dateTime: number | string) => {
  const date = new Date(dateTime);
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
