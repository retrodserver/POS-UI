import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function OnlineStoreLogsView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-slate-500" />
          Online Store Logs
        </CardTitle>
        <CardDescription>
          This view hasn't been implemented yet. Online store activity logs will appear here once built.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500">Not yet implemented.</p>
      </CardContent>
    </Card>
  );
}
