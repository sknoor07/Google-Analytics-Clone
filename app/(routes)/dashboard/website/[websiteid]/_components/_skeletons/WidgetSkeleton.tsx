import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SourceWidgetSkeleton() {
  return (
    <div>
      <Card>
        <CardContent className="p-5">
          <Tabs defaultValue="source" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="source">Source</TabsTrigger>
              <TabsTrigger value="refParams">Referral Parameters</TabsTrigger>
            </TabsList>

            <TabsContent value="source" className="mt-4">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 flex-1" />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="refParams" className="mt-4">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 flex-1" />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default SourceWidgetSkeleton;