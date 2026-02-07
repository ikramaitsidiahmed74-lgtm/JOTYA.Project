# Supabase Setup Guide

## ✅ Step 1: Create Tables in Supabase Dashboard

### Table 1: `support_messages`
```sql
create table support_messages (
  id bigint primary key generated always as identity,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);
```

**RLS Policy:**
```sql
-- Allow anyone to INSERT (public form submission)
create policy "public_insert_messages" on support_messages
  for insert with check (true);
```

---

### Table 2: `user_carts`
```sql
create table user_carts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  cart_items jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default now()
);
```

**RLS Policies:**
```sql
-- Allow users to READ/UPDATE their own cart
create policy "users_manage_own_cart" on user_carts
  for all using (auth.uid() = user_id);

-- Allow INSERT on own cart
create policy "users_insert_own_cart" on user_carts
  for insert with check (auth.uid() = user_id);
```

---

## ✅ Step 2: Enable Auth in Supabase Dashboard

1. Go to **Authentication → Providers**
2. Enable **Email** provider
3. (Optional) Enable other providers (Google, GitHub, etc.)

---

## ✅ Step 3: Integration in Angular

Service is already implemented in `src/app/services/supabase.ts`

### Usage in Components:

#### **Client Login (Auth Component)**
```typescript
import { SupabaseService } from '../services/supabase.service';

export class ClientLoginComponent {
  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async submit() {
    if (this.form.invalid) return;
    
    const { email, password } = this.form.value;
    const result = await this.supabaseService.signIn(email, password);
    
    if (result.success) {
      this.router.navigate(['/']); // Redirect to home or dashboard
    } else {
      this.feedbackMessage = result.error || 'Sign in failed';
    }
  }
}
```

#### **Client Register (Auth Component)**
```typescript
async submit() {
  if (this.form.invalid) return;
  
  const { email, password } = this.form.value;
  const result = await this.supabaseService.signUp(email, password);
  
  if (result.success) {
    alert('Check your email for verification');
    this.router.navigate(['/client-login']);
  } else {
    this.feedbackMessage = result.error || 'Sign up failed';
  }
}
```

#### **Support/Aide Component**
```typescript
import { SupabaseService } from '../services/supabase.service';

export class Aide {
  constructor(private supabaseService: SupabaseService) {}

  async submitMessage(email: string, message: string) {
    const result = await this.supabaseService.saveSupportMessage({ email, message });
    
    if (result.success) {
      alert('Message sent successfully');
    } else {
      alert('Error: ' + (result.error || 'Failed to send message'));
    }
  }
}
```

#### **Cart/Panier Component**
```typescript
export class Panier implements OnInit {
  constructor(
    private cartService: CartService,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    // Load cart from Supabase on init
    const { items } = await this.supabaseService.loadCart();
    items.forEach(item => this.cartService.addItem(item));
  }

  async confirmOrder() {
    // Save cart to Supabase before checkout
    const items = this.cartService.getSnapshot();
    await this.supabaseService.saveCart(items);
    // Proceed to checkout...
  }
}
```

---

## ✅ Notes

- Auth state is automatically tracked via `getCurrentUser()` Observable
- All methods return `{ success, error }` for consistent error handling
- Cart data stored as JSON for flexibility
- No breaking changes to existing components
- All Supabase logic isolated in the service
