import { execute } from ".";

// Add icon to "Bãng Điều khiển" menu item
execute({
  func: () => {
    const controlPanelLink = document.querySelector("#nav-drawer ul");
    const id = "test";
    if (controlPanelLink) {
      const existingIcon = controlPanelLink.querySelector("." + id);
      if (!existingIcon) {
        const iconSpan = document.createElement("li");
        iconSpan.className = "list-group-item " + id;
        iconSpan.setAttribute("data-key", "certificates");
        iconSpan.innerHTML = /* tx */ `
          <a class="m-l-0 has-arrow" href="javascript:void(0);">
              <span class="text">Các thời hạn nộp bài</span>
          </a>
        `;
        controlPanelLink.appendChild(iconSpan);
      }
    }
  },
});
