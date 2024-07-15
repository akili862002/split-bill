import { cn } from "@/utils/cn.util";
import { ReactNode } from "react";

interface ISimpleTableProps {
  headings: string[];
  rows: ReactNode[][];
  columnContentTypes: ("text" | "numeric")[];
}

export const SimpleTable: React.FC<ISimpleTableProps> = ({
  headings = [],
  rows = [],
  columnContentTypes = [],
}) => {
  return (
    <div className="w-full overflow-x-auto border rounded-lg">
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr>
            {headings.map((heading, index) => (
              <th
                key={index}
                className={cn(
                  "py-2 px-2 border-b text-xs font-medium bg-neutral-100 first:rounded-t-lg last:rounded-t-lg",
                  columnContentTypes[index] === "text"
                    ? "text-left"
                    : "text-right"
                )}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {rows.map((item, rowIndex) => (
            <tr key={rowIndex} className="[&:not(:last-child)>td]:border-b">
              {item.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-2 py-2 whitespace-nowrap">
                  {columnContentTypes[cellIndex] === "text" ? (
                    <div>{cell}</div>
                  ) : (
                    <div className="text-right">{cell}</div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
