import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

export default function SettingsPage() {
  const { toast } = useToast();
  const { t } = useI18n();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('nav.settings')}</h1>
        <p className="text-sm text-muted-foreground">Configure your business preferences</p>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-sm">Company Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs">Business Name</Label><Input defaultValue="AluERP Manufacturing PLC" /></div>
            <div><Label className="text-xs">Tax ID / TIN</Label><Input defaultValue="0012345678" /></div>
            <div><Label className="text-xs">Phone</Label><Input defaultValue="+251-911-000000" /></div>
            <div><Label className="text-xs">Email</Label><Input defaultValue="info@aluerp.com" /></div>
          </div>
          <div><Label className="text-xs">Address</Label><Input defaultValue="Bole Sub-City, Addis Ababa, Ethiopia" /></div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-sm">Units & Currency</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div><Label className="text-xs">Currency</Label>
              <Select defaultValue="etb"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="etb">ETB (Birr)</SelectItem>
                  <SelectItem value="usd">$ USD</SelectItem>
                  <SelectItem value="eur">€ EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Weight Unit</Label>
              <Select defaultValue="kg"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lb">Pounds (lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Length Unit</Label>
              <Select defaultValue="mm"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mm">Millimeters (mm)</SelectItem>
                  <SelectItem value="m">Meters (m)</SelectItem>
                  <SelectItem value="in">Inches (in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-sm">Pricing Defaults</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs">Default Markup %</Label><Input type="number" defaultValue="60" /></div>
            <div><Label className="text-xs">VAT Rate %</Label><Input type="number" defaultValue="15" /></div>
            <div><Label className="text-xs">Cutting Fee (per cut)</Label><Input type="number" defaultValue="50" step="1" /></div>
            <div><Label className="text-xs">Installation Fee (per sqm)</Label><Input type="number" defaultValue="250" step="1" /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-sm">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            ['Low stock email alerts', true],
            ['New order notifications', true],
            ['Production milestone alerts', true],
            ['Daily summary email', false],
          ].map(([label, defaultVal]) => (
            <div key={label as string} className="flex items-center justify-between">
              <Label className="text-xs">{label as string}</Label>
              <Switch defaultChecked={defaultVal as boolean} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={() => toast({ title: "Settings Saved", description: "Your preferences have been updated." })}>
        <Save className="h-3.5 w-3.5 mr-1.5" />{t('common.save')} Settings
      </Button>
    </div>
  );
}
