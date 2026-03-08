import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ModuleItem {
  label: string;
  value: string | number;
  color?: string;
}

interface Props {
  title: string;
  icon: any;
  route: string;
  items: ModuleItem[];
  accentColor?: string;
}

export default function ModuleSummaryCard({ title, icon: Icon, route, items, accentColor = 'bg-primary' }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => navigate(route)}>
      <CardHeader className="pb-2 px-3 pt-3">
        <CardTitle className="text-xs font-semibold flex items-center gap-2">
          <div className={`h-5 w-5 rounded flex items-center justify-center ${accentColor}`}>
            <Icon className="h-3 w-3 text-primary-foreground" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground">{item.label}</span>
              <span className={`text-[11px] font-semibold ${item.color || 'text-foreground'}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
