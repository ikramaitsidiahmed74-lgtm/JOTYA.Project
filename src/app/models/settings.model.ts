/**
 * Platform Settings Models
 * Configuration and settings management
 */

/**
 * Main platform settings
 */
export interface PlatformSettings {
  general: GeneralSettings;
  commission: CommissionSettings;
  payment: PaymentSettings;
  shipping: ShippingSettings;
  email: EmailSettings;
  maintenance: MaintenanceSettings;
  security: SecuritySettings;
}

/**
 * General platform settings
 */
export interface GeneralSettings {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  supportPhone: string;
  defaultLanguage: string;
  defaultCurrency: string;
  timezone: string;
}

/**
 * Commission settings
 */
export interface CommissionSettings {
  defaultCommissionRate: number; // Percentage (e.g., 10 for 10%)
  vendorCommissionRate: number;
  premiumVendorCommissionRate: number;
  minimumCommissionAmount: number;
}

/**
 * Payment gateway settings
 */
export interface PaymentSettings {
  enabledGateways: PaymentGateway[];
  defaultGateway: string;
  currency: string;
  minimumOrderAmount: number;
  maximumOrderAmount: number;
}

/**
 * Payment gateway configuration
 */
export interface PaymentGateway {
  id: string;
  name: string;
  enabled: boolean;
  testMode: boolean;
  credentials?: {
    apiKey?: string;
    secretKey?: string;
    merchantId?: string;
  };
}

/**
 * Shipping settings
 */
export interface ShippingSettings {
  enabledMethods: ShippingMethod[];
  defaultMethod: string;
  freeShippingThreshold: number;
  estimatedDeliveryDays: number;
}

/**
 * Shipping method
 */
export interface ShippingMethod {
  id: string;
  name: string;
  enabled: boolean;
  baseCost: number;
  costPerKg: number;
  estimatedDays: number;
}

/**
 * Email notification settings
 */
export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword?: string; // Encrypted
  fromEmail: string;
  fromName: string;
  notifications: EmailNotificationSettings;
}

/**
 * Email notification toggles
 */
export interface EmailNotificationSettings {
  orderPlaced: boolean;
  orderShipped: boolean;
  orderDelivered: boolean;
  orderCancelled: boolean;
  productApproved: boolean;
  productRejected: boolean;
  newUserRegistration: boolean;
  lowStockAlert: boolean;
}

/**
 * Maintenance mode settings
 */
export interface MaintenanceSettings {
  enabled: boolean;
  message: string;
  allowedIPs: string[];
  estimatedEndTime?: Date;
}

/**
 * Security settings
 */
export interface SecuritySettings {
  twoFactorAuthEnabled: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number; // Minutes
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecialChars: boolean;
}

/**
 * Role permissions
 */
export interface RolePermissions {
  roleId: string;
  roleName: string;
  permissions: Permission[];
}

/**
 * Individual permission
 */
export interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'users' | 'products' | 'orders' | 'payments' | 'settings';
}

/**
 * Settings update request
 */
export interface SettingsUpdateRequest {
  section: keyof PlatformSettings;
  data: any;
}

/**
 * Backup settings
 */
export interface BackupSettings {
  autoBackupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  lastBackupDate?: Date;
}
