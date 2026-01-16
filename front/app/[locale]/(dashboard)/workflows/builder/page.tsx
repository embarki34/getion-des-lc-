"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorkflowService } from "@/lib/services/workflow.service";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WorkflowDefinition {
    id: string;
    name: string;
    description?: string;
    version: number;
    isActive: boolean;
    steps: any[];
}

export default function WorkflowBuilderPage() {
    const t = useTranslations("Workflow");
    const router = useRouter();
    const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");

    // Form State
    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
    });

    useEffect(() => {
        fetchDefinitions();
    }, []);

    const fetchDefinitions = async () => {
        try {
            console.log("Fetching definitions...");
            const res = await WorkflowService.getDefinitions();
            console.log("Definitions response:", res);

            if (Array.isArray(res)) {
                setWorkflows(res);
            } else {
                console.error("Definitions response is not an array:", res);
                setWorkflows([]);
            }
        } catch (error) {
            console.error("Failed to fetch definitions", error);
            setWorkflows([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newItem.name) return;
        setError(""); // Clear previous errors

        setIsCreating(true);
        try {
            const res = await WorkflowService.createDefinition(newItem.name, newItem.description || "New Workflow");
            router.push(`/workflows/builder/${res.id}`);
            // Dialog closes naturally on navigation or we can force it, but better to let it be or close it.
            setIsDialogOpen(false);
        } catch (err: any) {
            console.error("Failed to create workflow", err);
            // Handle Axios error response
            const msg = err.response?.data?.message || err.message || "Failed to create workflow";
            setError(msg);
            // Keep dialog open on error
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Workflow Builder
                    </h1>
                    <p className="text-gray-500">Create and manage workflow templates</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setError(""); // Clear error when closing
                        setNewItem({ name: "", description: "" });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Workflow
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Workflow</DialogTitle>
                            <DialogDescription>
                                Define a new workflow template to automate your processes.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                                    {error}
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Expense Approval"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the purpose of this workflow..."
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate} disabled={!newItem.name || isCreating}>
                                {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workflows.map((wf) => (
                        <div
                            key={wf.id}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                        {wf.name}
                                    </h3>
                                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                                        Version {wf.version}
                                    </span>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded text-xs ${wf.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {wf.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                                {wf.description || "No description provided."}
                            </p>
                            <div className="flex justify-between items-center text-sm text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <span>{wf.steps?.length || 0} Steps</span>
                                <Link
                                    href={`/workflows/builder/${wf.id}`}
                                    className="text-blue-600 hover:underline flex items-center"
                                >
                                    Edit Steps &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
