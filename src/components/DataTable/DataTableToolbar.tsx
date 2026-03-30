import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, X } from "lucide-react";
import { DataTableFilterConfig } from "./DataTable";
import { exportToCSV, exportToExcel } from "@/lib/export-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  filters: DataTableFilterConfig[];
  exportFilename: string;
  searchPlaceholder: string;
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  filters,
  exportFilename,
  searchPlaceholder,
}: DataTableToolbarProps<TData>) {
  const hasActiveFilters = globalFilter || table.getState().columnFilters.length > 0;

  const getExportRows = () => {
    return table.getFilteredRowModel().rows.map((row) => {
      const obj: Record<string, unknown> = {};
      row.getVisibleCells().forEach((cell) => {
        obj[cell.column.id] = cell.getValue();
      });
      return obj;
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-9"
        />
      </div>

      {filters.map((filter) => (
        <Select
          key={filter.columnId}
          value={(table.getColumn(filter.columnId)?.getFilterValue() as string) ?? "all"}
          onValueChange={(val) =>
            table.getColumn(filter.columnId)?.setFilterValue(val === "all" ? undefined : val)
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {filter.label}</SelectItem>
            {filter.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setGlobalFilter("");
            table.resetColumnFilters();
          }}
        >
          <X className="mr-1 h-3.5 w-3.5" /> Clear
        </Button>
      )}

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportToCSV(getExportRows(), exportFilename)}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportToExcel(getExportRows(), exportFilename)}>
              Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
