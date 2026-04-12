"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "../../components/ThemeProvider";

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <div
      className="rounded-2xl px-5 py-4 min-w-[200px]"
      style={{
        background: "var(--bg-primary)",
        boxShadow: "var(--neu-extruded)",
      }}
    >
      <p className="font-bold text-sm mb-2.5" style={{ color: "var(--text-primary)" }}>
        {item.name}
      </p>
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span style={{ color: "var(--text-muted)" }}>Frequency</span>
          <span className="font-bold px-2 py-0.5 rounded-md" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
            {item.frequency}%
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span style={{ color: "var(--text-muted)" }}>Severity</span>
          <div className="flex items-center gap-1.5">
            {/* Severity bar */}
            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.severity / 10) * 100}%`,
                  background: item.severity > 6 ? "var(--danger)" : item.severity > 3 ? "var(--warning)" : "var(--emerald)",
                }}
              />
            </div>
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>{item.severity}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SideEffectsChart({ data, color }) {
  const { theme } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-text-muted text-sm">
        No side effects data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.name,
    frequency: item.frequency,
    severity: item.severity,
  }));

  const getOpacity = (severity) => 0.35 + (severity / 10) * 0.65;

  const gridColor = theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(163,177,198,0.2)";
  const axisColor = theme === "dark" ? "#A0AEC0" : "#6B7280";
  const labelColor = theme === "dark" ? "#E2E8F0" : "#3D4852";

  return (
    <ResponsiveContainer width="100%" height={Math.max(chartData.length * 52, 200)}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        barCategoryGap="24%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke={gridColor}
        />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: axisColor, fontWeight: 500 }}
          tickLine={false}
          axisLine={{ stroke: gridColor }}
          unit="%"
        />
        <YAxis
          type="category"
          dataKey="name"
          width={140}
          tick={{ fontSize: 12, fill: labelColor, fontWeight: 500 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}
        />
        <Bar dataKey="frequency" radius={[0, 8, 8, 0]} barSize={22}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={color}
              fillOpacity={getOpacity(entry.severity)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
