/*
 * migration: populate test data
 * description: 
 *   adds church_admin role to user and populates all tables with comprehensive test data
 *   creates two churches: saint mary church and bole medhanialem church
 * author: system
 * date: 2024-12-01
 */

DO $$
DECLARE
  church_saint_mary_id uuid;
  church_bole_id uuid;
  bank_saint_mary_id uuid;
  bank_bole_id uuid;
  event_cat_service_id uuid;
  event_cat_festival_id uuid;
  event_cat_wedding_id uuid;
  event_cat_conference_id uuid;
  donation_cat_building_id uuid;
  donation_cat_food_id uuid;
  donation_cat_health_id uuid;
  event_sunday_id uuid;
  event_christmas_id uuid;
  campaign_building_id uuid;
  campaign_food_id uuid;
  article_content_id uuid;
  video_content_id uuid;
  region_addis_id uuid;
  subcity_bole_id uuid;
BEGIN
  -- ============================================================================
  -- step 0: get region and subcity ids
  -- ============================================================================
  select id into region_addis_id
  from public.region_categories
  where slug = 'addis-ababa'
  limit 1;
  
  select id into subcity_bole_id
  from public.subcities
  where slug = 'bole' and region_id = region_addis_id
  limit 1;
  -- ============================================================================
  -- step 1: create churches
  -- ============================================================================

  -- saint mary church (kidiste kidusan mariyam)
  insert into public.churches (
    name,
    description,
    phone_number,
    email,
    website,
    address,
    city,
    state,
    country,
    coordinates,
    logo_url,
    cover_image_url,
    category,
    status,
    verified_at,
    verified_by,
    region_id,
    subcity_id,
    founded_year,
    created_at,
    updated_at
  ) values (
    '{"am": "ቅድስት ቅዱሳን ማርያም ቤተክርስቲያን", "en": "Saint Mary Church"}',
    '{"am": "ቅድስት ቅዱሳን ማርያም ቤተክርስቲያን በአዲስ አበባ ከተማ ውስጥ የሚገኝ ታሪካዊ የኢትዮጵያ ኦርቶዶክስ ቤተክርስቲያን ነው።", "en": "Saint Mary Church (Kidiste Kidusan Mariyam) is a historic Ethiopian Orthodox church located in Addis Ababa."}',
    '+251911234567',
    'saintmary@example.com',
    'https://saintmary.example.com',
    '{"am": "አዲስ አበባ፣ ኢትዮጵያ", "en": "Addis Ababa, Ethiopia"}',
    '{"am": "አዲስ አበባ", "en": "Addis Ababa"}',
    '{"am": "አዲስ አበባ", "en": "Addis Ababa"}',
    '{"am": "ኢትዮጵያ", "en": "Ethiopia"}',
    ST_SetSRID(ST_MakePoint(38.762119, 9.037301), 4326)::geography,
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/saint-mary.jpg',
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    'church',
    'approved',
    now(),
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    region_addis_id,
    subcity_bole_id,
    1950,
    now(),
    now()
  ) returning id into church_saint_mary_id;

  -- bole medhanialem church
  insert into public.churches (
    name,
    description,
    phone_number,
    email,
    website,
    address,
    city,
    state,
    country,
    coordinates,
    logo_url,
    cover_image_url,
    category,
    status,
    verified_at,
    verified_by,
    region_id,
    subcity_id,
    founded_year,
    created_at,
    updated_at
  ) values (
    '{"am": "ቦሌ መድኃኒዓለም ቤተክርስቲያን", "en": "Bole Medhanialem Church"}',
    '{"am": "ቦሌ መድኃኒዓለም ቤተክርስቲያን በቦሌ አካባቢ የሚገኝ ታዋቂ የኢትዮጵያ ኦርቶዶክስ ቤተክርስቲያን ነው።", "en": "Bole Medhanialem Church is a famous Ethiopian Orthodox church located in the Bole area."}',
    '+251922345678',
    'bolemedhanialem@example.com',
    'https://bolemedhanialem.example.com',
    '{"am": "ቦሌ፣ አዲስ አበባ፣ ኢትዮጵያ", "en": "Bole, Addis Ababa, Ethiopia"}',
    '{"am": "አዲስ አበባ", "en": "Addis Ababa"}',
    '{"am": "አዲስ አበባ", "en": "Addis Ababa"}',
    '{"am": "ኢትዮጵያ", "en": "Ethiopia"}',
    ST_SetSRID(ST_MakePoint(38.789865, 8.995923), 4326)::geography,
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/bole-medhanialem.jpeg',
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    'monastery',
    'approved',
    now(),
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    region_addis_id,
    subcity_bole_id,
    1985,
    now(),
    now()
  ) returning id into church_bole_id;

  -- ============================================================================
  -- step 2: add church_admin role to user for saint mary church
  -- ============================================================================
  
  -- insert church_admin role with church_id (required by constraint)
  insert into public.user_roles (user_id, role, church_id, assigned_at)
  values (
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    'church_admin',
    church_saint_mary_id,
    now()
  )
  on conflict (user_id, church_id, role) do nothing;

  -- ============================================================================
  -- step 3: create church images
  -- ============================================================================

  -- images for saint mary church
  insert into public.church_images (
    church_id,
    image_url,
    display_order,
    created_at,
    updated_at
  ) VALUES
  (
    church_saint_mary_id,
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/saint-mary.jpg',
    0,
    now(),
    now()
  ),
  (
    church_saint_mary_id,
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    1,
    now(),
    now()
  ),
  (
    church_saint_mary_id,
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    2,
    now(),
    now()
  );

  -- images for bole medhanialem church
  insert into public.church_images (
    church_id,
    image_url,
    display_order,
    created_at,
    updated_at
  ) VALUES
  (
    church_bole_id,
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/bole-medhanialem.jpeg',
    0,
    now(),
    now()
  ),
  (
    church_bole_id,
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    1,
    now(),
    now()
  ),
  (
    church_bole_id,
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    2,
    now(),
    now()
  );

  -- ============================================================================
  -- step 4: Create Bank Accounts
  -- ============================================================================

  -- Bank account for Saint Mary Church
  insert into public.bank_accounts (
    church_id,
    bank_name,
    account_number,
    account_holder_name,
    branch_name,
    swift_code,
    is_primary,
    is_active,
    created_at,
    updated_at
  ) values (
    church_saint_mary_id,
    '{"am": "ንግድ ባንክ", "en": "Commercial Bank of Ethiopia"}',
    '1234567890',
    'Saint Mary Church',
    'Bole Branch',
    'CBETETAA',
    true,
    true,
    now(),
    now()
  ) returning id into bank_saint_mary_id;

  -- Bank account for Bole Medhanialem Church
  insert into public.bank_accounts (
    church_id,
    bank_name,
    account_number,
    account_holder_name,
    branch_name,
    swift_code,
    is_primary,
    is_active,
    created_at,
    updated_at
  ) values (
    church_bole_id,
    '{"am": "ንግድ ባንክ", "en": "Commercial Bank of Ethiopia"}',
    '0987654321',
    'Bole Medhanialem Church',
    'Bole Branch',
    'CBETETAA',
    true,
    true,
    now(),
    now()
  ) returning id into bank_bole_id;

  -- ============================================================================
  -- step 4: Create Event Categories
  -- ============================================================================

  -- Event categories for Saint Mary Church
  insert into public.event_categories (
    name,
    description,
    icon,
    color,
    created_at,
    updated_at
  ) VALUES
  (
    '{"am": "መደብ", "en": "Service"}',
    '{"am": "የአመሰግናት መደብ", "en": "Church service"}',
    'church',
    '#4CAF50',
    now(),
    now()
  ),
  (
    '{"am": "ፌስቲቫል", "en": "Festival"}',
    '{"am": "የቤተክርስቲያን ፌስቲቫል", "en": "Church festival"}',
    'celebration',
    '#FF9800',
    now(),
    now()
  ),
  (
    '{"am": "የጋብቻ", "en": "Wedding"}',
    '{"am": "የጋብቻ ስነስርአት", "en": "Wedding ceremony"}',
    'wedding',
    '#E91E63',
    now(),
    now()
  );

  -- get the ids properly
  select id into event_cat_service_id from public.event_categories where name->>'en' = 'Service' order by created_at desc limit 1;
  select id into event_cat_festival_id from public.event_categories where name->>'en' = 'Festival' order by created_at desc limit 1;
  select id into event_cat_wedding_id from public.event_categories where name->>'en' = 'Wedding' order by created_at desc limit 1;

  -- Event categories for Bole Medhanialem Church
  insert into public.event_categories (
    name,
    description,
    icon,
    color,
    created_at,
    updated_at
  ) VALUES
  (
    '{"am": "መደብ", "en": "Service"}',
    '{"am": "የአመሰግናት መደብ", "en": "Church service"}',
    'church',
    '#4CAF50',
    now(),
    now()
  ),
  (
    '{"am": "የምክክር", "en": "Conference"}',
    '{"am": "የምክክር ስብሰባ", "en": "Conference meeting"}',
    'conference',
    '#2196F3',
    now(),
    now()
  );

  select id into event_cat_conference_id from public.event_categories where name->>'en' = 'Conference' order by created_at DESC limit 1;

  -- ============================================================================
  -- step 6: Create Donation Categories
  -- ============================================================================

  insert into public.donation_categories (
    name,
    description,
    icon,
    color,
    created_at,
    updated_at
  ) VALUES
  (
    '{"am": "የቤተክርስቲያን ግንባታ", "en": "Church Building"}',
    '{"am": "የቤተክርስቲያን ግንባታ ለመደገፍ", "en": "Support church building"}',
    'building',
    '#9C27B0',
    now(),
    now()
  ),
  (
    '{"am": "የምግብ", "en": "Food"}',
    '{"am": "ለድሆች የምግብ ድጎማ", "en": "Food support for the needy"}',
    'food',
    '#FF5722',
    now(),
    now()
  ),
  (
    '{"am": "የጤና", "en": "Health"}',
    '{"am": "የጤና እንክብካቤ", "en": "Health care support"}',
    'health',
    '#00BCD4',
    now(),
    now()
  );

  select id into donation_cat_building_id from public.donation_categories where name->>'en' = 'Church Building' order by created_at DESC limit 1;
  select id into donation_cat_food_id from public.donation_categories where name->>'en' = 'Food' order by created_at DESC limit 1;
  select id into donation_cat_health_id from public.donation_categories where name->>'en' = 'Health' order by created_at DESC limit 1;

  -- ============================================================================
  -- step 7: Create Events
  -- ============================================================================

  -- Event 1: Sunday Service at Saint Mary Church
  insert into public.events (
    church_id,
    category_id,
    title,
    description,
    address,
    coordinates,
    start_time,
    end_time,
    cover_image_url,
    is_online,
    meeting_url,
    max_attendees,
    rsvp_deadline,
    has_donation,
    donation_goal_amount,
    donation_current_amount,
    donation_currency,
    bank_account_id,
    status,
    created_by,
    created_at,
    updated_at
  ) values (
    church_saint_mary_id,
    event_cat_service_id,
    '{"am": "የእሁድ መደብ", "en": "Sunday Service"}',
    '{"am": "የእሁድ የአመሰግናት መደብ", "en": "Weekly Sunday worship service"}',
    '{"am": "ቅድስት ቅዱሳን ማርያም ቤተክርስቲያን፣ አዲስ አበባ", "en": "Saint Mary Church, Addis Ababa"}',
    ST_SetSRID(ST_MakePoint(38.762119, 9.037301), 4326)::geography,
    (now() + interval '7 days')::timestamptz,
    (now() + interval '7 days' + interval '2 hours')::timestamptz,
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    false,
    NULL,
    500,
    (now() + interval '6 days')::timestamptz,
    true,
    50000.00,
    12500.00,
    'ETB',
    bank_saint_mary_id,
    'published',
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    now(),
    now()
  ) returning id into event_sunday_id;

  -- Event 2: Christmas Festival at Bole Medhanialem
  insert into public.events (
    church_id,
    category_id,
    title,
    description,
    address,
    coordinates,
    start_time,
    end_time,
    cover_image_url,
    is_online,
    meeting_url,
    max_attendees,
    rsvp_deadline,
    has_donation,
    donation_goal_amount,
    donation_current_amount,
    donation_currency,
    bank_account_id,
    status,
    created_by,
    created_at,
    updated_at
  ) values (
    church_bole_id,
    event_cat_festival_id,
    '{"am": "የገና ፌስቲቫል", "en": "Christmas Festival"}',
    '{"am": "የገና በዓል አከባበር", "en": "Christmas celebration festival"}',
    '{"am": "ቦሌ መድኃኒዓለም ቤተክርስቲያን፣ ቦሌ፣ አዲስ አበባ", "en": "Bole Medhanialem Church, Bole, Addis Ababa"}',
    ST_SetSRID(ST_MakePoint(38.789865, 8.995923), 4326)::geography,
    (now() + interval '25 days')::timestamptz,
    (now() + interval '25 days' + interval '5 hours')::timestamptz,
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    false,
    NULL,
    1000,
    (now() + interval '24 days')::timestamptz,
    true,
    100000.00,
    35000.00,
    'ETB',
    bank_bole_id,
    'published',
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    now(),
    now()
  ) returning id into event_christmas_id;

  -- ============================================================================
  -- step 8: Create Donation Campaigns
  -- ============================================================================

  -- Campaign 1: Church Building Fund
  insert into public.donation_campaigns (
    church_id,
    bank_account_id,
    category_id,
    title,
    description,
    cover_image_url,
    goal_amount,
    current_amount,
    currency,
    start_date,
    end_date,
    status,
    created_by,
    created_at,
    updated_at
  ) values (
    church_saint_mary_id,
    bank_saint_mary_id,
    donation_cat_building_id,
    '{"am": "የቤተክርስቲያን ግንባታ ፈንድ", "en": "Church Building Fund"}',
    '{"am": "አዲስ የቤተክርስቲያን ግንባታ ለመደገፍ", "en": "Support our new church building project"}',
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    500000.00,
    125000.00,
    'ETB',
    now(),
    (now() + interval '365 days')::timestamptz,
    'active',
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    now(),
    now()
  ) returning id into campaign_building_id;

  -- Campaign 2: Food Support Program
  insert into public.donation_campaigns (
    church_id,
    bank_account_id,
    category_id,
    title,
    description,
    cover_image_url,
    goal_amount,
    current_amount,
    currency,
    start_date,
    end_date,
    status,
    created_by,
    created_at,
    updated_at
  ) values (
    church_bole_id,
    bank_bole_id,
    donation_cat_food_id,
    '{"am": "የምግብ ድጎማ ፕሮግራም", "en": "Food Support Program"}',
    '{"am": "ለድሆች የምግብ ድጎማ", "en": "Food support for families in need"}',
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    200000.00,
    45000.00,
    'ETB',
    now(),
    (now() + interval '180 days')::timestamptz,
    'active',
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    now(),
    now()
  ) returning id into campaign_food_id;

  -- ============================================================================
  -- step 9: Create Donations
  -- ============================================================================

  -- Donation 1: To building campaign
  insert into public.donations (
    user_id,
    campaign_id,
    event_id,
    amount,
    currency,
    status,
    is_anonymous,
    from_wallet,
    message,
    completed_at,
    created_at
  ) values (
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    campaign_building_id,
    NULL,
    5000.00,
    'ETB',
    'completed',
    false,
    false,
    '{"am": "እንደ እግዚአብሔር ፈቃድ", "en": "God willing"}',
    now(),
    (now() - interval '5 days')
  );

  -- Donation 2: To food campaign
  insert into public.donations (
    user_id,
    campaign_id,
    event_id,
    amount,
    currency,
    status,
    is_anonymous,
    from_wallet,
    message,
    completed_at,
    created_at
  ) values (
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    campaign_food_id,
    NULL,
    2000.00,
    'ETB',
    'completed',
    false,
    false,
    '{"am": "ለድሆች", "en": "For the needy"}',
    now(),
    (now() - interval '3 days')
  );

  -- Donation 3: To event
  insert into public.donations (
    user_id,
    campaign_id,
    event_id,
    amount,
    currency,
    status,
    is_anonymous,
    from_wallet,
    message,
    completed_at,
    created_at
  ) values (
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    NULL,
    event_sunday_id,
    1000.00,
    'ETB',
    'completed',
    false,
    false,
    NULL,
    now(),
    (now() - interval '1 day')
  );

  -- ============================================================================
  -- step 10: Create Content Items
  -- ============================================================================

  -- Article content
  insert into public.content_items (
    church_id,
    content_type,
    title,
    description,
    thumbnail_url,
    status,
    view_count,
    like_count,
    share_count,
    created_by,
    approved_by,
    approved_at,
    published_at,
    created_at,
    updated_at
  ) values (
    church_saint_mary_id,
    'article',
    '{"am": "የእምነት መልዕክት", "en": "Message of Faith"}',
    '{"am": "የእምነት መልዕክት ስለ እግዚአብሔር ፍቅር", "en": "A message about God''s love and faith"}',
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    'approved',
    150,
    25,
    10,
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    now(),
    now(),
    (now() - interval '10 days'),
    now()
  ) returning id into article_content_id;

  -- Video content
  insert into public.content_items (
    church_id,
    content_type,
    title,
    description,
    thumbnail_url,
    status,
    view_count,
    like_count,
    share_count,
    created_by,
    approved_by,
    approved_at,
    published_at,
    created_at,
    updated_at
  ) values (
    church_bole_id,
    'video',
    '{"am": "የእሁድ መደብ ቪዲዮ", "en": "Sunday Service Video"}',
    '{"am": "የዛሬ የእሁድ መደብ ቪዲዮ", "en": "Today''s Sunday service recording"}',
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    'approved',
    500,
    80,
    30,
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    now(),
    now(),
    (now() - interval '2 days'),
    now()
  ) returning id into video_content_id;

  -- ============================================================================
  -- step 11: Create Article Content Details
  -- ============================================================================

  insert into public.article_content (
    id,
    body,
    author_name,
    read_time_minutes
  ) values (
    article_content_id,
    '{"am": "ይህ የእምነት መልዕክት ነው...", "en": "This is a message of faith..."}',
    '{"am": "አባ መንግስቱ", "en": "Father Mengistu"}',
    5
  );

  -- ============================================================================
  -- step 12: Create Video Content Details
  -- ============================================================================

  insert into public.video_content (
    id,
    video_url,
    duration_seconds,
    file_size_bytes,
    resolution,
    aspect_ratio
  ) values (
    video_content_id,
    'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
    3600,
    50000000,
    '1920x1080',
    '16:9'
  );

  -- ============================================================================
  -- step 13: Create Event RSVPs
  -- ============================================================================

  insert into public.event_rsvps (
    user_id,
    event_id,
    status,
    created_at,
    updated_at
  ) values (
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    event_sunday_id,
    'going',
    now(),
    now()
  );

  -- ============================================================================
  -- step 14: Create User Follows
  -- ============================================================================

  insert into public.user_follows (
    user_id,
    church_id,
    followed_at
  ) values
  (
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    church_saint_mary_id,
    now()
  ),
  (
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    church_bole_id,
    now()
  );

  -- ============================================================================
  -- step 15: Create Notifications
  -- ============================================================================

  insert into public.notifications (
    user_id,
    type,
    title,
    body,
    data,
    read_at,
    created_at
  ) VALUES
  (
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    'event_reminder',
    '{"am": "የክስተት ማስታወሻ", "en": "Event Reminder"}',
    '{"am": "የእሁድ መደብ በ7 ቀናት ውስጥ ይጀምራል", "en": "Sunday Service starts in 7 days"}',
    jsonb_build_object('event_id', event_sunday_id),
    NULL,
    now()
  ),
  (
    '62744e9b-2255-4acf-be3e-3af2736201eb',
    'donation_received',
    '{"am": "የመስዋዕት ምልክት", "en": "Donation Received"}',
    '{"am": "የእርስዎ መስዋዕት ተቀብሏል", "en": "Your donation has been received"}',
    jsonb_build_object('campaign_id', campaign_building_id, 'amount', 5000),
    NULL,
    (now() - interval '5 days')
  );

END $$;

-- ============================================================================
-- summary
-- ============================================================================

-- this migration:
-- 1. Adds church_admin role to user 62744e9b-2255-4acf-be3e-3af2736201eb
-- 2. Creates 2 churches (Saint Mary and Bole Medhanialem)
-- 3. Creates 6 church images (3 per church)
-- 4. Creates 2 bank accounts (one per church)
-- 5. Creates 5 event categories
-- 6. Creates 3 donation categories
-- 7. Creates 2 events
-- 8. Creates 2 donation campaigns
-- 9. Creates 3 donations
-- 10. Creates 2 content items (article and video)
-- 11. Creates article content details
-- 12. Creates video content details
-- 13. Creates 1 event RSVP
-- 14. Creates 2 user follows
-- 15. Creates 2 notifications
