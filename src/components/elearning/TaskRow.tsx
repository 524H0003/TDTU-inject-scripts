import { Button } from "@/components/shadcn/ui/button";
import { TableCell, TableRow } from "@/components/shadcn/ui/table";
import { BookOpen, CheckCircle2, Clock, ExternalLink } from "lucide-react";

import { AllCourseTask } from "./types";
import { isTaskFinished } from "./utils";

interface TaskRowProps {
  task: AllCourseTask & {
    customDeadline?: number;
    effectiveDueTimestamp?: number;
  };
  onSetDeadline: (task: AllCourseTask) => void;
  onClearDeadline: (task: AllCourseTask) => void;
}

export function TaskRow({
  task,
  onSetDeadline,
  onClearDeadline,
}: TaskRowProps) {
  const isFinished = isTaskFinished(task);
  const effectiveDueTimestamp = task.effectiveDueTimestamp;
  const hasCustomDeadline = Boolean(
    task.customDeadline && !task.availableuntil,
  );

  const dueDate = effectiveDueTimestamp
    ? new Date(effectiveDueTimestamp * 1000)
    : null;
  const isOverdue = dueDate ? dueDate < new Date() : false;

  const dueText = dueDate
    ? dueDate.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Không có hạn chót";

  return (
    <TableRow>
      <TableCell className="px-4 py-3 whitespace-nowrap">
        {isFinished ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Đã xong
          </span>
        ) : isOverdue ? (
          <span className="bg-destructive/10 text-destructive inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold">
            <Clock className="h-3.5 w-3.5" />
            Quá hạn
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            Chưa làm
          </span>
        )}
      </TableCell>
      <TableCell className="text-foreground max-w-xs truncate px-4 py-3 font-medium">
        {task.name}
      </TableCell>
      <TableCell className="text-muted-foreground max-w-xs truncate px-4 py-3 text-xs">
        <button
          type="button"
          className="text-foreground inline-flex cursor-pointer items-center gap-1 truncate text-left font-medium hover:underline"
          onClick={() => {
            const sectionAnchor =
              typeof task.sectionNumber === "number"
                ? `#section-${task.sectionNumber}`
                : "";
            const url = `${task.courseViewUrl.split("#")[0]}${sectionAnchor}`;
            window.open(url, "_blank");
          }}
          title="Mở khóa học"
        >
          <BookOpen className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{task.courseName}</span>
        </button>
      </TableCell>
      <TableCell className="px-4 py-3 text-xs whitespace-nowrap">
        {dueDate ? (
          <div className="flex items-center gap-1.5">
            <span
              className={
                isOverdue && !isFinished
                  ? "text-destructive font-medium"
                  : "text-muted-foreground"
              }
            >
              {dueText}
            </span>
            {hasCustomDeadline && (
              <span
                className="bg-primary/10 text-primary inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                title="Hạn chót tùy chỉnh"
              >
                <Clock className="h-2.5 w-2.5" />
                Tùy chỉnh
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground italic">Không có</span>
        )}
      </TableCell>
      <TableCell className="px-4 py-3 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          {!task.availableuntil && !hasCustomDeadline && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => onSetDeadline(task)}
            >
              <Clock className="h-3.5 w-3.5" />
              Đặt hạn chót
            </Button>
          )}
          {hasCustomDeadline && (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 gap-1 px-2 text-xs"
              onClick={() => onClearDeadline(task)}
            >
              <Clock className="h-3.5 w-3.5" />
              Xóa hạn chót
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1 px-2 text-xs"
            onClick={() => window.open(task.viewurl, "_blank")}
          >
            <span>Vào làm</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
