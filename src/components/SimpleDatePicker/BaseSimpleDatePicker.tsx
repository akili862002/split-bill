import { useEffect, useMemo, useState } from "react";
import {
  FormControl,
  IFormControlProps,
  getFormControlProps,
} from "../FormControl";
import { BaseSelectDefaultStyle } from "../SelectDefaultStyle";

export type IBaseSimpleDatePickerProps = IFormControlProps & {
  value: Date;
  onChange: (date: Date) => void;
  validate?: () => string | undefined;
  minDate?: Date;
  maxDate?: Date;
};

export const BaseSimpleDatePicker: React.FC<IBaseSimpleDatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  ...props
}) => {
  const [day, setDay] = useState<number | undefined>(
    value ? new Date(value).getDate() : undefined
  );
  const [month, setMonth] = useState<number | undefined>(
    value ? new Date(value).getMonth() : undefined
  );
  const [year, setYear] = useState<number | undefined>(
    value ? new Date(value).getFullYear() : undefined
  );

  useEffect(() => {
    if (day !== undefined && month !== undefined && year !== undefined) {
      onChange(new Date(year, month, day));
    }
  }, [day, month, year]);

  useEffect(() => {
    if (value && value?.getTime() !== new Date(year, month, day).getTime()) {
      setDay(value.getDate());
      setMonth(value.getMonth());
      setYear(value.getFullYear());
    }
  }, [value]);

  const yearsOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const fromPrevYear = minDate ? minDate.getFullYear() : currentYear - 100;
    const toNextYear = maxDate ? maxDate.getFullYear() : currentYear + 100;

    const years = [];
    for (let i = fromPrevYear; i <= toNextYear; i++) {
      years.push({ label: String(i), value: String(i) });
    }
    return years.reverse();
  }, [minDate, maxDate]);

  return (
    <FormControl {...getFormControlProps(props)}>
      <div className="flex gap-2">
        <BaseSelectDefaultStyle
          placeholder="Ngày"
          value={Number.isInteger(day) ? String(day) : undefined}
          onChange={(day) => setDay(Number(day))}
          options={daysOptions}
        />
        <BaseSelectDefaultStyle
          placeholder="Tháng"
          value={Number.isInteger(month) ? String(month) : undefined}
          onChange={(month) => setMonth(Number(month))}
          options={monthsOptions}
        />
        <BaseSelectDefaultStyle
          placeholder="Năm"
          value={year ? String(year) : undefined}
          onChange={(year) => setYear(Number(year))}
          options={yearsOptions}
        />
      </div>
    </FormControl>
  );
};

const monthsOptions = [
  { label: "Tháng 1", value: "0" },
  { label: "Tháng 2", value: "1" },
  { label: "Tháng 3", value: "2" },
  { label: "Tháng 4", value: "3" },
  { label: "Tháng 5", value: "4" },
  { label: "Tháng 6", value: "5" },
  { label: "Tháng 7", value: "6" },
  { label: "Tháng 8", value: "7" },
  { label: "Tháng 9", value: "8" },
  { label: "Tháng 10", value: "9" },
  { label: "Tháng 11", value: "10" },
  { label: "Tháng 12", value: "11" },
];

const daysOptions = Array.from({ length: 31 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));
