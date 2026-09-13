export const exportInventoryCsv = (products) => {
  const headers = [
    "Product",
    "SKU",
    "Category",
    "Supplier",
    "Price",
    "Current Stock",
    "Minimum Stock",
    "Inventory Value",
    "Status"
  ];

  const rows = products.map(p => {
    const value = p.price * p.stock;
    const status = p.stock === 0 ? "Out of Stock" : p.stock <= p.minStock ? "Low Stock" : "In Stock";
    
    return [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.sku.replace(/"/g, '""')}"`,
      `"${p.category.replace(/"/g, '""')}"`,
      `"${p.supplier.replace(/"/g, '""')}"`,
      p.price,
      p.stock,
      p.minStock,
      value,
      status
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  triggerDownload(csvContent, `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportMovementsCsv = (movements, products) => {
  const headers = [
    "Date",
    "Product",
    "SKU",
    "Type",
    "Quantity",
    "Previous Stock",
    "New Stock",
    "Reference",
    "Reason",
    "Notes"
  ];

  const rows = movements.map(m => {
    const product = products.find(p => p.id === m.productId);
    const productName = product ? product.name : "Deleted Product";
    const productSku = product ? product.sku : "N/A";
    
    const formattedDate = new Intl.DateTimeFormat('en-GB', { 
      day: 'numeric', month: 'short', year: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: true
    }).format(new Date(m.createdAt));

    return [
      `"${formattedDate}"`,
      `"${productName.replace(/"/g, '""')}"`,
      `"${productSku.replace(/"/g, '""')}"`,
      `"${m.type}"`,
      m.quantity,
      m.previousStock,
      m.newStock,
      `"${m.reference.replace(/"/g, '""')}"`,
      `"${m.reason.replace(/"/g, '""')}"`,
      `"${m.notes.replace(/"/g, '""')}"`
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  triggerDownload(csvContent, `movements_export_${new Date().toISOString().split('T')[0]}.csv`);
};

function triggerDownload(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
