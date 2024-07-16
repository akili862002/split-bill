import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(tz);

export const prettyDate = (date: Date) => {
  return dayjs(date).tz("Asia/Saigon").format("DD/MM/YYYY");
};
