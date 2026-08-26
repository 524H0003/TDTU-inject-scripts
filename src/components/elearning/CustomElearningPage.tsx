import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Separator } from "@/components/shadcn/ui/separator";
import { Switch } from "@/components/shadcn/ui/switch";
import { fetchCourseSections, fetchMoodleCourses } from "@/lib/api/moodle";
import { Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ClearAllDeadlinesDialog } from "./ClearAllDeadlinesDialog";
import { DeadlineModal } from "./DeadlineModal";
import { TaskTable } from "./TaskTable";
import { AllCourseTask } from "./types";
import {
  clearAllCustomDeadlines,
  formatDeadlineInput,
  getTaskId,
  isTaskFinished,
  loadCustomDeadlines,
  removeCustomDeadline,
  setCustomDeadline,
} from "./utils";

export function CustomElearningPage({
  shadowRoot,
}: {
  shadowRoot: ShadowRoot;
}) {
  const [allTasks, setAllTasks] = useState<AllCourseTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFinished, setShowFinished] = useState(false);
  const [customDeadlines, setCustomDeadlines] = useState<
    Record<string, number>
  >({});
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AllCourseTask | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<string>("");

  useEffect(() => {
    loadAllData();
    const deadlines = loadCustomDeadlines();
    setCustomDeadlines(
      Object.fromEntries(
        Object.entries(deadlines).map(([id, value]) => [id, value.timestamp]),
      ),
    );
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await fetchMoodleCourses();

      const tasksList: AllCourseTask[] = [];

      // Fetch sections for all courses in parallel
      await Promise.all(
        fetchedCourses.map(async (course) => {
          try {
            const sections = await fetchCourseSections(course.id);
            sections.forEach((section) => {
              if (section.modules) {
                section.modules.forEach((module) => {
                  if (module.visible !== false && module.stealth !== true) {
                    tasksList.push({
                      ...module,
                      courseId: course.id,
                      courseName: course.fullname,
                      courseShortname: course.shortname,
                      courseViewUrl:
                        course.viewurl ||
                        `https://elearning.tdtu.edu.vn/course/view.php?id=${course.id}`,
                      sectionName: section.name,
                      sectionNumber: section.sectionnumber,
                    });
                  }
                });
              }
            });
          } catch (err) {
            console.error(
              `Failed to load sections for course ${course.id}:`,
              err,
            );
          }
        }),
      );

      setAllTasks(tasksList);
    } catch (error) {
      console.error("Failed to fetch initial courses and tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDeadline = (task: AllCourseTask) => {
    const taskId = getTaskId(task);
    const existingDeadline = customDeadlines[taskId];

    setSelectedDeadline(
      existingDeadline
        ? formatDeadlineInput(existingDeadline)
        : formatDeadlineInput(Math.floor(Date.now() / 1000)),
    );
    setSelectedTask(task);
    setShowDeadlineModal(true);
  };

  const handleSaveDeadline = () => {
    if (!selectedTask || !selectedDeadline) return;

    const deadlineDate = new Date(selectedDeadline);
    const timestamp = Math.floor(deadlineDate.getTime() / 1000);
    const taskId = getTaskId(selectedTask);

    setCustomDeadline(taskId, timestamp);
    setCustomDeadlines((prev) => ({
      ...prev,
      [taskId]: timestamp,
    }));

    setShowDeadlineModal(false);
    setSelectedTask(null);
    setSelectedDeadline("");
  };

  const handleClearDeadline = (task: AllCourseTask) => {
    const taskId = getTaskId(task);
    removeCustomDeadline(taskId);
    setCustomDeadlines((prev) => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });

    if (task === selectedTask) {
      setShowDeadlineModal(false);
      setSelectedTask(null);
      setSelectedDeadline("");
    }
  };

  const [showClearAllDialog, setShowClearAllDialog] = useState(false);

  const handleClearAllDeadlines = () => {
    clearAllCustomDeadlines();
    setCustomDeadlines({});
    setShowClearAllDialog(false);
  };

  const finishedCount = useMemo(
    () => allTasks.filter(isTaskFinished).length,
    [allTasks],
  );

  const filteredTasks = useMemo(
    () =>
      allTasks
        .map((task) => {
          const customDeadline = customDeadlines[getTaskId(task)];
          return {
            ...task,
            customDeadline,
            effectiveDueTimestamp: task.availableuntil || customDeadline,
          };
        })
        .filter((task) => showFinished || !isTaskFinished(task))
        .sort((a, b) => {
          const dateA =
            a.effectiveDueTimestamp ||
            a.availablefrom ||
            Number.MAX_SAFE_INTEGER;
          const dateB =
            b.effectiveDueTimestamp ||
            b.availablefrom ||
            Number.MAX_SAFE_INTEGER;
          return (
            dateA - dateB ||
            a.courseName.localeCompare(b.courseName, "vi-VN") ||
            a.name.localeCompare(b.name, "vi-VN")
          );
        }),
    [allTasks, customDeadlines, showFinished],
  );

  return (
    <>
      <div className="bg-background border-border text-foreground space-y-6 rounded-xl border p-6 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              Tất cả bài tập & công việc các khóa học
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Tổng hợp danh sách bài tập từ toàn bộ khóa học trên TDTU
              E-learning, sắp xếp theo hạn chót.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!loading && allTasks.length > 0 && finishedCount > 0 && (
              <div className="bg-muted/50 border-border flex items-center space-x-2 rounded-lg border px-3 py-2">
                <Switch
                  id="show-finished-all"
                  checked={showFinished}
                  onCheckedChange={setShowFinished}
                />
                <Label
                  htmlFor="show-finished-all"
                  className="cursor-pointer text-xs font-medium select-none"
                >
                  Hiện bài đã hoàn thành ({finishedCount})
                </Label>
              </div>
            )}
            {Object.keys(customDeadlines).length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 gap-1 px-2 text-xs"
                onClick={() => setShowClearAllDialog(true)}
              >
                <Clock className="h-3.5 w-3.5" />
                Xóa tất cả ({Object.keys(customDeadlines).length})
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {loading ? (
          <div className="text-muted-foreground flex items-center justify-center py-16 text-sm">
            Đang tải dữ liệu bài tập từ các khóa học...
          </div>
        ) : allTasks.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center text-sm">
            Không tìm thấy bài tập nào trong các khóa học của bạn.
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-muted-foreground rounded-lg border border-dashed py-12 text-center text-sm">
            Không có bài tập nào hiển thị với bộ lọc hiện tại.
          </div>
        ) : (
          <TaskTable
            tasks={filteredTasks}
            onSetDeadline={handleSetDeadline}
            onClearDeadline={handleClearDeadline}
            showStatusColumn={showFinished}
          />
        )}
      </div>
      <DeadlineModal
        open={showDeadlineModal}
        onOpenChange={setShowDeadlineModal}
        selectedTask={selectedTask}
        selectedDeadline={selectedDeadline}
        onSetDeadline={setSelectedDeadline}
        onSaveDeadline={handleSaveDeadline}
        onClearDeadline={() => {
          if (selectedTask) handleClearDeadline(selectedTask);
        }}
        hasCustomDeadline={
          selectedTask
            ? Boolean(customDeadlines[getTaskId(selectedTask)])
            : false
        }
        shadowRoot={shadowRoot}
      />
      <ClearAllDeadlinesDialog
        open={showClearAllDialog}
        onOpenChange={setShowClearAllDialog}
        onConfirm={handleClearAllDeadlines}
      />
    </>
  );
}
