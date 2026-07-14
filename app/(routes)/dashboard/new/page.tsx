
import { Suspense } from "react";
import AddWebsiteClient from "./_component/AddWebsiteClient";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddWebsiteClient />
        </Suspense>
    );
}