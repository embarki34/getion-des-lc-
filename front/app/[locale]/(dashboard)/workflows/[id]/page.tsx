"use client";

import { useEffect, useState, use } from "react";
import { WorkflowService, WorkflowAction } from "@/lib/services/workflow.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function WorkflowDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [actions, setActions] = useState<WorkflowAction[]>([]);
    const [loading, setLoading] = useState(true);


    const fetchWorkflow = async () => {
        try {
            const data = await WorkflowService.getWorkflowStatus(id);
            setActions(data.availableActions);
        } catch (error) {
            toast.error(
                "Failed to load workflow details",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkflow();
    }, [id]);

    const handleTransition = async (actionName: string) => {
        try {
            await WorkflowService.executeTransition(id, actionName);
            toast.success(
                "Action executed successfully",
            );
            fetchWorkflow(); // Refresh
        } catch (error) {
            toast.error("Failed to execute action");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Workflow Details</h1>
                <Badge variant="outline">{id}</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Available transitions for current state</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        {actions.length === 0 ? (
                            <p className="text-muted-foreground">No actions available (or completed).</p>
                        ) : (
                            actions.map((action) => (
                                <Button key={action.name} onClick={() => handleTransition(action.name)}>
                                    {action.label || action.name}
                                </Button>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
