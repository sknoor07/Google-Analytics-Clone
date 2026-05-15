import { NextRequest, NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser || !clerkUser.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = clerkUser.primaryEmailAddress.emailAddress;
        const name = clerkUser.fullName ?? "";
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Server error" },
            { status: 500 }
        );
    }
}
