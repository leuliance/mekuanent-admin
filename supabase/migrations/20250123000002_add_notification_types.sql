/*
 * Migration: Add New Notification Types
 * Description: Adds additional notification type enum values
 * Note: Each ALTER TYPE ADD VALUE must be in its own statement
 * Author: System
 * Date: 2025-01-23
 */

-- Add new notification types (these are idempotent with IF NOT EXISTS)
DO $$
BEGIN
    -- Check if enum value exists before adding
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'donation_campaign_update' AND enumtypid = 'public.notification_type'::regtype) THEN
        ALTER TYPE public.notification_type ADD VALUE 'donation_campaign_update';
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'prayer_request' AND enumtypid = 'public.notification_type'::regtype) THEN
        ALTER TYPE public.notification_type ADD VALUE 'prayer_request';
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'church_announcement' AND enumtypid = 'public.notification_type'::regtype) THEN
        ALTER TYPE public.notification_type ADD VALUE 'church_announcement';
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'system_message' AND enumtypid = 'public.notification_type'::regtype) THEN
        ALTER TYPE public.notification_type ADD VALUE 'system_message';
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'achievement' AND enumtypid = 'public.notification_type'::regtype) THEN
        ALTER TYPE public.notification_type ADD VALUE 'achievement';
    END IF;
END$$;
