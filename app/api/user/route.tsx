import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser || !clerkUser.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = clerkUser.primaryEmailAddress.emailAddress;
        const name = clerkUser.fullName ?? "";

        // Check if the user already exists in the database
        const existingUsers = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

        if (existingUsers.length > 0) {
            return NextResponse.json(existingUsers[0], { status: 200 });
        }

        // Insert new user if they don't exist
        const insertedUsers = await db
            .insert(usersTable)
            .values({
                name: name,
                email: email,
            })
            .returning();

        const insertedUser = insertedUsers[0];
        if (!insertedUser) {
            return NextResponse.json(
                { error: "Failed to create user in database" },
                { status: 500 }
            );
        }

        return NextResponse.json(insertedUser, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Server error" },
            { status: 500 }
        );
    }
}
