import { MoodleCourse } from "../types/moodle";

interface ApiResponse {
  error: false;
  data: {
    courses: MoodleCourse[];
    nextoffset: number;
  };
}

interface FetchCoursesParams {
  offset?: number;
  limit?: number;
  classification?: string;
  sort?: string;
}

export async function fetchMoodleCourses({
  offset = 0,
  limit = 50,
  classification = "all",
  sort = "fullname",
}: FetchCoursesParams = {}): Promise<MoodleCourse[]> {
  const baseUrl = "https://elearning.tdtu.edu.vn";
  // @ts-expect-error force value
  const sesskey = M.cfg.sesskey;
  const info = "core_course_get_enrolled_courses_by_timeline_classification";

  const payload = [
    {
      index: 0,
      methodname: "core_course_get_enrolled_courses_by_timeline_classification",
      args: {
        offset,
        limit,
        classification,
        sort,
        customfieldname: "",
        customfieldvalue: "",
      },
    },
  ];

  try {
    const response = await fetch(
      `${baseUrl}/lib/ajax/service.php?sesskey=${sesskey}&info=${info}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse[] = await response.json();
    return data[0].data.courses;
  } catch (error) {
    console.error("Error fetching Moodle courses:", error);
    return [];
  }
}

export function formatDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

export function formatStartDate(timestamp: number): string {
  return formatDate(timestamp).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatEndDate(timestamp: number): string {
  return formatDate(timestamp).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getCourseStatus(course: any): "started" | "upcoming" | "ended" {
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
}

export function formatProgress(progress: number): string {
  if (progress === 0) {
    return "Chưa bắt đầu";
  } else if (progress === 100) {
    return "Hoàn thành";
  } else {
    return `${progress}%`;
  }
}
