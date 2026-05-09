# Supabase setup for thrtythr.shop

## 1. Create database schema

Open Supabase Dashboard -> SQL Editor -> New query.

Paste and run the full SQL from:

```text
supabase/schema.sql
```

It creates:

- categories
- products
- product_images
- product_sizes
- customers
- orders
- order_items
- Storage bucket `products`
- public read policies for catalog/products/images
- seed data for the first products

## 2. Vercel Environment Variables

Add these variables in Vercel -> Project -> Settings -> Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=products
ADMIN_LOGIN=admin
ADMIN_PASSWORD=admin123
ADMIN_SESSION_SECRET=change-this-secret
```

Important: never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code. It is used only by server API routes.

## 3. Redeploy

After adding env variables, redeploy the project in Vercel.

## 4. Check

Open:

```text
/api/products
```

If Supabase is connected, products are loaded from Supabase. If not, the site falls back to local fallback products.

## 5. Admin

Open:

```text
/admin/login
```

Default credentials:

```text
admin
admin123
```

Admin features:

- add product
- edit product
- delete/archive product
- upload product images to Supabase Storage
- view orders
- change order/payment status
- export orders CSV
- view revenue chart
- view low stock products
- view top products
