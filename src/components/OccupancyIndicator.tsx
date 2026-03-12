import { cn } from "@/lib/utils";

interface OccupancyIndicatorProps {
  level: "low" | "medium" | "high";
  percentage: number;
  size?: "sm" | "md";
}

const labels = { low: "Baja", medium: "Media", high: "Alta" };

const OccupancyIndicator = ({ level, percentage, size = "md" }: OccupancyIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rounded-full",
          size === "sm" ? "h-2 w-2" : "h-3 w-3",
          level === "low" && "bg-occupancy-low animate-pulse-dot",
          level === "medium" && "bg-occupancy-medium",
          level === "high" && "bg-occupancy-high animate-pulse-dot"
        )}
      />
      {size === "md" && (
        <span className="text-xs text-muted-foreground">
          {labels[level]} ({percentage}%)
        </span>
      )}
    </div>
  );
};

export default OccupancyIndicator;
