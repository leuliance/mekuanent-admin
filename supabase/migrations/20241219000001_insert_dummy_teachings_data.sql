-- Dummy data for teachings (content_items)
-- Using specified user ID and church IDs

-- Insert 2 more videos
INSERT INTO content_items (id, church_id, content_type, title, description, thumbnail_url, status, created_by, view_count, like_count, share_count, created_at, updated_at, published_at, approved_at, approved_by)
VALUES 
  (gen_random_uuid(), '08c97456-ce29-45fa-9316-b162816f73df', 'video', 
   '{"en": "Sunday Worship Service", "am": "የእሁድ የአምልኮ አገልግሎት"}'::jsonb,
   '{"en": "Join us for our weekly Sunday worship service with powerful praise and worship", "am": "በኃይለኛ ምስጋናና አምልኮ ለሳምንታዊ የእሁድ የአምልኮ አገልግሎታችን ይቀላቀሉን"}'::jsonb,
   'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
   'approved', '62744e9b-2255-4acf-be3e-3af2736201eb', 1250, 85, 32, NOW(), NOW(), NOW(), NOW(), '62744e9b-2255-4acf-be3e-3af2736201eb'
  ),
  (gen_random_uuid(), '08c97456-ce29-45fa-9316-b162816f73df', 'video',
   '{"en": "Bible Study: Book of Acts", "am": "የመጽሐፍ ቅዱስ ጥናት: የሐዋርያት ሥራ"}'::jsonb,
   '{"en": "Deep dive into the Book of Acts chapter 2, understanding the early church", "am": "ቀደምትን ቤተክርስቲያን በመረዳት ወደ የሐዋርያት ሥራ ምዕራፍ 2 ጥልቅ ጥምቀት"}'::jsonb,
   'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
   'approved', '62744e9b-2255-4acf-be3e-3af2736201eb', 980, 67, 21, NOW(), NOW(), NOW(), NOW(), '62744e9b-2255-4acf-be3e-3af2736201eb'
  );

-- Insert corresponding video_content for the 2 videos above
WITH recent_videos AS (
  SELECT id FROM content_items WHERE content_type = 'video' ORDER BY created_at DESC LIMIT 2
)
INSERT INTO video_content (id, video_url, duration_seconds, resolution, aspect_ratio)
SELECT 
  id,
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  180,
  '1920x1080',
  '16:9'
FROM recent_videos;

-- Insert 3 audio teachings
INSERT INTO content_items (id, church_id, content_type, title, description, thumbnail_url, status, created_by, view_count, like_count, share_count, created_at, updated_at, published_at, approved_at, approved_by)
VALUES 
  (gen_random_uuid(), '08c97456-ce29-45fa-9316-b162816f73df', 'audio',
   '{"en": "Morning Prayer Session", "am": "የጠዋት የጸሎት ክፍለ ጊዜ"}'::jsonb,
   '{"en": "Start your day with this powerful morning prayer and meditation session", "am": "ቀንዎን በዚህ ኃይለኛ የጠዋት ጸሎትና ማሰላሰል ክፍለ ጊዜ ይጀምሩ"}'::jsonb,
   'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
   'approved', '62744e9b-2255-4acf-be3e-3af2736201eb', 2340, 145, 67, NOW(), NOW(), NOW(), NOW(), '62744e9b-2255-4acf-be3e-3af2736201eb'
  ),
  (gen_random_uuid(), '08c97456-ce29-45fa-9316-b162816f73df', 'audio',
   '{"en": "Sermon: Faith and Hope", "am": "ስብከት: እምነትና ተስፋ"}'::jsonb,
   '{"en": "An inspiring message about maintaining faith during difficult times", "am": "በአስቸጋሪ ጊዜያት እምነትን ስለመጠበቅ አበረታች መልእክት"}'::jsonb,
   'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
   'approved', '62744e9b-2255-4acf-be3e-3af2736201eb', 1890, 112, 45, NOW(), NOW(), NOW(), NOW(), '62744e9b-2255-4acf-be3e-3af2736201eb'
  ),
  (gen_random_uuid(), '08c97456-ce29-45fa-9316-b162816f73df', 'audio',
   '{"en": "Worship Songs Collection", "am": "የአምልኮ ዘፈኖች ስብስብ"}'::jsonb,
   '{"en": "A beautiful collection of worship songs to uplift your spirit", "am": "መንፈስዎን ለማንሳት ውብ የአምልኮ ዘፈኖች ስብስብ"}'::jsonb,
   'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
   'approved', '62744e9b-2255-4acf-be3e-3af2736201eb', 3120, 201, 89, NOW(), NOW(), NOW(), NOW(), '62744e9b-2255-4acf-be3e-3af2736201eb'
  );

