"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  TrendingUp,
  Calendar,
  PieChart,
} from "lucide-react";

export default function ReportsPage() {
  const reports = [
    {
      title: "Credit Line Utilization Report",
      description: "Detailed analysis of credit line usage across all banks",
      icon: TrendingUp,
      frequency: "Monthly",
      lastGenerated: "2024-12-01",
    },
    {
      title: "Outstanding Amounts Report",
      description: "Summary of all outstanding amounts and payment schedules",
      icon: FileText,
      frequency: "Weekly",
      lastGenerated: "2024-12-08",
    },
    {
      title: "Bank Performance Analysis",
      description: "Comparative analysis of bank partnerships and terms",
      icon: PieChart,
      frequency: "Quarterly",
      lastGenerated: "2024-10-01",
    },
    {
      title: "Expiring Credit Lines",
      description: "List of credit lines expiring in the next 90 days",
      icon: Calendar,
      frequency: "Monthly",
      lastGenerated: "2024-12-01",
    },
    {
      title: "Guarantees Status Report",
      description: "Overview of all active guarantees and their expiry dates",
      icon: FileText,
      frequency: "Monthly",
      lastGenerated: "2024-12-01",
    },
    {
      title: "SWIFT Messages Log",
      description: "Complete log of all SWIFT message exchanges",
      icon: FileText,
      frequency: "Daily",
      lastGenerated: "2024-12-09",
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Generate and download comprehensive reports.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <report.icon className="h-8 w-8 text-primary" />
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </div>
              <CardTitle className="mt-4">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Frequency: {report.frequency}</span>
                <span>Last: {report.lastGenerated}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>
            Create custom reports with specific filters and date ranges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Build Custom Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
