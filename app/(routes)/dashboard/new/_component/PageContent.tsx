"use client";

import { useSearchParams } from "next/navigation";
import GeneratedScript from "./GeneratedScript";
import WebsiteFrom from "./WebsiteFrom";



export default function PageContent() {
  const searchParams = useSearchParams();

  const step = searchParams.get("step");

  return step === "script"
    ? <GeneratedScript />
    : <WebsiteFrom />;
}