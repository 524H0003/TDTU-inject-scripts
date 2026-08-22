import { CustomElearningPage } from "@/components/elearning/CustomElearningPage";
import { createRoot } from "react-dom/client";

import { execute } from ".";

export { CustomElearningPage };

// Add icon to "Bảng Điều khiển" menu item
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
            const root = createRoot(customPage);
            root.render(<CustomElearningPage />);
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