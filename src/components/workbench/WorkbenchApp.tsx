"use client";

import AuthGate from "@/components/workbench/AuthGate";

export default function WorkbenchApp() {
  return (
    <AuthGate>
      {() => (
        <p className="py-20 text-center text-sm text-gray-500">
          인증 완료 — 원장 뷰어는 WB-1에서 구현됩니다.
        </p>
      )}
    </AuthGate>
  );
}
