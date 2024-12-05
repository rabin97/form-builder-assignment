
// import { SubmittedData } from "@/components/submited-form-table";
import { prisma } from "@/lib/prisma";

async function fetchSubmittedAnswers() {
    try {
        // Fetch all submitted answers with associated form details
        const submittedAnswers = await prisma.submittedFormAnswer.findMany({
            include: {
                form: {
                    include: {
                        paragraph: true,
                        categories: true,
                        fillInBlanks: true,
                    },
                },
            },
        });

        return submittedAnswers;
    } catch (error) {
        console.error("Error fetching submitted answers:", error);
        throw new Error("Failed to fetch submitted answers");
    }
}


export default async function page() {

    const data = await fetchSubmittedAnswers();

    return (
        <div className="w-full">
            {/* <SubmittedData data={data} /> */}
        </div>
    );
}
