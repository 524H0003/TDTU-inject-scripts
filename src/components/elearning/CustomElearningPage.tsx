import { Button } from "@/components/shadcn/ui/button";
import { Separator } from "@/components/shadcn/ui/separator";
import { fetchMoodleCourses } from "@/lib/api/moodle";
import { MoodleCourse } from "@/lib/types/moodle";
import { useState } from "react";

export function CustomElearningPage() {
  const [courses, setCourses] = useState<MoodleCourse[]>([]);

  const fetchInitialCourses = async () => {
    try {
      const fetchedCourses = await fetchMoodleCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useState(() => {
    fetchInitialCourses();
  });

  const getCourseStatus = (course: any): "started" | "upcoming" | "ended" => {
    const now = new Date().getTime() / 1000;
    const startDate = course.startdate;
    const endDate = course.enddate;

    if (now < startDate) {
      return "upcoming";
    } else if (now > endDate) {
      return "ended";
    } else {
      return "started";
    }
  };

  return (
    <div className="bg-background border-border text-foreground space-y-6 rounded-xl border p-6 shadow-sm">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">
            Các khóa học
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Theo dõi danh sách các khóa học của bạn trên TDTU E-learning.
          </p>
        </div>
      </div>

      <Separator />

      <div className="mt-6 grid gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`bg-card flex flex-col items-start justify-between gap-4 rounded-lg border p-4 transition-colors md:flex-row md:items-center ${
              getCourseStatus(course) === "ended"
                ? "border-destructive/20 bg-destructive/2"
                : "border-border hover:border-foreground/20"
            }`}
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                  {course.fullname}
                </span>
                {getCourseStatus(course) === "ended" ? (
                  <span className="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 text-xs font-semibold">
                    Đã kết thúc
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Đang hoạt động
                  </span>
                )}
              </div>
              <h4 className="text-foreground mt-1 font-semibold">
                {course.fullname}
              </h4>
              <p className="text-muted-foreground text-xs">
                Mã môn học: {course.shortname}
                <br />
                Khởi động:{" "}
                {new Date(course.startdate * 1000).toLocaleDateString("vi-VN")}
                <br />
                Kết thúc:{" "}
                {new Date(course.enddate * 1000).toLocaleDateString("vi-VN")}
              </p>
            </div>

            <Button
              size="sm"
              variant="default"
              onClick={() => {
                window.open(course.viewurl, "_blank");
              }}
            >
              Vào khóa học
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
