import { Button } from "@/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/ui/dialog";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Clock } from "lucide-react";

import { AllCourseTask } from "./types";

interface DeadlineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: AllCourseTask | null;
  selectedDeadline: string;
  onSetDeadline: (deadline: string) => void;
  onSaveDeadline: () => void;
  onClearDeadline: () => void;
  hasCustomDeadline: boolean;
}

export function DeadlineModal({
  open,
  onOpenChange,
  selectedTask,
  selectedDeadline,
  onSetDeadline,
  onSaveDeadline,
  onClearDeadline,
  hasCustomDeadline,
}: DeadlineModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đặt hạn chót tùy chỉnh</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="deadline-date" className="text-sm font-medium">
              Chọn ngày giờ hạn chót
            </Label>
            <Input
              id="deadline-date"
              type="datetime-local"
              value={selectedDeadline}
              onChange={(e) => onSetDeadline(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            {hasCustomDeadline && !selectedTask?.availableuntil && (
              <Button
                variant="destructive"
                className="gap-1"
                onClick={onClearDeadline}
              >
                <Clock className="h-3.5 w-3.5" />
                Xóa hạn chót
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={onSaveDeadline} disabled={!selectedDeadline}>
              <Clock className="h-3.5 w-3.5" />
              Lưu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
