import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {

    try {

        const allForms = await prisma.form.findMany({
            select: {
                id: true,
                title: true,
            }
        })

        return NextResponse.json(allForms, { statusText: "OK" })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Failed to get all forms" }, { status: 500 })
    }

}