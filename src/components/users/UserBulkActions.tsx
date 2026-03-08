import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Trash2, X } from "lucide-react";

type AppRole = "admin" | "manager" | "user";

interface Props {
  count: number;
  onSetRole: (role: AppRole) => void;
  onDelete: () => void;
  onClear: () => void;
}

export function UserBulkActions({ count, onSetRole, onDelete, onClear }: Props) {
  if (count === 0) return null;

  return (
    <Card className="shadow-card border-primary/20 bg-primary/5">
      <CardContent className="p-2 flex items-center justify-between">
        <span className="text-xs font-medium text-primary">{count} user(s) selected</span>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => onSetRole("admin")}>
            <Shield className="h-3 w-3 mr-1" /> Set Admin
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => onSetRole("manager")}>
            <Shield className="h-3 w-3 mr-1" /> Set Manager
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => onSetRole("user")}>
            <Shield className="h-3 w-3 mr-1" /> Set User
          </Button>
          <Button variant="destructive" size="sm" className="h-7 text-[10px]" onClick={onDelete}>
            <Trash2 className="h-3 w-3 mr-1" /> Delete
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={onClear}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
