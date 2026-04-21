-- ============================================================
-- Vita Santé — fix seed passwords
-- Earlier 00004_seed.sql stored plaintext 'dev-password' for demo
-- accounts. That migration was later updated to use a bcrypt hash,
-- but ON CONFLICT (id) DO NOTHING prevented existing rows from
-- being updated. Meanwhile src/lib/auth.ts dropped its plaintext
-- fallback — so any account with a plaintext password_hash now
-- fails to authenticate.
--
-- This migration upgrades any demo accounts whose password_hash is
-- not a bcrypt hash (doesn't start with "$2") to the canonical
-- bcrypt hash of "dev-password".
--
-- Idempotent: re-running does nothing on already-hashed rows.
-- ============================================================

UPDATE public.users
SET password_hash = '$2b$12$/7bQG5xILe191Qa4uGTiK.p5Wf5Y5PqGgL6DW2l00DCWzv98u08ES'
WHERE password_hash IS NULL
   OR password_hash = ''
   OR password_hash NOT LIKE '$2%';
