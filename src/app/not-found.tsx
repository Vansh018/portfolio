import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return <main className="error-page"><p>404 / Record not found</p><h1>The requested artifact is not in this archive.</h1><Link href="/">Return to research index <ArrowRight /></Link></main>;
}
