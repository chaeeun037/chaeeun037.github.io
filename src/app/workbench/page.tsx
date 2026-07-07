import type { Metadata } from "next";
import WorkbenchApp from "@/components/workbench/WorkbenchApp";

export const metadata: Metadata = {
  title: "Workbench",
  robots: { index: false, follow: false },
};

export default function WorkbenchPage() {
  return <WorkbenchApp />;
}
