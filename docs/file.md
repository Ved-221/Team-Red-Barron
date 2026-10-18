# Supabase and Admin Panel Technical Architecture

This document outlines the current technical implementation of how the Team Red Barron website interacts with Supabase and the Admin Panel.

## 1. Supabase Integration

The project uses `@supabase/ssr` to ensure secure and seamless authentication and data fetching across both Server Components and Client Components in Next.js.

### Core Clients
*   **Server Client (`src/lib/supabase/server.ts`)**: 
    *   Used in Server Actions, Server Components, and API Routes.
    *   Utilizes Next.js `cookies()` from `next/headers` to automatically read and write auth cookies for the session.
*   **Browser Client (`src/lib/supabase/client.ts`)**:
    *   Used in interactive Client Components where browser APIs are available.

## 2. Admin Panel Architecture (`src/app/admin`)

The Admin Panel is isolated under the `(protected)` route group, leveraging Next.js App Router features for security and data mutation.

### Authentication Flow
*   **Route Protection**: The `src/app/admin/(protected)/layout.tsx` file intercepts all requests to the admin panel. It checks the user's session using `supabase.auth.getUser()`. 
*   **Redirection**: If no valid session is found, the user is immediately redirected to `/admin/login`.

### Data Mutation (Server Actions)
Instead of traditional API routes (`/api/...`), the application uses **Next.js Server Actions** (e.g., `src/app/admin/(protected)/team/actions.ts`) for data mutation.
*   **Direct DB Access**: Forms in the admin panel submit FormData directly to these async server functions.
*   **CRUD Operations**: The actions instantiate the Supabase server client and interact directly with the database tables (e.g., `supabase.from("team_members").insert(...)`).
*   **Cache Invalidation**: After a successful mutation, the actions call `revalidatePath(...)` to immediately purge Next.js cache and reflect changes on both the admin UI and the public website.

### 3. Data & Storage Patterns

*   **Soft Deletions**: Deleting items (like team members or timeline vehicles) typically employs a "soft delete" pattern. Instead of removing the row, a `deleted_at` timestamp and a `deleted_batch_id` are set. This allows the `/admin/trash` route to function for potential data recovery.
*   **Image Handling**: Images uploaded through the admin panel are processed via helper functions (`src/lib/upload.ts`). These functions likely handle uploading binary data to Supabase Storage, and the resulting public URL string is what gets saved to the PostgreSQL database records. Existing images are deleted from storage when replaced or explicitly removed, except during soft deletions where the asset is preserved.
