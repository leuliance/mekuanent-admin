/*
 * Migration: Add USFM Content to Bible Chapters
 * Description: Adds a usfm_content JSONB column to bible_chapters for rich Bible text rendering
 * using USFM (Unified Standard Format Markers). NULL means fallback to verse-by-verse rendering.
 * Date: 2025-01-24
 */

ALTER TABLE public.bible_chapters
ADD COLUMN IF NOT EXISTS usfm_content JSONB DEFAULT NULL;

COMMENT ON COLUMN public.bible_chapters.usfm_content IS 'Multilingual USFM-formatted chapter content. Keys are locale codes (en, am, or, ti, so). NULL means use verse-by-verse fallback.';
