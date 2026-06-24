/*
 * Migration: add 'short' content type
 * Description: Introduces a dedicated `short` value on the content_type enum
 *              for TikTok-style short videos. Long-form videos keep
 *              content_type = 'video' (mini-player / albums surface), shorts
 *              use content_type = 'short' (vertical full-screen feed). Both
 *              reuse the existing `video_content` child table.
 *
 *              NOTE: a newly added enum value cannot be USED in the same
 *              transaction it is added in, so the data move + feed changes
 *              live in the next migration (20260620000002_*).
 *
 * date: 2026-06-20
 */

ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'short';
