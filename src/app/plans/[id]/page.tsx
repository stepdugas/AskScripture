import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { READING_PLANS, getPlan } from "@/data/reading-plans";
import { PlanClient } from "./plan-client";

type Params = { id: string };

export async function generateStaticParams() {
  return READING_PLANS.map((p) => ({ id: p.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { id } = await params;
  const p = getPlan(id);
  if (!p) return {};
  return { title: p.title, description: p.blurb };
}

export default async function PlanDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const plan = getPlan(id);
  if (!plan) notFound();
  return <PlanClient plan={plan} />;
}
