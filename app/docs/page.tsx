// Redirect to /docs/installation as the main entry point for the documentation
import { redirect } from "next/navigation";

export default function DocsPage() {
  redirect("/docs/installation");
}