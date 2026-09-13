import React from "react";
import { Badge } from "../ui/Badge";
import { getStockStatus } from "../../utils/inventory";

export function ProductStatusBadge({ stock, minStock }) {
  const status = getStockStatus(stock, minStock);
  return <Badge status={status} />;
}
