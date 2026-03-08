import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";

export interface UserFilterState {
  search: string;
  role: string;
  joinedPeriod: string;
}

export const defaultUserFilters: UserFilterState = {
  search: "",
  role: "all",
  joinedPeriod: "all",
};

interface Props {
  filters: UserFilterState;
  onChange: (filters: UserFilterState) => void;
}

export function UserFilters({ filters, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = Object.entries(filters).filter(([k, v]) => k !== "search" && v !== "all" && v !== "").length;

  const update = (key: keyof UserFilterState, value: string) => onChange({ ...filters, [key]: value });
  const clearAll = () => onChange(defaultUserFilters);

  return (
    <Card className="shadow-card">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search users by name..."
              className="h-8 pl-8 text-xs"
              value={filters.search}
              onChange={(e) => update("search", e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => setExpanded(!expanded)}
          >
            <SlidersHorizontal className="h-3 w-3" />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary" className="h-4 px-1 text-[9px]">
                {activeCount}
              </Badge>
            )}
          </Button>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearAll}>
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}
        </div>

        {expanded && (
          <div className="flex flex-wrap gap-2 pt-1">
            <Select value={filters.role} onValueChange={(v) => update("role", v)}>
              <SelectTrigger className="h-7 w-32 text-xs">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.joinedPeriod} onValueChange={(v) => update("joinedPeriod", v)}>
              <SelectTrigger className="h-7 w-36 text-xs">
                <SelectValue placeholder="Joined" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
