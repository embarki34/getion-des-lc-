"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepFieldConfig } from '@/lib/services/workflow/WorkflowTemplateService';
import { Loader2, Upload, X, FileText } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { DynamicStepField } from './DynamicStepField';

interface StepCompletionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    step: any;
    onComplete: (data: Record<string, any>, files: File[]) => Promise<void>;
}

export function StepCompletionDialog({ open, onOpenChange, step, onComplete }: StepCompletionDialogProps) {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setUploadedFiles([...uploadedFiles, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    };

    const handleInputChange = (fieldName: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await onComplete(formData, uploadedFiles);
            onOpenChange(false);
            setFormData({});
            setUploadedFiles([]);
        } catch (error) {
            console.error('Failed to complete step:', error);
            alert('Failed to complete step: ' + (error as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Complete Step: {step?.label}</DialogTitle>
                    <DialogDescription>
                        {step?.description || 'Fill in the required information to complete this step'}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {/* Required Fields */}
                    {step?.requiredFields && step.requiredFields.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-medium text-sm">Required Information</h4>
                            {step.requiredFields.map((field: StepFieldConfig | string) => {
                                // Handle legacy string format
                                if (typeof field === 'string') {
                                    return (
                                        <div key={field} className="space-y-2">
                                            <Label htmlFor={field}>
                                                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id={field}
                                                value={formData[field] || ''}
                                                onChange={(e) => handleInputChange(field, e.target.value)}
                                                placeholder={`Enter ${field}`}
                                            />
                                        </div>
                                    );
                                }

                                // Handle new StepFieldConfig format
                                return (
                                    <DynamicStepField
                                        key={field.name}
                                        field={field}
                                        value={formData[field.name]}
                                        onChange={(value) => handleInputChange(field.name, value)}
                                        allFieldValues={formData}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Required Documents */}
                    {step?.requiredDocuments && step.requiredDocuments.length > 0 && (
                        <Card>
                            <CardContent className="pt-4">
                                <h4 className="font-medium text-sm mb-3">Required Documents</h4>

                                <div className="space-y-2 mb-3">
                                    {step.requiredDocuments.map((doc: string) => (
                                        <div key={doc} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <FileText className="h-4 w-4" />
                                            {doc}
                                        </div>
                                    ))}
                                </div>

                                {/* File Upload */}
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="file-upload"
                                        className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
                                    >
                                        <Upload className="h-5 w-5" />
                                        <span>Click to upload documents</span>
                                        <Input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </Label>

                                    {/* Uploaded Files List */}
                                    {uploadedFiles.length > 0 && (
                                        <div className="space-y-2">
                                            {uploadedFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-900 rounded"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4" />
                                                        <span className="text-sm">{file.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            ({(file.size / 1024).toFixed(1)} KB)
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFile(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Approval Notice */}
                    {step?.requiresApproval && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                            <p className="text-sm">
                                <strong>Note:</strong> This step requires approval from: {step.approvalRoles?.join(', ') || 'authorized personnel'}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Complete & Move Forward'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
