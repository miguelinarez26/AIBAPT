import { WEBINARS_DATA } from "@/data/webinars";
import CourseDetailClient from "./CourseDetailClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return WEBINARS_DATA.map((webinar) => ({
    slug: webinar.slug,
  }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const courseFound = WEBINARS_DATA.find(w => w.slug === slug);

  if (!courseFound) {
    notFound();
  }

  return <CourseDetailClient slug={slug} />;
}
