import { useEffect, useState } from "react";

import packageJson from "../package.json";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./components/shadcn/ui/field";

export default function PopupPage() {
  const [lastInjectionTime, setLastInjectionTime] = useState<string | null>(
    null,
  );

  useEffect(() => {
    // Check for script injection status
    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === "INJECTION_STATUS") {
        setLastInjectionTime(request.timestamp);
      }
    });

    // Get last injection time from storage
    chrome.storage.local.get(["lastInjectionTime"], (data) => {
      const lastInjection = data.lastInjectionTime as string | null;
      if (lastInjection) {
        setLastInjectionTime(lastInjection);
      }
    });
  }, []);

  return (
    <FieldGroup className="p-4">
      <FieldSet>
        <FieldLegend>TDTU Inject Script</FieldLegend>
        <FieldDescription>
          Quản lý việc chèn script vào trang web TDTU. Phiên bản{" "}
          {packageJson.version}
        </FieldDescription>
      </FieldSet>

      <Field>
        <FieldLabel>Trạng thái chèn script</FieldLabel>
        {lastInjectionTime ? (
          <FieldDescription>
            Đã chèn script thành công vào:{" "}
            {new Date(lastInjectionTime).toLocaleString("vi-VN")}
          </FieldDescription>
        ) : (
          <FieldDescription>Chưa có bản ghi chèn script nào</FieldDescription>
        )}
      </Field>
    </FieldGroup>
  );
}
