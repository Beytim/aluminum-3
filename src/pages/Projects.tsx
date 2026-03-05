import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, Pencil, Download } from "lucide-react";
import { sampleProjects, sampleCustomers } from "@/data/sampleData";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { AddProjectDialog } from "@/components/dialogs/AddProjectDialog";
import { EditProjectDialog } from "@/components/dialogs/EditProjectDialog";
import { generateReportPDF } from "@/lib/pdfExport";
import type { Project, Customer } from "@/data/sampleData";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  Quote: 'bg-muted text-muted-foreground',
  Deposit: 'bg-info/10 text-info',
  'Materials Ordered': 'bg-warning/10 text-warning',
  Production: 'bg-primary/10 text-primary',
  Ready: 'bg-success/10 text-success',
  Installation: 'bg-info/10 text-info',
  Completed: 'bg-success/10 text-success',
};

export default function Projects() {
  const [projects, setProjects] = useLocalStorage<Project[]>(STORAGE_KEYS.PROJECTS, sampleProjects);
  const [customers] = useLocalStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, sampleCustomers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const { t, language } = useI18n();
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast({ title: "Deleted", description: "Project removed." });
  };

  const handleExportPDF = () => {
    generateReportPDF("Project Status Report",
      ['ID', 'Name', 'Customer', 'Type', 'Status', 'Value', 'Progress'],
      projects.map(p => [p.id, p.name, p.customerName, p.type, p.status, `ETB ${p.value.toLocaleString()}`, `${p.progress}%`])
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('nav.projects')}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{projects.length} projects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}><Download className="h-3.5 w-3.5 mr-1.5" />PDF</Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Project</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <Card key={project.id} className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => setEditProject(project)}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono text-muted-foreground">{project.id}</p>
                  <h3 className="text-sm font-semibold mt-0.5 truncate">{language === 'am' ? project.nameAm : project.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{project.customerName}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[project.status]}`}>{project.status}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={e => { e.stopPropagation(); handleDelete(project.id); }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <span className="text-muted-foreground">Type: <strong className="text-foreground">{project.type}</strong></span>
                <span className="text-muted-foreground">Due: <strong className="text-foreground">{project.dueDate}</strong></span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] pt-2 border-t">
                <div>
                  <span className="text-muted-foreground">Value</span>
                  <p className="font-semibold text-foreground">ETB {(project.value / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Deposit</span>
                  <p className="font-semibold text-success">ETB {(project.deposit / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Balance</span>
                  <p className="font-semibold text-warning">ETB {(project.balance / 1000).toFixed(0)}K</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={p => setProjects(prev => [...prev, p])} customers={customers} existingCount={projects.length} />
      <EditProjectDialog open={!!editProject} onOpenChange={open => { if (!open) setEditProject(null); }} project={editProject} customers={customers} onSave={updated => setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))} />
    </div>
  );
}
