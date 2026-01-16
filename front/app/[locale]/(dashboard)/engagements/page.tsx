"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EngagementsService, Engagement } from '@/lib/services/engagements.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, FileText, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_CONFIG = {
  'EN_COURS': { label: 'In Progress', color: 'bg-blue-500', icon: Clock },
  'REGLE': { label: 'Settled', color: 'bg-green-500', icon: CheckCircle },
  'ANNULE': { label: 'Cancelled', color: 'bg-red-500', icon: AlertCircle },
};

export default function EngagementsPage() {
  const router = useRouter();
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEngagements();
  }, []);

  const loadEngagements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EngagementsService.getEngagements();
      setEngagements(data);
    } catch (err: any) {
      console.error('Failed to load engagements:', err);
      setError(err.message || 'Failed to load engagements');
    } finally {
      setLoading(false);
    }
  };

  const filteredEngagements = engagements.filter(eng => {
    const matchesStatus = filterStatus === 'all' || eng.statut === filterStatus;
    const matchesSearch = !searchQuery ||
      eng.referenceDossier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eng.typeFinancement.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: engagements.length,
    active: engagements.filter(e => e.statut === 'EN_COURS').length,
    settled: engagements.filter(e => e.statut === 'REGLE').length,
    totalAmount: engagements.reduce((sum, e) => sum + e.montant, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Engagements</h2>
          <p className="text-muted-foreground">
            Manage and track all financial instrument engagements
          </p>
        </div>
        <Link href="/engagements/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            New Engagement
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Settled</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.settled}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(stats.totalAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by reference or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:max-w-sm"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="EN_COURS">In Progress</SelectItem>
                <SelectItem value="REGLE">Settled</SelectItem>
                <SelectItem value="ANNULE">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          {filteredEngagements.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                No engagements found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Get started by creating your first engagement
              </p>
              <Link href="/engagements/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Engagement
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border dark:border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Workflow</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEngagements.map((engagement) => {
                    const statusConfig = STATUS_CONFIG[engagement.statut as keyof typeof STATUS_CONFIG];
                    const StatusIcon = statusConfig?.icon;

                    return (
                      <TableRow
                        key={engagement.id}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-900"
                        onClick={() => router.push(`/engagements/${engagement.id}`)}
                      >
                        <TableCell className="font-medium">
                          {engagement.referenceDossier}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{engagement.typeFinancement}</span>
                            <span className="text-xs text-gray-500">Credit Line</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold">
                              {new Intl.NumberFormat().format(engagement.montant)}
                            </span>
                            <span className="text-xs text-gray-500">{engagement.devise}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-xs">
                            <span>Start: {new Date(engagement.dateEngagement).toLocaleDateString()}</span>
                            <span className="text-gray-500">End: {new Date(engagement.dateEcheance).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`${statusConfig?.color || 'bg-gray-500'} text-white gap-1`}
                          >
                            {StatusIcon && <StatusIcon className="h-3 w-3" />}
                            {statusConfig?.label || engagement.statut}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {engagement.workflowStep && (
                            <Badge variant="outline" className="text-xs">
                              {engagement.workflowStep.label || 'Step ' + engagement.workflowStep.stepOrder}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/engagements/${engagement.id}`);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
