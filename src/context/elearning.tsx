import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Separator } from "@/components/shadcn/ui/separator";
import { Switch } from "@/components/shadcn/ui/switch";
import { useState } from "react";
import { createRoot } from "react-dom/client";

import { execute } from ".";

interface Assignment {
  id: string;
  courseName: string;
  title: string;
  dueDate: string;
  submitted: boolean;
}

const mockAssignments: Assignment[] = [
  {
    id: "1",
    courseName: "Lập trình ứng dụng Web",
    title: "Bài tập lớn giữa kỳ - Xây dựng website thương mại điện tử",
    dueDate: "2026-09-15T23:59:00",
    submitted: false,
  },
  {
    id: "2",
    courseName: "Phát triển ứng dụng di động",
    title: "Lab 3 - Thiết kế giao diện với React Native",
    dueDate: "2026-08-30T12:00:00",
    submitted: true,
  },
  {
    id: "3",
    courseName: "Cơ sở dữ liệu nâng cao",
    title: "Bài tập thực hành tuần 5 - Tối ưu hóa truy vấn SQL",
    dueDate: "2026-08-25T23:59:00",
    submitted: false,
  },
  {
    id: "4",
    courseName: "Đảm bảo chất lượng phần mềm",
    title: "Viết Test Case và Kiểm thử tự động cho dự án",
    dueDate: "2026-09-05T23:59:00",
    submitted: false,
  },
];

export function CustomElearningPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [search, setSearch] = useState("");
  const [onlyUpcoming, setOnlyUpcoming] = useState(true);
  const [onlyUnsubmitted, setOnlyUnsubmitted] = useState(false);

  const filteredAssignments = assignments.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.courseName.toLowerCase().includes(search.toLowerCase());

    const isUpcoming = new Date(item.dueDate) > new Date();
    const matchesUpcoming = !onlyUpcoming || isUpcoming;

    const matchesUnsubmitted = !onlyUnsubmitted || !item.submitted;

    return matchesSearch && matchesUpcoming && matchesUnsubmitted;
  });

  const toggleSubmit = (id: string) => {
    setAssignments(
      assignments.map((item) =>
        item.id === id ? { ...item, submitted: !item.submitted } : item,
      ),
    );
  };

  return (
    <div className="bg-background border-border text-foreground space-y-6 rounded-xl border p-6 shadow-sm">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">
            Các thời hạn nộp bài
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Theo dõi danh sách các bài tập và thời hạn nộp bài của bạn trên hệ
            thống.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAssignments(mockAssignments)}
        >
          Làm mới dữ liệu
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col items-end gap-4 md:flex-row">
        <div className="min-w-50 flex-1">
          <Label htmlFor="search" className="mb-1.5 block">
            Tìm kiếm bài tập
          </Label>
          <Input
            id="search"
            placeholder="Nhập tên bài tập hoặc môn học..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="flex flex-wrap gap-6 px-1 py-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="upcoming"
              checked={onlyUpcoming}
              onCheckedChange={setOnlyUpcoming}
            />
            <Label htmlFor="upcoming" className="cursor-pointer select-none">
              Còn hạn
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="unsubmitted"
              checked={onlyUnsubmitted}
              onCheckedChange={setOnlyUnsubmitted}
            />
            <Label htmlFor="unsubmitted" className="cursor-pointer select-none">
              Chưa nộp
            </Label>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-muted/20 rounded-lg border border-dashed py-12 text-center">
            <p className="text-muted-foreground">
              Không tìm thấy thời hạn nộp bài nào phù hợp.
            </p>
          </div>
        ) : (
          filteredAssignments.map((item) => {
            const isOverdue = new Date(item.dueDate) < new Date();
            return (
              <div
                key={item.id}
                className={`bg-card flex flex-col items-start justify-between gap-4 rounded-lg border p-4 transition-colors md:flex-row md:items-center ${
                  item.submitted
                    ? "border-emerald-500/20 bg-emerald-500/[0.02]"
                    : isOverdue
                      ? "border-destructive/20 bg-destructive/[0.02]"
                      : "border-border hover:border-foreground/20"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                      {item.courseName}
                    </span>
                    {item.submitted ? (
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
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    Hạn nộp:{" "}
                    {new Date(item.dueDate).toLocaleString("vi-VN", {
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
                  variant={item.submitted ? "outline" : "default"}
                  className={
                    item.submitted
                      ? "border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10"
                      : ""
                  }
                  onClick={() => toggleSubmit(item.id)}
                >
                  {item.submitted
                    ? "Đánh dấu chưa nộp"
                    : "Nộp bài / Đã làm xong"}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Add icon to "Bãng Điều khiển" menu item
execute({
  func: () => {
    const controlPanelLink = document.querySelector("#nav-drawer ul");
    const id = "test";
    const customPageId = "custom-extension-page";

    if (controlPanelLink) {
      const existingIcon = controlPanelLink.querySelector("." + id);
      if (!existingIcon) {
        const iconSpan = document.createElement("li");
        iconSpan.className = "list-group-item " + id;
        iconSpan.setAttribute("data-key", "certificates");

        const link = document.createElement("a");
        link.className = "m-l-0 has-arrow";
        link.href = "javascript:void(0);";
        link.innerHTML = `<span class="text">Các thời hạn nộp bài</span>`;

        let reactRoot: any = null;

        link.addEventListener("click", (e) => {
          e.preventDefault();

          // Hide <div id="page" class="container-fluid">
          const originalPage =
            document.querySelector<HTMLElement>("#page.container-fluid") ||
            document.getElementById("page");
          if (originalPage) {
            originalPage.style.display = "none";
          }

          // Check if custom page div already exists, if not create it
          let customPage = document.getElementById(customPageId);
          if (!customPage) {
            if (originalPage) {
              customPage = originalPage.cloneNode(false) as HTMLElement;
              customPage.id = customPageId;
              customPage.style.display = "block";
            } else {
              customPage = document.createElement("div");
              customPage.id = customPageId;
              customPage.className = "container-fluid";
            }

            customPage.style.marginTop = "40px";
            customPage.style.padding = "2rem";

            if (originalPage && originalPage.parentNode) {
              originalPage.parentNode.insertBefore(
                customPage,
                originalPage.nextSibling,
              );
            } else {
              document.body.appendChild(customPage);
            }

            // Create React root and render our component inside customPage
            reactRoot = createRoot(customPage);
            reactRoot.render(<CustomElearningPage />);
          } else {
            customPage.style.display = "block";
          }
        });

        // Restore original page when clicking other links in nav-drawer or header
        document.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;
          const closestLink = target.closest("a");
          if (closestLink && closestLink !== link) {
            const originalPage =
              document.querySelector<HTMLElement>("#page.container-fluid") ||
              document.getElementById("page");
            if (originalPage) {
              originalPage.style.display = "";
            }
            const customPage = document.getElementById(customPageId);
            if (customPage) {
              customPage.style.display = "none";
            }
          }
        });

        iconSpan.appendChild(link);
        controlPanelLink.appendChild(iconSpan);
      }
    }
  },
});
