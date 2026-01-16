{/* Details & Audit Trail Tab */ }
<TabsContent value="details" className="mt-6">
    <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Engagement Information */}
        <div className="space-y-6">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Engagement Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="font-medium text-muted-foreground">Reference:</span>
                        <span className="font-mono">{engagement.referenceDossier}</span>

                        <span className="font-medium text-muted-foreground">Type:</span>
                        <span>{engagement.typeFinancement}</span>

                        <span className="font-medium text-muted-foreground">Amount:</span>
                        <span className="font-semibold">{new Intl.NumberFormat().format(engagement.montant)} {engagement.devise}</span>

                        <span className="font-medium text-muted-foreground">Status:</span>
                        <Badge variant={engagement.statut === 'REGLE' ? 'default' : 'secondary'}>
                            {engagement.statut}
                        </Badge>

                        <span className="font-medium text-muted-foreground">Start Date:</span>
                        <span>{new Date(engagement.dateEngagement).toLocaleDateString()}</span>

                        <span className="font-medium text-muted-foreground">End Date:</span>
                        <span>{new Date(engagement.dateEcheance).toLocaleDateString()}</span>

                        <span className="font-medium text-muted-foreground">Created:</span>
                        <span>{engagement.createdAt ? new Date(engagement.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Credit Line Information */}
            {engagementHistory?.ligneCredit && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Credit Line Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="font-medium text-muted-foreground">Reference:</span>
                            <span className="font-mono">{engagementHistory.ligneCredit.reference}</span>

                            <span className="font-medium text-muted-foreground">Type:</span>
                            <span>{engagementHistory.ligneCredit.type}</span>

                            <span className="font-medium text-muted-foreground">Amount:</span>
                            <span>{new Intl.NumberFormat().format(engagementHistory.ligneCredit.montantAutorise)} {engagementHistory.ligneCredit.devise}</span>

                            <span className="font-medium text-muted-foreground">Bank:</span>
                            <span>{engagementHistory.ligneCredit.banque?.nom || 'N/A'}</span>

                            <span className="font-medium text-muted-foreground">Status:</span>
                            <Badge variant="secondary">{engagementHistory.ligneCredit.statut}</Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Workflow Template Info */}
            {template && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Workflow Template
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Name:</span>
                            <span>{template.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Code:</span>
                            <span className="font-mono">{template.code}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Total Steps:</span>
                            <span>{template.steps?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Completed:</span>
                            <span className="font-semibold text-green-600">{stepCompletions.length} / {template.steps?.length || 0}</span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>

        {/* Right Column - Audit Trail Timeline */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Audit Trail & Timeline
                </CardTitle>
                <CardDescription>Complete history of all actions and changes</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative space-y-4">
                    {/* Creation Event */}
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white">
                                <Database className="h-4 w-4" />
                            </div>
                            {(engagementHistory?.stepCompletions?.length > 0) && (
                                <div className="w-0.5 h-full bg-gray-300 dark:bg-slate-700 mt-2" />
                            )}
                        </div>
                        <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Engagement Created</h4>
                                <span className="text-xs text-muted-foreground">
                                    {engagement.createdAt ? new Date(engagement.createdAt).toLocaleString() : 'N/A'}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Initial engagement setup with reference {engagement.referenceDossier}
                            </p>
                        </div>
                    </div>

                    {/* Step Completion Events */}
                    {engagementHistory?.stepCompletions?.map((completion: any, index: number) => {
                        const isLast = index === engagementHistory.stepCompletions.length - 1 && engagement.statut !== 'REGLE';
                        return (
                            <div key={completion.id} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    {!isLast && (
                                        <div className="w-0.5 h-full bg-gray-300 dark:bg-slate-700 mt-2" />
                                    )}
                                </div>
                                <div className="flex-1 pb-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">Step Completed: {completion.workflowStep?.label}</h4>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(completion.completedAt).toLocaleString()}
                                        </span>
                                    </div>
                                    {completion.completedBy && (
                                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            By: {completion.completedBy}
                                        </p>
                                    )}
                                    {completion.fieldData && Object.keys(completion.fieldData).length > 0 && (
                                        <div className="mt-2 p-2 bg-gray-50 dark:bg-slate-900 rounded text-xs">
                                            <strong>Data Submitted:</strong>
                                            <ul className="mt-1 space-y-1">
                                                {Object.entries(completion.fieldData).map(([key, value]) => (
                                                    <li key={key}>
                                                        <span className="font-medium">{key}:</span> {String(value)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {completion.documents && completion.documents.length > 0 && (
                                        <div className="mt-2 text-xs">
                                            <strong>Documents:</strong> {completion.documents.length} file(s) uploaded
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Completion Event */}
                    {engagement.statut === 'REGLE' && (
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-green-600">Workflow Completed</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    All steps completed successfully
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
</TabsContent>
