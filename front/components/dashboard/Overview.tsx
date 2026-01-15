"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Jan",
    total: 12,
  },
  {
    name: "Feb",
    total: 18,
  },
  {
    name: "Mar",
    total: 45,
  },
  {
    name: "Apr",
    total: 32,
  },
  {
    name: "May",
    total: 48,
  },
  {
    name: "Jun",
    total: 55,
  },
  {
    name: "Jul",
    total: 62,
  },
  {
    name: "Aug",
    total: 58,
  },
  {
    name: "Sep",
    total: 45,
  },
  {
    name: "Oct",
    total: 38,
  },
  {
    name: "Nov",
    total: 42,
  },
  {
    name: "Dec",
    total: 52,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
