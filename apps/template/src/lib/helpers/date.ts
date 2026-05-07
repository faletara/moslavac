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
