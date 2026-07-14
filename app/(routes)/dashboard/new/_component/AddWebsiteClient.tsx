"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GeneratedScript from "./GeneratedScript";
import WebsiteFrom from "./WebsiteFrom";


export default function AddWebsiteClient() {
    const searchParams = useSearchParams();
    const step = searchParams.get("step");

    if (step === "script") {
        return (
            <div className="flex items-center justify-center w-full mt-10">
                <div className="max-w-lg w-full flex flex-col items-start">
                    <Link href="/dashboard">
                        <Button>
                            <ArrowLeft />
                            Dashboard
                        </Button>
                    </Link>

                    <div className="mt-10 w-full">
                        <GeneratedScript />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center w-full mt-10">
            <div className="max-w-lg w-full flex flex-col items-start">
                <Link href="/dashboard">
                    <Button>
                        <ArrowLeft />
                        Dashboard
                    </Button>
                </Link>

                <div className="mt-10 w-full">
                    <WebsiteFrom />
                </div>
            </div>
        </div>
    );
}