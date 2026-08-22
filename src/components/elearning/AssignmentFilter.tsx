import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Switch } from "@/components/shadcn/ui/switch";

interface AssignmentFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  onlyUpcoming: boolean;
  onOnlyUpcomingChange: (checked: boolean) => void;
  onlyUnsubmitted: boolean;
  onOnlyUnsubmittedChange: (checked: boolean) => void;
}

export function AssignmentFilter({
  search,
  onSearchChange,
  onlyUpcoming,
  onOnlyUpcomingChange,
  onlyUnsubmitted,
  onOnlyUnsubmittedChange,
}: AssignmentFilterProps) {
  return (
    <div className="flex flex-col items-end gap-4 md:flex-row">
      <div className="min-w-50 flex-1">
        <Label htmlFor="search" className="mb-1.5 block">
          Tìm kiếm bài tập
        </Label>
        <Input
          id="search"
          placeholder="Nhập tên bài tập hoặc môn học..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
        />
      </div>

      <div className="flex flex-wrap gap-6 px-1 py-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="upcoming"
            checked={onlyUpcoming}
            onCheckedChange={onOnlyUpcomingChange}
          />
          <Label htmlFor="upcoming" className="cursor-pointer select-none">
            Còn hạn
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="unsubmitted"
            checked={onlyUnsubmitted}
            onCheckedChange={onOnlyUnsubmittedChange}
          />
          <Label htmlFor="unsubmitted" className="cursor-pointer select-none">
            Chưa nộp
          </Label>
        </div>
      </div>
    </div>
  );
}