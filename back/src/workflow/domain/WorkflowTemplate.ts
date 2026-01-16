/**
 * WorkflowTemplate Domain Entity
 * Represents a configurable financial instrument template (LC, AS, AF, RD, CMT)
 */

export interface FormFieldSchema {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'boolean' | 'relation' | 'file';
    label: string;
    required: boolean;
    options?: string[];
    defaultValue?: any;
    min?: number;
    max?: number;
    step?: number;
    relationTo?: string;
    helpText?: string;
}

export interface FormSchema {
    fields: FormFieldSchema[];
}

export class WorkflowTemplate {
    constructor(
        public id: string,
        public code: string,
        public label: string,
        public description: string | null,
        public icon: string | null,
        public color: string | null,
        public displayOrder: number,
        public formSchema: FormSchema | null,
        public isActive: boolean,
        public steps: WorkflowStep[],
        public createdAt: Date,
        public updatedAt: Date
    ) { }

    static create(
        id: string,
        code: string,
        label: string,
        description?: string,
        formSchema?: FormSchema
    ): WorkflowTemplate {
        return new WorkflowTemplate(
            id,
            code,
            label,
            description || null,
            null, // icon
            null, // color
            0, // displayOrder
            formSchema || null,
            true, // isActive
            [],
            new Date(),
            new Date()
        );
    }

    getFieldByName(fieldName: string): FormFieldSchema | undefined {
        return this.formSchema?.fields.find(f => f.name === fieldName);
    }

    getRequiredFields(): string[] {
        return this.formSchema?.fields
            .filter(f => f.required)
            .map(f => f.name) || [];
    }
}

export class WorkflowStep {
    constructor(
        public id: string,
        public templateId: string,
        public stepOrder: number,
        public code: string,
        public label: string,
        public description: string | null,
        public requiredFields: string[] | null,
        public requiredDocuments: string[] | null,
        public requiresApproval: boolean,
        public approvalRoles: string[] | null,
        public triggerAction: string | null,
        public icon: string | null,
        public color: string | null,
        public allowedRoles: string[] | null,
        public createdAt: Date,
        public updatedAt: Date
    ) { }

    canUserWorkOnStep(userRoles: string[]): boolean {
        if (!this.allowedRoles || this.allowedRoles.length === 0) {
            return true; // No restriction
        }
        return userRoles.some(role => this.allowedRoles!.includes(role));
    }

    canUserApprove(userRoles: string[]): boolean {
        if (!this.requiresApproval || !this.approvalRoles) {
            return false;
        }
        return userRoles.some(role => this.approvalRoles!.includes(role));
    }
}
