import { Button } from "@/components/shadcn/ui/button";

import { Assignment } from "./types";

interface AssignmentItemProps {
  assignment: Assignment;
  onToggleSubmit: (id: string) => void;
}

export function AssignmentItem({
  assignment,
  onToggleSubmit,
}: AssignmentItemProps) {
  const isOverdue = new Date(assignment.dueDate) < new Date();

  return (
    <div
      className={`bg-card flex flex-col items-start justify-between gap-4 rounded-lg border p-4 transition-colors md:flex-row md:items-center ${
        assignment.submitted
          ? "border-emerald-500/20 bg-emerald-500/2"
          : isOverdue
            ? "border-destructive/20 bg-destructive/2"
            : "border-border hover:border-foreground/20"
      }`}
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
            {assignment.courseName}
          </span>
          {assignment.submitted ? (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Đã nộp bài
            </span>
          ) : isOverdue ? (
            <span className="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 text-xs font-semibold">
              Quá hạn
            </span>
          ) : (
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              Chưa nộp
            </span>
          )}
        </div>
        <h4 className="text-foreground mt-1 font-semibold">
          {assignment.title}
        </h4>
        <p className="text-muted-foreground text-xs">
          Hạn nộp:{" "}
          {new Date(assignment.dueDate).toLocaleString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <Button
        size="sm"
        variant={assignment.submitted ? "outline" : "default"}
        className={
          assignment.submitted
            ? "border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10"
            : ""
        }
        onClick={() => onToggleSubmit(assignment.id)}
      >
        {assignment.submitted ? "Đánh dấu chưa nộp" : "Nộp bài / Đã làm xong"}
      </Button>
    </div>
  );
}