-- Insert corresponding audio_content for the 3 audios
WITH recent_audios AS (
  SELECT id FROM content_items WHERE content_type = 'audio' ORDER BY created_at DESC LIMIT 3
)
INSERT INTO audio_content (id, audio_url, duration_seconds, artist_name, album_name, genre, is_playlist)
SELECT 
  id,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  1800,
  '{"en": "Church Ministry", "am": "የቤተክርስቲያን አገልግሎት"}'::jsonb,
  '{"en": "Sunday Worship", "am": "የእሁድ አምልኮ"}'::jsonb,
  'worship',
  false
FROM recent_audios;

-- Insert 2 more articles
INSERT INTO content_items (id, church_id, content_type, title, description, thumbnail_url, status, created_by, view_count, like_count, share_count, created_at, updated_at, published_at, approved_at, approved_by)
VALUES 
  (gen_random_uuid(), '08c97456-ce29-45fa-9316-b162816f73df', 'article',
   '{"en": "Understanding Biblical Forgiveness", "am": "የመጽሐፍ ቅዱስ ይቅርታን መረዳት"}'::jsonb,
   '{"en": "A comprehensive guide to understanding and practicing forgiveness according to the Bible", "am": "በመጽሐፍ ቅዱስ መሠረት ይቅርታን ስለመረዳት እና ስለመለማመድ አጠቃላይ መመሪያ"}'::jsonb,
   'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
   'approved', '62744e9b-2255-4acf-be3e-3af2736201eb', 1560, 98, 34, NOW(), NOW(), NOW(), NOW(), '62744e9b-2255-4acf-be3e-3af2736201eb'
  ),
  (gen_random_uuid(), '08c97456-ce29-45fa-9316-b162816f73df', 'article',
   '{"en": "The Power of Community Prayer", "am": "የማህበረሰብ ጸሎት ኃይል"}'::jsonb,
   '{"en": "Discover how praying together as a community strengthens our faith and bonds", "am": "እንደ ማህበረሰብ አብረን መጸለይ እምነታችንንና ትስስራችንን እንዴት እንደሚያጠናክር ይወቁ"}'::jsonb,
   'https://xrgwflnjchneqfogzgkn.supabase.co/storage/v1/object/public/static/church-donation.jpeg',
   'approved', '62744e9b-2255-4acf-be3e-3af2736201eb', 2100, 156, 52, NOW(), NOW(), NOW(), NOW(), '62744e9b-2255-4acf-be3e-3af2736201eb'
  );

-- Insert corresponding article_content for the 2 articles
WITH recent_articles AS (
  SELECT id FROM content_items WHERE content_type = 'article' ORDER BY created_at DESC LIMIT 2
)
INSERT INTO article_content (id, body, author_name, read_time_minutes)
SELECT 
  id,
  '{"en": "<h2>Introduction</h2><p>Forgiveness is one of the most powerful gifts we can give ourselves and others...</p><h2>Biblical Foundation</h2><p>The Bible teaches us extensively about forgiveness...</p>", "am": "<h2>መግቢያ</h2><p>ይቅርታ ለራሳችንና ለሌሎች ልንሰጣቸው ከምንችላቸው በጣም ኃይለኛ ስጦታዎች አንዱ ነው...</p><h2>የመጽሐፍ ቅዱስ መሠረት</h2><p>መጽሐፍ ቅዱስ ስለ ይቅርታ በሰፊው ያስተምረናል...</p>"}'::jsonb,
  '{"en": "Pastor John Smith", "am": "ፓስተር ዮሐንስ ስሚዝ"}'::jsonb,
  8
FROM recent_articles
LIMIT 1;

WITH second_article AS (
  SELECT id FROM content_items WHERE content_type = 'article' ORDER BY created_at DESC LIMIT 1 OFFSET 1
)
INSERT INTO article_content (id, body, author_name, read_time_minutes)
SELECT 
  id,
  '{"en": "<h2>The Importance of Community</h2><p>When believers gather together in prayer, there is a special power...</p><h2>Historical Examples</h2><p>Throughout church history, we see numerous examples...</p>", "am": "<h2>የማህበረሰብ አስፈላጊነት</h2><p>አማኞች በጸሎት ሲሰበሰቡ ልዩ ኃይል አለ...</p><h2>ታሪካዊ ምሳሌዎች</h2><p>በሙሉ የቤተክርስቲያን ታሪክ ብዙ ምሳሌዎችን እናያለን...</p>"}'::jsonb,
  '{"en": "Sister Mary Johnson", "am": "እህት ማርያም ጆንሰን"}'::jsonb,
  6
FROM second_article;
