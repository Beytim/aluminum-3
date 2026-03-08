import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  module: string;
  message: string;
  route?: string;
}

interface Props {
  alerts: AlertItem[];
}

export default function DashboardAlerts({ alerts }: Props) {
  const navigate = useNavigate();
  if (alerts.length === 0) return null;

  const colorMap = {
    critical: 'bg-destructive/10 border-destructive/20 text-destructive',
    warning: 'bg-warning/10 border-warning/20 text-warning',
    info: 'bg-info/10 border-info/20 text-info',
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2 px-3 pt-3">
        <CardTitle className="text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
          Action Required ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div className="space-y-1.5 max-h-[200px] overflow-auto">
          {alerts.map(a => (
            <div
              key={a.id}
              className={`flex items-center justify-between p-2 rounded border text-[10px] cursor-pointer ${colorMap[a.type]}`}
              onClick={() => a.route && navigate(a.route)}
            >
              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="text-[8px] mr-1.5 px-1 py-0">{a.module}</Badge>
                <span className="text-foreground">{a.message}</span>
              </div>
              {a.route && <ArrowRight className="h-3 w-3 shrink-0 ml-1 opacity-50" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
