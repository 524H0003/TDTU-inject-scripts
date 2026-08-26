import { Button } from "@/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/ui/dialog";
import { Label } from "@/components/shadcn/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/ui/popover";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import * as React from "react";

import { CalendarWithTime } from "./CalendarWithTime";
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
  shadowRoot?: ShadowRoot;
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
  shadowRoot,
}: DeadlineModalProps) {
  const calendarValue = React.useMemo(
    () => (selectedDeadline ? new Date(selectedDeadline) : undefined),
    [selectedDeadline],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" container={shadowRoot}>
        <DialogHeader>
          <DialogTitle>Đặt hạn chót tùy chỉnh</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="text-sm font-medium">
              Chọn ngày giờ hạn chót
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  suppressHydrationWarning
                >
                  {calendarValue ? (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      {format(calendarValue, "dd/MM/yyyy 'tại' HH:mm")}
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4 opacity-50" />
                      <span>Chọn ngày giờ hạn chót</span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                container={shadowRoot}
              >
                <CalendarWithTime
                  date={calendarValue}
                  onDateChange={(date) => {
                    if (date) {
                      onSetDeadline(date.toISOString());
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
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
