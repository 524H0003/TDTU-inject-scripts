import { CourseSection, MoodleCourse } from "../types/moodle";

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

export function getSessionKey(): string {
  // Try to get sesskey from Moodle global variable
  // @ts-expect-error force value
  if (typeof M !== "undefined" && M.cfg && M.cfg.sesskey) {
    // @ts-expect-error force value
    return M.cfg.sesskey;
  }

  console.error("Not found session key");

  return "";
}

export async function fetchMoodleCourses({
  offset = 0,
  limit = 50,
  classification = "all",
  sort = "fullname",
}: FetchCoursesParams = {}): Promise<MoodleCourse[]> {
  const baseUrl = "https://elearning.tdtu.edu.vn";
  const sesskey = getSessionKey();
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

export async function fetchCourseSections(
  courseId: number,
): Promise<CourseSection[]> {
  const baseUrl = "https://elearning.tdtu.edu.vn";
  try {
    const response = await fetch(`${baseUrl}/course/view.php?id=${courseId}`);
    if (!response.ok) throw new Error("Failed to load course page");

    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const sectionElements = Array.from(doc.querySelectorAll("li.section.main"));
    const sections = await Promise.all(
      sectionElements.map(async (sectionEl, index) => {
        const sectionName =
          sectionEl.querySelector(".sectionname")?.textContent?.trim() ||
          `Section ${index}`;

        const sectionIdMatch = sectionEl.id.match(/section-(\d+)/);
        const sectionNumber = sectionIdMatch
          ? parseInt(sectionIdMatch[1])
          : index;

        const moduleElements = Array.from(
          sectionEl.querySelectorAll("li.activity"),
        );
        const modules = await Promise.all(
          moduleElements.map(async (modEl) => {
            const idMatch = modEl.id.match(/module-(\d+)/);
            const moduleId = idMatch ? parseInt(idMatch[1]) : 0;
            const name =
              modEl
                .querySelector(".instancename")
                ?.textContent?.replace(/Assignment|URL|Page|Forum/g, "")
                .trim() || "Unknown";
            const link = modEl.querySelector("a")?.getAttribute("href") || "";
            const isAssign = modEl.classList.contains("modtype_assign");
            const isQuiz = modEl.classList.contains("modtype_quiz");
            const isUrlOrResource =
              modEl.classList.contains("modtype_url") ||
              modEl.classList.contains("modtype_page") ||
              modEl.classList.contains("modtype_resource") ||
              modEl.classList.contains("modtype_folder") ||
              modEl.classList.contains("modtype_label") ||
              modEl.classList.contains("modtype_book");

            const modName = isAssign
              ? "assign"
              : isQuiz
                ? "quiz"
                : isUrlOrResource
                  ? "url"
                  : "other";

            let dueDate: number | undefined;
            let isSubmitted = false;
            if (modName === "assign" && link) {
              const details = await fetchAssignmentDetails(link);
              dueDate = details.dueDate;
              isSubmitted = details.isSubmitted || false;
            }

            const completionImg =
              modEl
                .querySelector<HTMLImageElement>("img.icon")
                ?.title.includes("Completed") || false;
            const isCompleted = isSubmitted || completionImg;

            const completion = isCompleted ? 100 : 0;

            return {
              id: moduleId,
              instance: moduleId,
              name,
              viewurl: link,
              modname: modName,
              completion,
              availableuntil: dueDate,
              sectionNumber,
            };
          }),
        );

        return {
          sectionnumber: sectionNumber,
          name: sectionName,
          summary: "",
          modules,
        };
      }),
    );

    return sections;
  } catch (error) {
    console.error("Error scraping course sections:", error);
    return [];
  }
}

export async function fetchAssignmentDetails(
  url: string,
): Promise<{ dueDate?: number; isSubmitted?: boolean }> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    let dueDate: number | undefined;
    let isSubmitted = false;

    const rows = doc.querySelectorAll(".submissionstatustable tr");
    for (const row of rows) {
      const th = row.querySelector("th")?.textContent?.trim();
      const td = row.querySelector("td")?.textContent?.trim();

      if (th === "Due date" && td && td !== "-") {
        const date = new Date(td);
        if (!isNaN(date.getTime())) {
          dueDate = date.getTime() / 1000;
        }
      }

      if (th === "Submission status" && td) {
        if (
          td.toLowerCase().includes("submitted") &&
          !td.toLowerCase().includes("not submitted")
        ) {
          isSubmitted = true;
        }
      }
    }

    const statusEl = doc.querySelector(".submissionstatussubmitted");
    if (statusEl) {
      isSubmitted = true;
    }

    return { dueDate, isSubmitted };
  } catch (error) {
    console.error("Failed to fetch assignment details:", error);
  }
  return {};
}
