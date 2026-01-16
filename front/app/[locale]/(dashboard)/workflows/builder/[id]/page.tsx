"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { WorkflowService } from "@/lib/services/workflow.service";

import { bffClient } from "@/lib/api/client";
import { ArrowLeft, Plus, Save } from "lucide-react";
import Link from "next/link";

interface WorkflowStep {
    id: string;
    name: string;
    label?: string;
    order: number;
    isInitial: boolean;
    isFinal: boolean;
    roleRequired?: string;
    description?: string;
}

interface WorkflowDefinition {
    id: string;
    name: string;
    description?: string;
    version: number;
    isActive: boolean;
    steps: WorkflowStep[];
}

export default function WorkflowEditorPage() {
    const params = useParams();
    const id = params.id as string;
    const [workflow, setWorkflow] = useState<WorkflowDefinition | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddStep, setShowAddStep] = useState(false);

    // New Step Form State
    const [newStep, setNewStep] = useState({
        name: "",
        label: "",
        order: 1,
        isInitial: false,
        isFinal: false,
        roleRequired: "",
    });

    useEffect(() => {
        if (id) fetchWorkflow();
    }, [id]);

    const fetchWorkflow = async () => {
        try {
            const res = await WorkflowService.getDefinitionById(id);
            setWorkflow(res);
            // Auto-increment order based on last step
            if (res.steps.length > 0) {
                const maxOrder = Math.max(...res.steps.map((s: WorkflowStep) => s.order));
                setNewStep(prev => ({ ...prev, order: maxOrder + 1 }));
            }
        } catch (error) {
            console.error("Failed to fetch workflow", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStep = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!workflow) return;

        try {
            const res = await WorkflowService.addStep(id, newStep);
            setWorkflow({
                ...workflow,
                steps: [...workflow.steps, res].sort((a, b) => a.order - b.order)
            });
            setShowAddStep(false);
            setNewStep(prev => ({
                ...prev,
                name: "",
                label: "",
                order: prev.order + 1,
                isInitial: false,
                isFinal: false
            }));
        } catch (error) {
            console.error("Failed to add step", error);
            alert("Failed to add step");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!workflow) return <div className="p-6">Workflow not found</div>;

    return (
        <div className="p-6">
            <Link href="/workflows/builder" className="flex items-center text-gray-500 hover:text-gray-700 mb-6 w-fit">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workflows
            </Link>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{workflow.name}</h1>
                    <p className="text-gray-500">{workflow.description}</p>
                </div>
                <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${workflow.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {workflow.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            {/* Steps Visualization */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Workflow Steps</h2>
                <div className="space-y-4">
                    {workflow.steps.length === 0 ? (
                        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                            <p className="text-gray-500">No steps defined yet. Add your first step below.</p>
                        </div>
                    ) : (
                        workflow.steps.map((step, index) => (
                            <div key={step.id} className="flex items-center relative">
                                {/* Connector Line */}
                                {index < workflow.steps.length - 1 && (
                                    <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 h-10 translate-y-full -z-10"></div>
                                )}

                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mr-4 shrink-0">
                                    {step.order}
                                </div>

                                <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{step.label || step.name}</h4>
                                            <p className="text-xs text-gray-500 font-mono mt-1">{step.name}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {step.isInitial && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Initial</span>}
                                            {step.isFinal && <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded">Final</span>}
                                            {step.roleRequired && <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded">{step.roleRequired}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Step Form */}
            {showAddStep ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4">Add New Step</h3>
                    <form onSubmit={handleAddStep} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Step Name (Internal ID)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., REVIEW_PHASE"
                                    className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
                                    value={newStep.name}
                                    onChange={e => setNewStep({ ...newStep, name: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Display Label</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Review Phase"
                                    className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
                                    value={newStep.label}
                                    onChange={e => setNewStep({ ...newStep, label: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Order</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
                                    value={newStep.order}
                                    onChange={e => setNewStep({ ...newStep, order: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role Required</label>
                                <input
                                    type="text"
                                    placeholder="Optional (e.g., SUPER_ADMIN)"
                                    className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600"
                                    value={newStep.roleRequired}
                                    onChange={e => setNewStep({ ...newStep, roleRequired: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newStep.isInitial}
                                    onChange={e => setNewStep({ ...newStep, isInitial: e.target.checked })}
                                />
                                <span className="text-sm">Is Initial Step</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newStep.isFinal}
                                    onChange={e => setNewStep({ ...newStep, isFinal: e.target.checked })}
                                />
                                <span className="text-sm">Is Final Step</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowAddStep(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Save Step
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setShowAddStep(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Step
                </button>
            )}
        </div>
    );
}
