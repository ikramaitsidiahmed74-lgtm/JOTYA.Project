import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { 
  PlatformSettings, 
  GeneralSettings,
  CommissionSettings,
  PaymentSettings,
  ShippingSettings,
  EmailSettings,
  MaintenanceSettings,
  SecuritySettings,
  RolePermissions,
  SettingsUpdateRequest,
  BackupSettings
} from '../models/settings.model';

/**
 * SettingsService - Platform configuration management
 * 
 * Features:
 * - Load/save platform settings
 * - Manage commission rates
 * - Configure payment gateways
 * - Email settings
 * - Maintenance mode
 * - Role & permissions management
 * - Backup & restore
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/settings';

  // Reactive state for platform settings
  private settingsSubject = new BehaviorSubject<PlatformSettings | null>(null);
  public settings$ = this.settingsSubject.asObservable();

  // Reactive state for maintenance mode (frequently checked)
  private maintenanceModeSubject = new BehaviorSubject<boolean>(false);
  public maintenanceMode$ = this.maintenanceModeSubject.asObservable();

  /**
   * Load all platform settings
   */
  loadSettings(): Observable<PlatformSettings> {
    return this.http.get<PlatformSettings>(`${this.API_URL}`).pipe(
      tap(settings => {
        this.settingsSubject.next(settings);
        this.maintenanceModeSubject.next(settings.maintenance.enabled);
      }),
      shareReplay(1)
    );
  }

  /**
   * Update specific settings section
   */
  updateSettings(request: SettingsUpdateRequest): Observable<PlatformSettings> {
    return this.http.put<PlatformSettings>(`${this.API_URL}/${request.section}`, request.data).pipe(
      tap(settings => {
        this.settingsSubject.next(settings);
      })
    );
  }

  /**
   * Get general settings
   */
  getGeneralSettings(): Observable<GeneralSettings> {
    return this.http.get<GeneralSettings>(`${this.API_URL}/general`);
  }

  /**
   * Update general settings
   */
  updateGeneralSettings(settings: GeneralSettings): Observable<GeneralSettings> {
    return this.http.put<GeneralSettings>(`${this.API_URL}/general`, settings);
  }

  /**
   * Get commission settings
   */
  getCommissionSettings(): Observable<CommissionSettings> {
    return this.http.get<CommissionSettings>(`${this.API_URL}/commission`);
  }

  /**
   * Update commission settings
   */
  updateCommissionSettings(settings: CommissionSettings): Observable<CommissionSettings> {
    return this.http.put<CommissionSettings>(`${this.API_URL}/commission`, settings).pipe(
      tap(() => {
        // Refresh full settings
        this.loadSettings().subscribe();
      })
    );
  }

  /**
   * Get payment settings
   */
  getPaymentSettings(): Observable<PaymentSettings> {
    return this.http.get<PaymentSettings>(`${this.API_URL}/payment`);
  }

  /**
   * Update payment settings
   */
  updatePaymentSettings(settings: PaymentSettings): Observable<PaymentSettings> {
    return this.http.put<PaymentSettings>(`${this.API_URL}/payment`, settings);
  }

  /**
   * Toggle payment gateway
   */
  togglePaymentGateway(gatewayId: string, enabled: boolean): Observable<PaymentSettings> {
    return this.http.patch<PaymentSettings>(`${this.API_URL}/payment/gateway/${gatewayId}`, { enabled });
  }

  /**
   * Get shipping settings
   */
  getShippingSettings(): Observable<ShippingSettings> {
    return this.http.get<ShippingSettings>(`${this.API_URL}/shipping`);
  }

  /**
   * Update shipping settings
   */
  updateShippingSettings(settings: ShippingSettings): Observable<ShippingSettings> {
    return this.http.put<ShippingSettings>(`${this.API_URL}/shipping`, settings);
  }

  /**
   * Get email settings
   */
  getEmailSettings(): Observable<EmailSettings> {
    return this.http.get<EmailSettings>(`${this.API_URL}/email`);
  }

  /**
   * Update email settings
   */
  updateEmailSettings(settings: EmailSettings): Observable<EmailSettings> {
    return this.http.put<EmailSettings>(`${this.API_URL}/email`, settings);
  }

  /**
   * Test email configuration
   */
  testEmailConnection(testEmail: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<any>(`${this.API_URL}/email/test`, { testEmail });
  }

  /**
   * Get maintenance settings
   */
  getMaintenanceSettings(): Observable<MaintenanceSettings> {
    return this.http.get<MaintenanceSettings>(`${this.API_URL}/maintenance`);
  }

  /**
   * Enable maintenance mode
   */
  enableMaintenanceMode(message: string, estimatedEndTime?: Date): Observable<MaintenanceSettings> {
    return this.http.post<MaintenanceSettings>(`${this.API_URL}/maintenance/enable`, {
      message,
      estimatedEndTime
    }).pipe(
      tap(() => {
        this.maintenanceModeSubject.next(true);
      })
    );
  }

  /**
   * Disable maintenance mode
   */
  disableMaintenanceMode(): Observable<MaintenanceSettings> {
    return this.http.post<MaintenanceSettings>(`${this.API_URL}/maintenance/disable`, {}).pipe(
      tap(() => {
        this.maintenanceModeSubject.next(false);
      })
    );
  }

  /**
   * Get security settings
   */
  getSecuritySettings(): Observable<SecuritySettings> {
    return this.http.get<SecuritySettings>(`${this.API_URL}/security`);
  }

  /**
   * Update security settings
   */
  updateSecuritySettings(settings: SecuritySettings): Observable<SecuritySettings> {
    return this.http.put<SecuritySettings>(`${this.API_URL}/security`, settings);
  }

  /**
   * Get all role permissions
   */
  getRolePermissions(): Observable<RolePermissions[]> {
    return this.http.get<RolePermissions[]>(`${this.API_URL}/roles`);
  }

  /**
   * Update role permissions
   */
  updateRolePermissions(roleId: string, permissions: string[]): Observable<RolePermissions> {
    return this.http.put<RolePermissions>(`${this.API_URL}/roles/${roleId}`, { permissions });
  }

  /**
   * Create new role
   */
  createRole(roleName: string, permissions: string[]): Observable<RolePermissions> {
    return this.http.post<RolePermissions>(`${this.API_URL}/roles`, { roleName, permissions });
  }

  /**
   * Delete role
   */
  deleteRole(roleId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/roles/${roleId}`);
  }

  /**
   * Get backup settings
   */
  getBackupSettings(): Observable<BackupSettings> {
    return this.http.get<BackupSettings>(`${this.API_URL}/backup`);
  }

  /**
   * Create manual backup
   */
  createBackup(): Observable<{ success: boolean; backupId: string }> {
    return this.http.post<any>(`${this.API_URL}/backup/create`, {});
  }

  /**
   * Restore from backup
   */
  restoreBackup(backupId: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<any>(`${this.API_URL}/backup/restore`, { backupId });
  }

  /**
   * Export settings to JSON
   */
  exportSettings(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/export`, {
      responseType: 'blob'
    });
  }

  /**
   * Import settings from JSON file
   */
  importSettings(file: File): Observable<PlatformSettings> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<PlatformSettings>(`${this.API_URL}/import`, formData).pipe(
      tap(settings => {
        this.settingsSubject.next(settings);
      })
    );
  }

  /**
   * Clear cached settings
   */
  clearState(): void {
    this.settingsSubject.next(null);
    this.maintenanceModeSubject.next(false);
  }
}
