-- Migration: Add church category
-- Description: Adds church_category enum type and column to churches table
-- Author: System
-- Date: 2024-12-30

-- Create church_category enum type
CREATE TYPE public.church_category AS ENUM ('church', 'monastery', 'female-monastery');

-- Add category column to churches table with default 'church'
ALTER TABLE public.churches 
ADD COLUMN category public.church_category NOT NULL DEFAULT 'church';

-- Add comment
COMMENT ON COLUMN public.churches.category IS 'Type of religious institution: church, monastery, or female-monastery';

-- Create index for faster filtering by category
CREATE INDEX idx_churches_category ON public.churches(category);
