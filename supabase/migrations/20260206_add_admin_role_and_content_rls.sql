-- ============================================================
-- Migration 1: Add 'admin' to user_role enum
-- ============================================================
-- This must be committed separately before using the new value.

ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'admin' AFTER 'super_admin';
