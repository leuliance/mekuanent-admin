/*
 * Migration: Create Enums and Custom Types
 * Description: Defines all enum types used across the Mekuannent application
 * Author: System
 * Date: 2024-12-01
 */

-- Church status enum for registration workflow
create type public.church_status as enum (
  'pending',
  'approved',
  'rejected',
  'suspended'
);
comment on type public.church_status is 'Status of church registration and verification';

-- User role enum for role-based access control
create type public.user_role as enum (
  'super_admin',
  'church_admin',
  'content_admin',
  'content_creator',
  'user'
);
comment on type public.user_role is 'Roles that can be assigned to users per church';

-- Content type enum for polymorphic content management
create type public.content_type as enum (
  'audio',
  'video',
  'room',
  'article',
  'story'
);
comment on type public.content_type is 'Types of content that can be created';

-- Content status enum for approval workflow
create type public.content_status as enum (
  'draft',
  'pending_approval',
  'approved',
  'rejected',
  'archived'
);
comment on type public.content_status is 'Status of content in approval workflow';

-- Event status enum for event lifecycle
create type public.event_status as enum (
  'draft',
  'published',
  'cancelled',
  'completed'
);
comment on type public.event_status is 'Current status of an event';

-- RSVP status enum for event attendance
create type public.rsvp_status as enum (
  'going',
  'maybe',
  'not_going'
);
comment on type public.rsvp_status is 'User response to event invitation';

-- Donation campaign status enum
create type public.campaign_status as enum (
  'draft',
  'active',
  'paused',
  'completed',
  'cancelled'
);
comment on type public.campaign_status is 'Status of donation campaign';

-- Donation status enum for payment tracking
create type public.donation_status as enum (
  'pending',
  'completed',
  'failed',
  'refunded'
);
comment on type public.donation_status is 'Status of individual donation transaction';

-- Invitation status enum for role invitations
create type public.invitation_status as enum (
  'pending',
  'accepted',
  'declined',
  'expired'
);
comment on type public.invitation_status is 'Status of role invitation';

-- Room status enum for live audio rooms
create type public.room_status as enum (
  'scheduled',
  'live',
  'ended',
  'cancelled'
);
comment on type public.room_status is 'Current status of audio room';

-- Room participant role enum
create type public.room_participant_role as enum (
  'host',
  'speaker',
  'listener'
);
comment on type public.room_participant_role is 'Role of participant in audio room';

-- Notification type enum
create type public.notification_type as enum (
  'verse_of_day',
  'new_content',
  'event_reminder',
  'event_update',
  'donation_received',
  'role_invitation',
  'content_approved',
  'content_rejected',
  'room_started'
);
comment on type public.notification_type is 'Type of notification sent to users';

-- Feature flag scope enum
create type public.feature_flag_scope as enum (
  'global',
  'church'
);
comment on type public.feature_flag_scope is 'Scope of feature flag application';

-- Event co-host status enum
create type public.event_co_host_status as enum (
  'pending',
  'accepted',
  'declined'
);
comment on type public.event_co_host_status is 'Status of event co-host invitation';

-- Wallet transaction type enum
create type public.wallet_transaction_type as enum (
  'deposit',
  'withdrawal',
  'refund',
  'donation'
);
comment on type public.wallet_transaction_type is 'Type of wallet transaction';

-- Wallet transaction status enum
create type public.wallet_transaction_status as enum (
  'pending',
  'completed',
  'failed',
  'cancelled'
);
comment on type public.wallet_transaction_status is 'Status of wallet transaction';

