import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import type { EnhancedProduct } from "@/data/enhancedProductData";
import { calcTotalCost, calcMargin } from "@/data/enhancedProductData";

interface Props {
  product: EnhancedProduct;
  language: string;
  onClick: () => void;
}

export default function ProductCard({ product: p, language, onClick }: Props) {
  const mg = calcMargin(p);
  const isLow = p.currentStock <= p.minStock;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="text-[10px]">{p.productType}</Badge>
          <div className="flex items-center gap-1">
            {isLow && <AlertTriangle className="h-3 w-3 text-destructive" />}
            <Badge variant={p.status === 'Active' ? 'outline' : 'secondary'}
              className={`text-[10px] ${p.status === 'Active' ? 'text-success border-success/30' : ''}`}>
              {p.status}
            </Badge>
          </div>
        </div>
        <h3 className="text-sm font-semibold mt-2">{language === 'am' ? p.nameAm : p.name}</h3>
        <p className="text-[10px] text-muted-foreground mt-1">{p.profile} · {p.glass || p.form}</p>
        {p.tags && p.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {p.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0">{tag}</Badge>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-3 pt-2 border-t">
          <span className="text-xs text-muted-foreground">Stock: {p.currentStock}{p.reservedStock > 0 && ` (${p.reservedStock} rsv)`}</span>
          <span className={`text-xs font-semibold ${mg >= 25 ? 'text-success' : mg >= 0 ? 'text-warning' : 'text-destructive'}`}>
            {mg.toFixed(0)}% margin
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">Cost: ETB {calcTotalCost(p).toLocaleString()}</span>
          <span className="text-sm font-bold text-primary">ETB {p.sellingPrice.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
