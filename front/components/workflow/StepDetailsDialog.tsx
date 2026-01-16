"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock, FileText, Users } from 'lucide-react';

interface StepDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    step: any;
    stepData?: Record<string, any>;
    isCompleted: boolean;
    isCurrent: boolean;
}

export function StepDetailsDialog({
    open,
    onOpenChange,
    step,
    stepData,
    isCompleted,
    isCurrent
}: StepDetailsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : isCurrent ? (
                            <Clock className="h-6 w-6 text-blue-500 animate-pulse" />
                        ) : (
                            <Circle className="h-6 w-6 text-gray-400" />
                        )}
                        <div>
                            <DialogTitle>{step?.label}</DialogTitle>
                            <DialogDescription>{step?.description}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Status */}
                    <div>
                        <h4 className="font-medium text-sm mb-2">Status</h4>
                        <Badge
                            variant={isCompleted ? "default" : isCurrent ? "secondary" : "outline"}
                            className={
                                isCompleted ? "bg-green-500" :
                                    isCurrent ? "bg-blue-500" :
                                        "bg-gray-300"
                            }
                        >
                            {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Pending"}
                        </Badge>
                    </div>

                    {/* Required Fields */}
                    {step?.requiredFields && step.requiredFields.length > 0 && (
                        <Card>
                            <CardContent className="pt-4">
                                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Required Fields
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {step.requiredFields.map((field: any, idx: number) => {
                                        const fieldName = typeof field === 'string' ? field : field.name;
                                        const fieldLabel = typeof field === 'string' ? field : (field.label || field.name);
                                        const fieldValue = stepData?.[fieldName];

                                        // Format value based on field type
                                        let displayValue = fieldValue;
                                        if (fieldValue && typeof field === 'object') {
                                            if (field.type === 'date') {
                                                try {
                                                    displayValue = new Date(fieldValue).toLocaleDateString();
                                                } catch { }
                                            } else if (field.type === 'checkbox') {
                                                displayValue = fieldValue ? '✓' : '✗';
                                            } else if ((field.type === 'number' || field.type === 'calculated') && typeof fieldValue === 'number') {
                                                displayValue = fieldValue.toLocaleString();
                                            }
                                        }

                                        return (
                                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded">
                                                <div className="text-sm">
                                                    <div className="font-medium">{fieldLabel}</div>
                                                    {displayValue && (
                                                        <div className="text-xs text-gray-600">{String(displayValue)}</div>
                                                    )}
                                                </div>
                                                {stepData?.[fieldName] ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Circle className="h-4 w-4 text-gray-400" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Required Documents */}
                    {step?.requiredDocuments && step.requiredDocuments.length > 0 && (
                        <Card>
                            <CardContent className="pt-4">
                                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Required Documents
                                </h4>
                                <ul className="space-y-2">
                                    {step.requiredDocuments.map((doc: string) => (
                                        <li key={doc} className="flex items-center gap-2 text-sm">
                                            <Circle className="h-3 w-3" />
                                            {doc}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Approval Requirements */}
                    {step?.requiresApproval && (
                        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                            <CardContent className="pt-4">
                                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Approval Required
                                </h4>
                                <p className="text-sm">
                                    {step.approvalRoles?.length > 0
                                        ? `Requires approval from: ${step.approvalRoles.join(', ')}`
                                        : 'Requires approval from authorized personnel'}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step Data (if completed) */}
                    {isCompleted && stepData && Object.keys(stepData).length > 0 && (
                        <Card>
                            <CardContent className="pt-4">
                                <h4 className="font-medium text-sm mb-3">Completed Data</h4>
                                <div className="space-y-2">
                                    {Object.entries(stepData).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{key}:</span>
                                            <span className="font-medium">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
