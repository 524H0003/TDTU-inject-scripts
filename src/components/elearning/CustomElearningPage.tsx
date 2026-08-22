import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Separator } from "@/components/shadcn/ui/separator";
import { Switch } from "@/components/shadcn/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/ui/table";
import { fetchCourseSections, fetchMoodleCourses } from "@/lib/api/moodle";
import { BookOpen, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface AllCourseTask {
  id?: number;
  instance: number;
  name: string;
  modname: string;
  viewurl: string;
  availablefrom?: number;
  availableuntil?: number;
  completion?: number;
  visible?: boolean;
  stealth?: boolean;
  courseId: number;
  courseName: string;
  courseShortname: string;
  courseViewUrl: string;
  sectionName?: string;
  sectionNumber?: number;
}

export function CustomElearningPage() {
  const [allTasks, setAllTasks] = useState<AllCourseTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFinished, setShowFinished] = useState(false);

  useEffect(() => {
    loadAllData();
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

      // Sort by deadline time (availableuntil, then availablefrom, then course name, then task name)
      tasksList.sort((a, b) => {
        const dateA =
          a.availableuntil || a.availablefrom || Number.MAX_SAFE_INTEGER;
        const dateB =
          b.availableuntil || b.availablefrom || Number.MAX_SAFE_INTEGER;
        if (dateA !== dateB) {
          return dateA - dateB;
        }
        const courseCompare = a.courseName.localeCompare(b.courseName, "vi-VN");
        if (courseCompare !== 0) {
          return courseCompare;
        }
        return a.name.localeCompare(b.name, "vi-VN");
      });

      setAllTasks(tasksList);
    } catch (error) {
      console.error("Failed to fetch initial courses and tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const finishedCount = allTasks.filter(
    (task) => task.completion === 100 || task.completion === 1,
  ).length;

  const filteredTasks = allTasks.filter((task) => {
    const isFinished = task.completion === 100 || task.completion === 1;
    if (!showFinished && isFinished) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-background border-border text-foreground space-y-6 rounded-xl border p-6 shadow-sm">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">
            Tất cả bài tập & công việc các khóa học
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Tổng hợp danh sách bài tập từ toàn bộ khóa học trên TDTU E-learning,
            sắp xếp theo hạn chót.
          </p>
        </div>

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
                <TableHead className="px-4 py-3 font-semibold">
                  Môn học
                </TableHead>
                <TableHead className="px-4 py-3 font-semibold">
                  Hạn chót
                </TableHead>
                <TableHead className="px-4 py-3 text-right font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task, index) => {
                const isFinished =
                  task.completion === 100 || task.completion === 1;
                const dueDate = task.availableuntil
                  ? new Date(task.availableuntil * 1000)
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
                  <TableRow
                    key={`${task.courseId}-${task.instance}-${task.modname}-${index}`}
                  >
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
                        <span
                          className={
                            isOverdue && !isFinished
                              ? "text-destructive font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {dueText}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">
                          Không có
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1 px-2 text-xs"
                        onClick={() => window.open(task.viewurl, "_blank")}
                      >
                        <span>Vào làm</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
