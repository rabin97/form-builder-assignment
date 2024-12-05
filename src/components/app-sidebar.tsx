"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { Team } from "@/components/team"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Form } from "@prisma/client"

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {



  const [forms, setForms] = React.useState<Form[]>([]);
  console.log("🚀 ~ AppSidebar ~ forms:", forms)
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchForms() {
      try {
        const response = await fetch("/api/get-all-forms", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setForms(data);
      } catch (err) {
        console.error("Failed to fetch forms:", err);
        setError("Failed to fetch forms");
      }
    }

    fetchForms();
  }, []);

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Form Builder",
        url: "/",
        icon: Bot,
      },
      {
        title: "Forms",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: forms.map((form) => ({
          title: form.title,
          url: `/${form.id}`,
        })),
      },
      {
        title: "Submited Forms Data",
        url: "/submited-form-data",
        icon: Bot,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Team />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
