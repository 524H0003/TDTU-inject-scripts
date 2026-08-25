import type { CourseContentModule } from "@/lib/types/moodle";

export interface Assignment {
  id: string;
  courseName: string;
  title: string;
  dueDate: string;
  submitted: boolean;
}

export interface CustomDeadline {
  taskId: string;
  timestamp: number;
  createdAt: number;
}

export interface AllCourseTask extends CourseContentModule {
  courseId: number;
  courseName: string;
  courseShortname: string;
  courseViewUrl: string;
  sectionName?: string;
  sectionNumber?: number;
}
