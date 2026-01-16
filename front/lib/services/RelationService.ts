import { BanksService } from './banks.service';
import { CompaniesService } from './companies.service';
import { SuppliersService } from './suppliers.service';
import { CreditLinesService } from './credit-lines.service';

export interface SelectOption {
    value: string;
    label: string;
}

/**
 * RelationService
 * Centralizes fetching of relational data for dynamic forms
 * Supports entity types: banks, companies, suppliers, creditLines
 */
export class RelationService {
    private static cache: Map<string, { data: SelectOption[], timestamp: number }> = new Map();
    private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    /**
     * Fetch dropdown options for a specific entity type
     */
    static async fetchOptions(entityType: string): Promise<SelectOption[]> {
        // Check cache first
        const cached = this.cache.get(entityType);
        if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
            return cached.data;
        }

        let options: SelectOption[] = [];

        try {
            switch (entityType.toLowerCase()) {
                case 'banks':
                case 'bank':
                    options = await this.fetchBanks();
                    break;

                case 'companies':
                case 'company':
                    options = await this.fetchCompanies();
                    break;

                case 'suppliers':
                case 'supplier':
                    options = await this.fetchSuppliers();
                    break;

                case 'creditlines':
                case 'credit-lines':
                case 'creditline':
                    options = await this.fetchCreditLines();
                    break;

                default:
                    console.warn(`Unknown entity type: ${entityType}`);
                    return [];
            }

            // Cache the results
            this.cache.set(entityType, {
                data: options,
                timestamp: Date.now()
            });

            return options;
        } catch (error) {
            console.error(`Error fetching ${entityType}:`, error);
            return [];
        }
    }

    /**
     * Clear cache for a specific entity type or all entities
     */
    static clearCache(entityType?: string) {
        if (entityType) {
            this.cache.delete(entityType);
        } else {
            this.cache.clear();
        }
    }

    private static async fetchBanks(): Promise<SelectOption[]> {
        try {
            console.log('[RelationService] Fetching banks...');
            const banks = await BanksService.getBanks();
            console.log('[RelationService] Banks received:', banks);
            const options = banks.map(bank => ({
                value: bank.id,
                label: `${bank.nomBanque} (${bank.codeBic})` || bank.nomBanque || bank.codeBic
            }));
            console.log('[RelationService] Banks options:', options);
            return options;
        } catch (error) {
            console.error('[RelationService] Error fetching banks:', error);
            return [];
        }
    }

    private static async fetchCompanies(): Promise<SelectOption[]> {
        const companies = await CompaniesService.getCompanies();
        return companies.map(company => ({
            value: company.id,
            label: company.name || company.code || company.id
        }));
    }

    private static async fetchSuppliers(): Promise<SelectOption[]> {
        const suppliers = await SuppliersService.getSuppliers();
        return suppliers.map(supplier => ({
            value: supplier.id,
            label: supplier.name || supplier.code || supplier.id
        }));
    }

    private static async fetchCreditLines(): Promise<SelectOption[]> {
        const creditLines = await CreditLinesService.getCreditLines();
        return creditLines.map(line => ({
            value: line.id,
            label: `${line.typeFinancement} - ${line.montantPlafond?.toLocaleString()} ${line.montantDevise}` || line.id
        }));
    }
}
