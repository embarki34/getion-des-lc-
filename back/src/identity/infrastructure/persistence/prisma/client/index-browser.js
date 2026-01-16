
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.19.1
 * Query Engine version: 69d742ee20b815d88e17e54db4a2a7a3b30324e3
 */
Prisma.prismaVersion = {
  client: "5.19.1",
  engine: "69d742ee20b815d88e17e54db4a2a7a3b30324e3"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  password: 'password',
  role: 'role',
  status: 'status',
  emailVerified: 'emailVerified',
  emailVerifiedAt: 'emailVerifiedAt',
  failedLoginAttempts: 'failedLoginAttempts',
  lockedUntil: 'lockedUntil',
  lastLoginAt: 'lastLoginAt',
  companyId: 'companyId',
  businessUnitId: 'businessUnitId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BanqueScalarFieldEnum = {
  id: 'id',
  nom: 'nom',
  codeSwift: 'codeSwift',
  codeGuichet: 'codeGuichet',
  adresse: 'adresse',
  contactInfo: 'contactInfo',
  establishment: 'establishment',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BankAccountScalarFieldEnum = {
  id: 'id',
  accountNumber: 'accountNumber',
  keyAccount: 'keyAccount',
  currency: 'currency',
  rib: 'rib',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy',
  deletedBy: 'deletedBy',
  banqueId: 'banqueId'
};

exports.Prisma.LigneCreditScalarFieldEnum = {
  id: 'id',
  no: 'no',
  description: 'description',
  banqueId: 'banqueId',
  autorisationNo: 'autorisationNo',
  bankAccountNo: 'bankAccountNo',
  montantPlafond: 'montantPlafond',
  montantDevise: 'montantDevise',
  taux: 'taux',
  commitmentCommissionRate: 'commitmentCommissionRate',
  estimatedOutstanding: 'estimatedOutstanding',
  consumption: 'consumption',
  outstanding: 'outstanding',
  startDate: 'startDate',
  expiryDate: 'expiryDate',
  renewalDate: 'renewalDate',
  statut: 'statut',
  responsibilityCenter: 'responsibilityCenter',
  seuilAvanceSurStock: 'seuilAvanceSurStock',
  seuilAvanceSurFacture: 'seuilAvanceSurFacture',
  seuilEscompte: 'seuilEscompte',
  seuilLC: 'seuilLC',
  seuilObligtDouane: 'seuilObligtDouane',
  seuilCautionAdmin: 'seuilCautionAdmin',
  seuilDcvrtMobile: 'seuilDcvrtMobile',
  seuilTrsfrLibre: 'seuilTrsfrLibre',
  seuilLeasing: 'seuilLeasing',
  seuilCMT: 'seuilCMT',
  seuilFraisMission: 'seuilFraisMission',
  seuilLCAS: 'seuilLCAS',
  avanceSurStock: 'avanceSurStock',
  avanceFacture: 'avanceFacture',
  escompte: 'escompte',
  obligatDouane: 'obligatDouane',
  cautionAdmin: 'cautionAdmin',
  dcvrtMobile: 'dcvrtMobile',
  trsfrLibre: 'trsfrLibre',
  leasing: 'leasing',
  CMT: 'CMT',
  fraisMission: 'fraisMission',
  LCAS: 'LCAS',
  faciliteCaissier: 'faciliteCaissier',
  typeFinancement: 'typeFinancement',
  maxConsumptionTolerance: 'maxConsumptionTolerance',
  minConsumptionTolerance: 'minConsumptionTolerance',
  noSeries: 'noSeries',
  refinancing: 'refinancing',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GarantieScalarFieldEnum = {
  id: 'id',
  ligneCreditId: 'ligneCreditId',
  type: 'type',
  montant: 'montant',
  dateExpiration: 'dateExpiration',
  description: 'description',
  createdAt: 'createdAt'
};

exports.Prisma.EngagementScalarFieldEnum = {
  id: 'id',
  ligneCreditId: 'ligneCreditId',
  typeFinancement: 'typeFinancement',
  montant: 'montant',
  devise: 'devise',
  dateEngagement: 'dateEngagement',
  dateEcheance: 'dateEcheance',
  statut: 'statut',
  referenceDossier: 'referenceDossier',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  workflowTemplateId: 'workflowTemplateId',
  workflowStepId: 'workflowStepId',
  parentEngagementId: 'parentEngagementId'
};

exports.Prisma.SwiftMessageScalarFieldEnum = {
  id: 'id',
  type: 'type',
  content: 'content',
  referenceDossier: 'referenceDossier',
  dateGeneration: 'dateGeneration',
  statut: 'statut',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DocumentImportScalarFieldEnum = {
  id: 'id',
  type: 'type',
  nomFichier: 'nomFichier',
  cheminFichier: 'cheminFichier',
  dateUpload: 'dateUpload',
  metadata: 'metadata',
  referenceDossier: 'referenceDossier',
  createdAt: 'createdAt'
};

exports.Prisma.CompanyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  description: 'description',
  address: 'address',
  contactInfo: 'contactInfo',
  parentCompanyId: 'parentCompanyId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BusinessUnitScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  description: 'description',
  companyId: 'companyId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupplierScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  description: 'description',
  contactInfo: 'contactInfo',
  address: 'address',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CompanySupplierScalarFieldEnum = {
  id: 'id',
  companyId: 'companyId',
  supplierId: 'supplierId',
  createdAt: 'createdAt'
};

exports.Prisma.BusinessUnitSupplierScalarFieldEnum = {
  id: 'id',
  businessUnitId: 'businessUnitId',
  supplierId: 'supplierId',
  createdAt: 'createdAt'
};

exports.Prisma.CompanyBanqueScalarFieldEnum = {
  id: 'id',
  companyId: 'companyId',
  banqueId: 'banqueId',
  createdAt: 'createdAt'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  description: 'description',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  description: 'description',
  resource: 'resource',
  action: 'action',
  scope: 'scope',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  roleId: 'roleId',
  companyId: 'companyId',
  businessUnitId: 'businessUnitId',
  assignedAt: 'assignedAt',
  assignedBy: 'assignedBy'
};

exports.Prisma.RolePermissionScalarFieldEnum = {
  id: 'id',
  roleId: 'roleId',
  permissionId: 'permissionId',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  userId: 'userId',
  details: 'details',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.WorkflowTemplateScalarFieldEnum = {
  id: 'id',
  code: 'code',
  label: 'label',
  description: 'description',
  icon: 'icon',
  color: 'color',
  displayOrder: 'displayOrder',
  formSchema: 'formSchema',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WorkflowStepScalarFieldEnum = {
  id: 'id',
  templateId: 'templateId',
  stepOrder: 'stepOrder',
  code: 'code',
  label: 'label',
  description: 'description',
  requiredFields: 'requiredFields',
  requiredDocuments: 'requiredDocuments',
  requiresApproval: 'requiresApproval',
  approvalRoles: 'approvalRoles',
  triggerAction: 'triggerAction',
  icon: 'icon',
  color: 'color',
  allowedRoles: 'allowedRoles',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  user: 'user',
  Banque: 'Banque',
  BankAccount: 'BankAccount',
  LigneCredit: 'LigneCredit',
  Garantie: 'Garantie',
  Engagement: 'Engagement',
  SwiftMessage: 'SwiftMessage',
  DocumentImport: 'DocumentImport',
  Company: 'Company',
  BusinessUnit: 'BusinessUnit',
  Supplier: 'Supplier',
  CompanySupplier: 'CompanySupplier',
  BusinessUnitSupplier: 'BusinessUnitSupplier',
  CompanyBanque: 'CompanyBanque',
  Role: 'Role',
  Permission: 'Permission',
  UserRole: 'UserRole',
  RolePermission: 'RolePermission',
  AuditLog: 'AuditLog',
  WorkflowTemplate: 'WorkflowTemplate',
  WorkflowStep: 'WorkflowStep'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
