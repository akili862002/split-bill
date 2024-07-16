import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/vi";

dayjs.extend(utc);
dayjs.extend(tz);

dayjs.locale("vi");
export const prettyDate = (date: Date, format = "dddd, DD MMMM YYYY") => {
  const result = dayjs(date).tz("Asia/Saigon").format(format);
  return capitalize(result);
};

export const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};
