import RenderedForm from "@/components/rendered-form";
import { prisma } from "@/lib/prisma";

export default async function Page({
    params,
}: {
    params: Promise<{ formId: string }>;
}) {
    const { formId } = await params;

    // Fetch form data server-side
    const fetchFormData = async (formId: string) => {
        try {
            if (!formId) {
                throw new Error("Form ID is required");
            }
            const response = await prisma.form.findUnique({
                where: {
                    id: formId,
                },
                include: {
                    categories: {
                        include: {
                            answers: true,
                        },
                    },
                    fillInBlanks: {
                        include: {
                            answers: true,
                        },
                    },
                    paragraph: {
                        include: {
                            questions: {
                                include: {
                                    answers: true,
                                }
                            }
                        },
                    },
                },
            });


            return response;
        } catch (error) {
            console.error("Error fetching form data:", error);
            return null;
        }
    };

    const data: any = await fetchFormData(formId);

    if (!data) {
        return <div>Error loading form data</div>;
    }

    return (
        <>
            {
                data && data.title && data.id && (
                    <RenderedForm data={data} formId={formId} />
                )
            }
        </>
    );
}
