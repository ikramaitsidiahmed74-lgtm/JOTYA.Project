import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environment/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SupportMessage {
  email: string;
  message: string;
  created_at?: string;
}

export interface CartData {
  user_id: string;
  cart_items: any[];
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private user$ = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
    this.initAuthStateListener();
  }

  private initAuthStateListener(): void {
    this.supabase.auth.onAuthStateChange((_, session) => {
      this.user$.next(session?.user || null);
    });
  }

  // ===== AUTH METHODS =====
  async signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.signUp({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.user$.asObservable();
  }

  async getAuthenticatedUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user || null;
  }

  // ===== SUPPORT MESSAGE METHODS =====
  async saveSupportMessage(message: SupportMessage): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('support_messages')
        .insert([
          {
            email: message.email,
            message: message.message,
            created_at: new Date().toISOString(),
          },
        ]);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // ===== CART METHODS =====
  async saveCart(cartItems: any[]): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await this.getAuthenticatedUser();
      if (!user) return { success: false, error: 'User not authenticated' };

      const { error } = await this.supabase
        .from('user_carts')
        .upsert(
          [
            {
              user_id: user.id,
              cart_items: cartItems,
              updated_at: new Date().toISOString(),
            },
          ],
          { onConflict: 'user_id' }
        );

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async loadCart(): Promise<{ items: any[]; error?: string }> {
    try {
      const user = await this.getAuthenticatedUser();
      if (!user) return { items: [], error: 'User not authenticated' };

      const { data, error } = await this.supabase
        .from('user_carts')
        .select('cart_items')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        return { items: [], error: error.message };
      }

      return { items: data?.cart_items || [] };
    } catch (err: any) {
      return { items: [], error: err.message };
    }
  }

  get client() {
    return this.supabase;
  }
}
