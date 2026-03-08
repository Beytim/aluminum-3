import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { EnhancedInstallation } from "@/data/enhancedInstallationData";
import { getStatusColor, getStatusLabel } from "@/data/enhancedInstallationData";

interface Props {
  installations: EnhancedInstallation[];
  currentMonth: Date;
  onMonthChange: (d: Date) => void;
  onView: (inst: EnhancedInstallation) => void;
}

export function InstallationCalendar({ installations, currentMonth, onMonthChange, onView }: Props) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  const byDate = useMemo(() => {
    const map: Record<string, EnhancedInstallation[]> = {};
    installations.forEach(inst => {
      if (inst.scheduledDate.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) {
        (map[inst.scheduledDate] ||= []).push(inst);
      }
    });
    return map;
  }, [installations, year, month]);

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onMonthChange(new Date(year, month - 1, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-sm font-semibold">{monthName}</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onMonthChange(new Date(year, month + 1, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-[10px] font-medium text-muted-foreground text-center py-1">{d}</div>
          ))}
          {days.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} className="min-h-[60px]" />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const insts = byDate[dateStr] || [];
            const isToday = dateStr === today;

            return (
              <div key={day} className={`min-h-[60px] border border-border/50 rounded p-1 ${isToday ? 'bg-primary/5 border-primary/30' : ''}`}>
                <span className={`text-[10px] font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>{day}</span>
                <div className="space-y-0.5 mt-0.5">
                  {insts.slice(0, 2).map(inst => (
                    <div key={inst.id} className={`text-[8px] px-1 py-0.5 rounded cursor-pointer truncate ${getStatusColor(inst.status)}`} onClick={() => onView(inst)} title={`${inst.installationNumber} - ${inst.customerName}`}>
                      {inst.installationNumber}
                    </div>
                  ))}
                  {insts.length > 2 && <div className="text-[8px] text-muted-foreground text-center">+{insts.length - 2} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
