import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table";

import { TaskRow } from "./TaskRow";
import { AllCourseTask } from "./types";

interface TaskTableProps {
  tasks: (AllCourseTask & {
    customDeadline?: number;
    effectiveDueTimestamp?: number;
  })[];
  onSetDeadline: (task: AllCourseTask) => void;
  onClearDeadline: (task: AllCourseTask) => void;
}

export function TaskTable({
  tasks,
  onSetDeadline,
  onClearDeadline,
}: TaskTableProps) {
  return (
    <div className="border-border overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="px-4 py-3 font-semibold">
              Trạng thái
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold">
              Tên bài tập
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold">Môn học</TableHead>
            <TableHead className="px-4 py-3 font-semibold">Hạn chót</TableHead>
            <TableHead className="px-4 py-3 text-right font-semibold">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TaskRow
              key={`${task.courseId}-${task.instance}-${task.modname}`}
              task={task}
              onSetDeadline={onSetDeadline}
              onClearDeadline={onClearDeadline}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
