"use client";

import AuthGate from "@/components/workbench/AuthGate";
import LedgerViewer from "@/components/workbench/LedgerViewer";

export default function WorkbenchApp() {
  return (
    <AuthGate>
      {(token, onAuthError) => <LedgerViewer token={token} onAuthError={onAuthError} />}
    </AuthGate>
  );
}
