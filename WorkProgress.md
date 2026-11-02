# Login & Authentication Progress

## Completed
1. **Prisma Contract Schema (`contract.prisma`)**:
   - `Role` Enum: `USER`, `SALESMAN`, `ADMIN`.
   - `AuthProvider` Enum: `GOOGLE`, `GITHUB`, `EMAIL`.
   - Unified `User` model with optional password (for OAuth compatibility), default `EMAIL` provider, and self-relation `createdById` / `createdBy` / `createdUsers` to track which Admin created which account.
   - Removed obsolete placeholder models (`Post`).

2. **Universal Admin Bootstrap (Option B - Environment Seed)**:
   - Added `INITIAL_ADMIN_*` environment variables to `backend/.env` and `backend/.env.example`.
   - Created `backend/src/db/seed.ts` using Bun's native bcrypt password hashing (`Bun.password.hash`).
   - Added `"db:seed"` script to `backend/package.json`.