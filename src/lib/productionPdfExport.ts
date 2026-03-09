import { exportToPDF } from "@/lib/pdfExport";
import type { EnhancedWorkOrder } from "@/data/enhancedProductionData";
import { formatETBFull } from "@/data/enhancedProductionData";

export function generateWorkOrderPDF(wo: EnhancedWorkOrder) {
  const content = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
      <div><strong>Work Order #:</strong> ${wo.workOrderNumber}</div>
      <div><strong>Status:</strong> <span class="badge badge-info">${wo.status}</span></div>
      <div><strong>Product:</strong> ${wo.productName} (${wo.productCode})</div>
      <div><strong>Category:</strong> ${wo.productCategory}</div>
      <div><strong>Customer:</strong> ${wo.customerName || '—'}</div>
      <div><strong>Priority:</strong> <span class="badge badge-${wo.priority === 'Critical' || wo.priority === 'Urgent' ? 'danger' : wo.priority === 'High' ? 'warning' : 'info'}">${wo.priority}</span></div>
      <div><strong>Stage:</strong> ${wo.currentStage}</div>
      <div><strong>Progress:</strong> ${wo.progress}%</div>
      <div><strong>Start:</strong> ${wo.actualStart || wo.scheduledStart}</div>
      <div><strong>Due:</strong> ${wo.scheduledEnd}</div>
      <div><strong>Team:</strong> ${wo.assignedTeam || 'Unassigned'}</div>
      <div><strong>Quantity:</strong> ${wo.completed}/${wo.quantity} (${wo.scrap} scrap)</div>
    </div>

    <div class="section-title">Specifications</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px;">
      ${wo.specifications.width ? `<div>Width: <strong>${wo.specifications.width}mm</strong></div>` : ''}
      ${wo.specifications.height ? `<div>Height: <strong>${wo.specifications.height}mm</strong></div>` : ''}
      ${wo.specifications.thickness ? `<div>Thickness: <strong>${wo.specifications.thickness}mm</strong></div>` : ''}
      ${wo.specifications.profile ? `<div>Profile: <strong>${wo.specifications.profile}</strong></div>` : ''}
      ${wo.specifications.glass ? `<div>Glass: <strong>${wo.specifications.glass}</strong></div>` : ''}
      ${wo.specifications.color ? `<div>Color: <strong>${wo.specifications.color}</strong></div>` : ''}
    </div>

    <div class="section-title">Cost Summary</div>
    <table>
      <tr><th>Category</th><th class="text-right">Estimated</th><th class="text-right">Actual</th><th class="text-right">Variance</th></tr>
      <tr><td>Materials</td><td class="text-right">${formatETBFull(wo.estimated.materialCost)}</td><td class="text-right">${formatETBFull(wo.actual.materialCost)}</td><td class="text-right">${formatETBFull(wo.estimated.materialCost - wo.actual.materialCost)}</td></tr>
      <tr><td>Labor</td><td class="text-right">${formatETBFull(wo.estimated.laborCost)}</td><td class="text-right">${formatETBFull(wo.actual.laborCost)}</td><td class="text-right">${formatETBFull(wo.estimated.laborCost - wo.actual.laborCost)}</td></tr>
      <tr><td>Overhead</td><td class="text-right">${formatETBFull(wo.estimated.overheadCost)}</td><td class="text-right">${formatETBFull(wo.actual.overheadCost)}</td><td class="text-right">${formatETBFull(wo.estimated.overheadCost - wo.actual.overheadCost)}</td></tr>
      <tr style="background:#eff6ff;"><td class="font-bold">TOTAL</td><td class="text-right font-bold">${formatETBFull(wo.estimated.totalCost)}</td><td class="text-right font-bold">${formatETBFull(wo.actual.totalCost)}</td><td class="text-right font-bold">${formatETBFull(wo.estimated.totalCost - wo.actual.totalCost)}</td></tr>
    </table>

    ${wo.notes ? `<div class="section-title">Notes</div><p style="font-size:11px;padding:8px;background:#f8fafc;border-radius:4px;">${wo.notes}</p>` : ''}
  `;

  exportToPDF({
    title: `Work Order ${wo.workOrderNumber}`,
    subtitle: `${wo.productName} — ${wo.status}`,
    content,
  });
}

export function generateProductionReportPDF(workOrders: EnhancedWorkOrder[]) {
  const rows = workOrders.map(wo => `
    <tr>
      <td>${wo.workOrderNumber}</td>
      <td>${wo.productName}</td>
      <td>${wo.customerName || '—'}</td>
      <td class="text-center"><span class="badge badge-info">${wo.currentStage}</span></td>
      <td class="text-center">${wo.progress}%</td>
      <td class="text-center">${wo.completed}/${wo.quantity}</td>
      <td class="text-right">${formatETBFull(wo.estimated.totalCost)}</td>
      <td><span class="badge badge-${wo.priority === 'Critical' || wo.priority === 'Urgent' ? 'danger' : wo.priority === 'High' ? 'warning' : 'info'}">${wo.priority}</span></td>
    </tr>
  `).join('');

  const totalEst = workOrders.reduce((s, w) => s + w.estimated.totalCost, 0);
  const totalAct = workOrders.reduce((s, w) => s + w.actual.totalCost, 0);

  const content = `
    <div style="margin-bottom:16px;">
      <p>Total Work Orders: <strong>${workOrders.length}</strong> · 
      Active: <strong>${workOrders.filter(w => w.status === 'In Progress' || w.status === 'Scheduled').length}</strong> · 
      Completed: <strong>${workOrders.filter(w => w.status === 'Completed').length}</strong></p>
    </div>
    <table>
      <tr><th>WO #</th><th>Product</th><th>Customer</th><th class="text-center">Stage</th><th class="text-center">Progress</th><th class="text-center">Qty</th><th class="text-right">Est. Cost</th><th>Priority</th></tr>
      ${rows}
      <tr style="background:#eff6ff;">
        <td colspan="6" class="font-bold">Totals</td>
        <td class="text-right font-bold">${formatETBFull(totalEst)}</td>
        <td></td>
      </tr>
    </table>
    <div style="margin-top:16px;">
      <div class="summary-row"><span class="summary-label">Total Estimated Cost:</span><span class="summary-value">${formatETBFull(totalEst)}</span></div>
      <div class="summary-row"><span class="summary-label">Total Actual Cost:</span><span class="summary-value">${formatETBFull(totalAct)}</span></div>
      <div class="summary-row total-row"><span class="summary-label">Cost Variance:</span><span class="summary-value">${formatETBFull(totalEst - totalAct)}</span></div>
    </div>
  `;

  exportToPDF({
    title: 'Production Report',
    subtitle: `${workOrders.length} Work Orders`,
    content,
  });
}
