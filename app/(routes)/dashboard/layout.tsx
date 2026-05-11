import React from "react"
import DashbaordProvider from "./Provider";
import AppHeader from "@/app/_components/AppHeader";

function DashbaordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
    return(
        <DashbaordProvider>
            {children}
        </DashbaordProvider>
    )
}

export default DashbaordLayout;