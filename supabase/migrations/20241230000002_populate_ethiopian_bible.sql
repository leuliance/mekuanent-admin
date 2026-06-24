/*
 * Migration: Populate Ethiopian Orthodox Bible
 * Description: Populates bible_books, bible_chapters, and sample bible_verses for Ethiopian Orthodox Tewahedo Bible (81 books)
 * Date: 2024-12-30
 */

-- ============================================================================
-- CLEANUP: Remove all existing Bible data
-- ============================================================================

-- Delete in correct order due to foreign key constraints
DELETE FROM public.verse_of_the_day;
DELETE FROM public.bible_verses;
DELETE FROM public.bible_chapters;
DELETE FROM public.bible_books;

-- ============================================================================
-- POPULATE BIBLE BOOKS (Ethiopian Orthodox - 81 Books)
-- ============================================================================

-- OLD TESTAMENT BOOKS (46 Books + 7 Deuterocanonical = 53 Books)

-- Pentateuch (5 Books)
INSERT INTO public.bible_books (name, testament, book_number, chapter_count) VALUES
('{"am": "ኦሪት ዘፍጥረት", "en": "Genesis", "or": "Uumama", "ti": "ዘፍጥረት", "so": "Bilowga"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 1, 50),
('{"am": "ኦሪት ዘጸአት", "en": "Exodus", "or": "Baiinsa", "ti": "ወፅኢ", "so": "Baxniimada"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 2, 40),
('{"am": "ኦሪት ዘሌዋውያን", "en": "Leviticus", "or": "Lewwota", "ti": "ዘሌዋውያን", "so": "Laawiyiintii"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 3, 27),
('{"am": "ኦሪት ዘኁልቊ", "en": "Numbers", "or": "Lakkoofsota", "ti": "ኁልቁ", "so": "Tirada"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 4, 36),
('{"am": "ኦሪት ዘዳግም", "en": "Deuteronomy", "or": "Dabarsa", "ti": "ዳግም", "so": "Sharciyadii Kunoqoshay"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 5, 34);

-- Historical Books (12 Books)
INSERT INTO public.bible_books (name, testament, book_number, chapter_count) VALUES
('{"am": "መጽሐፈ ኢያሱ", "en": "Joshua", "or": "Iyyaasuu", "ti": "ኢያሱ", "so": "Yashuuca"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 6, 24),
('{"am": "መጽሐፈ መሳፍንት", "en": "Judges", "or": "Abbootii Murtii", "ti": "መሳፍንት", "so": "Xaakinada"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 7, 21),
('{"am": "መጽሐፈ ሩት", "en": "Ruth", "or": "Ruut", "ti": "ሩት", "so": "Ruut"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 8, 4),
('{"am": "መጽሐፈ ሳሙኤል ቀዳማዊ", "en": "1 Samuel", "or": "1 Saamuu''eel", "ti": "1 ሳሙኤል", "so": "1 Samuueel"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 9, 31),
('{"am": "መጽሐፈ ሳሙኤል ካል", "en": "2 Samuel", "or": "2 Saamuu''eel", "ti": "2 ሳሙኤል", "so": "2 Samuueel"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 10, 24),
('{"am": "መጽሐፈ ነገስት ቀዳማዊ", "en": "1 Kings", "or": "1 Mootota", "ti": "1 ነገስት", "so": "1 Boqorradii"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 11, 22),
('{"am": "መጽሐፈ ነገስት ካልኣይ", "en": "2 Kings", "or": "2 Mootota", "ti": "2 ነገስት", "so": "2 Boqorradii"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 12, 25),
('{"am": "መጽሐፈ ዜና መዋዕል ቀዳማዊ", "en": "1 Chronicles", "or": "1 Seenaa Bara", "ti": "1 ዜና መዋዕል", "so": "1 Taariikhdii"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 13, 29),
('{"am": "መጽሐፈ ዜና መዋዕል ካልኣይ", "en": "2 Chronicles", "or": "2 Seenaa Bara", "ti": "2 ዜና መዋዕል", "so": "2 Taariikhdii"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 14, 36),
('{"am": "መጽሐፈ ዕዝራ", "en": "Ezra", "or": "Izraa", "ti": "ዕዝራ", "so": "Cesraa"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 15, 10),
('{"am": "መጽሐፈ ነህምያ", "en": "Nehemiah", "or": "Nahimiyaas", "ti": "ነህምያ", "so": "Nexemyaah"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 16, 13),
('{"am": "መጽሐፈ አስቴር", "en": "Esther", "or": "Asteer", "ti": "አስቴር", "so": "Esteer"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 17, 10);

-- Wisdom Books (5 Books)
INSERT INTO public.bible_books (name, testament, book_number, chapter_count) VALUES
('{"am": "መጽሐፈ ኢዮብ", "en": "Job", "or": "Iyyoob", "ti": "ኢዮብ", "so": "Ayuub"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 18, 42),
('{"am": "መዝሙረ ዳዊት", "en": "Psalms", "or": "Mizmoor", "ti": "መዝሙራት", "so": "Sabuurrada"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 19, 150),
('{"am": "መጽሐፈ ምሳሌ", "en": "Proverbs", "or": "Fakkeenya", "ti": "ምሳሌታት", "so": "Maahmaahyada"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 20, 31),
('{"am": "መጽሐፈ መክብብ", "en": "Ecclesiastes", "or": "Qajeelaa", "ti": "መክብብ", "so": "Wacdiyaha"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 21, 12),
('{"am": "መኃልየ መኃልይ", "en": "Song of Solomon", "or": "Faarfannaa Solomoon", "ti": "መኃልየ መኃልይ", "so": "Gabaygii Sulaymaan"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 22, 8);

-- Major Prophets (5 Books)
INSERT INTO public.bible_books (name, testament, book_number, chapter_count) VALUES
('{"am": "መጽሐፈ ኢሳይያስ", "en": "Isaiah", "or": "Isaayyaas", "ti": "ኢሳይያስ", "so": "Isayya"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 23, 66),
('{"am": "መጽሐፈ ኤርምያስ", "en": "Jeremiah", "or": "Ermiyaas", "ti": "ኤርምያስ", "so": "Yeremyaah"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 24, 52),
('{"am": "ጸሎተ ኤርምያስ", "en": "Lamentations", "or": "Booicha", "ti": "ጸሎተ ኤርምያስ", "so": "Baroorashadii"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 25, 5),
('{"am": "መጽሐፈ ሕዝቅኤል", "en": "Ezekiel", "or": "Ezeeqiyeel", "ti": "ሕዝቅኤል", "so": "Xisqeel"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 26, 48),
('{"am": "መጽሐፈ ዳንኤል", "en": "Daniel", "or": "Daanieel", "ti": "ዳንኤል", "so": "Daanyeel"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 27, 12);

-- Minor Prophets (12 Books)
INSERT INTO public.bible_books (name, testament, book_number, chapter_count) VALUES
('{"am": "መጽሐፈ ሆሴዕ", "en": "Hosea", "or": "Hooseeaa", "ti": "ሆሴዕ", "so": "Hoosheeca"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 28, 14),
('{"am": "መጽሐፈ ኢዮኤል", "en": "Joel", "or": "Yooeel", "ti": "ኢዮኤል", "so": "Yooeel"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 29, 3),
('{"am": "መጽሐፈ አሞጽ", "en": "Amos", "or": "Aamoos", "ti": "አሞጽ", "so": "Caamoos"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 30, 9),
('{"am": "መጽሐፈ አብድያስ", "en": "Obadiah", "or": "Obaadiyaas", "ti": "አብድያስ", "so": "Cobadyaah"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 31, 1),
('{"am": "መጽሐፈ ዮናስ", "en": "Jonah", "or": "Yoonaas", "ti": "ዮናስ", "so": "Yuunus"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 32, 4),
('{"am": "መጽሐፈ ሚክያስ", "en": "Micah", "or": "Miikiyaas", "ti": "ሚክያስ", "so": "Miikaah"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 33, 7),
('{"am": "መጽሐፈ ናሆም", "en": "Nahum", "or": "Naahoom", "ti": "ናሆም", "so": "Naaxuum"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 34, 3),
('{"am": "መጽሐፈ ዕንባቆም", "en": "Habakkuk", "or": "Habaaquuq", "ti": "ዕንባቆም", "so": "Xabaquuq"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 35, 3),
('{"am": "መጽሐፈ ሶፎንያስ", "en": "Zephaniah", "or": "Tsefaaniyaas", "ti": "ሶፎንያስ", "so": "Sefanyaah"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 36, 3),
('{"am": "መጽሐፈ ሐጌ", "en": "Haggai", "or": "Haagey", "ti": "ሐጌ", "so": "Xaggay"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 37, 2),
('{"am": "መጽሐፈ ዘካርያስ", "en": "Zechariah", "or": "Zakkaariyaas", "ti": "ዘካርያስ", "so": "Sekaryaah"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 38, 14),
('{"am": "መጽሐፈ ማላክያስ", "en": "Malachi", "or": "Malaakiyaas", "ti": "ማላክያስ", "so": "Malaakii"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 39, 4);

-- Deuterocanonical Books (14 Books - Ethiopian Orthodox includes these)
INSERT INTO public.bible_books (name, testament, book_number, chapter_count) VALUES
('{"am": "መጽሐፈ ጥበብ", "en": "Wisdom of Solomon", "or": "Ogummaa Solomoon", "ti": "ጥበብ", "so": "Xigmadda Sulaymaan"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 40, 19),
('{"am": "መጽሐፈ ኦሪተ ልደት", "en": "Jubilees", "or": "Kubbaa", "ti": "ኦሪተ ልደት", "so": "Jubiiliyada"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 41, 50),
('{"am": "መጽሐፈ ሄኖክ", "en": "Enoch", "or": "Henokih", "ti": "መጽሐፈ ሄኖክ", "so": "Idriis"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 42, 108),
('{"am": "መጽሐፈ ሴንሲ", "en": "Sirach", "or": "Siraak", "ti": "ሴንሲ", "so": "Siiraax"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 43, 51),
('{"am": "መጽሐፈ ማካብያን ቀዳማዊ", "en": "1 Maccabees", "or": "1 Makaabiyaas", "ti": "1 ማካብያን", "so": "1 Makaabiinta"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 44, 16),
('{"am": "መጽሐፈ ማካብያን ካልኣይ", "en": "2 Maccabees", "or": "2 Makaabiyaas", "ti": "2 ማካብያን", "so": "2 Makaabiinta"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 45, 15),
('{"am": "መጽሐፈ ቶቤ", "en": "Tobit", "or": "Xoobiyaas", "ti": "ቶቤ", "so": "Toobiit"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 46, 14),
('{"am": "መጽሐፈ ይሁዲት", "en": "Judith", "or": "Yudeet", "ti": "ይሁዲት", "so": "Yuudit"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 47, 16),
('{"am": "መጽሐፈ መዝሙራት ሰሎሞን", "en": "Psalms of Solomon", "or": "Mizmoor Solomoon", "ti": "መዝሙራት ሰሎሞን", "so": "Sabuurradii Sulaymaan"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 48, 18),
('{"am": "መጽሐፈ ባሩክ", "en": "Baruch", "or": "Baaruk", "ti": "ባሩክ", "so": "Baaruug"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 49, 6),
('{"am": "መጽሐፈ ኤስድራስ ቀዳማዊ", "en": "1 Esdras", "or": "1 Esdraas", "ti": "1 ኤስድራስ", "so": "1 Esdaras"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 50, 9),
('{"am": "መጽሐፈ ኤስድራስ ካልኣይ", "en": "2 Esdras", "or": "2 Esdraas", "ti": "2 ኤስድራስ", "so": "2 Esdaras"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 51, 16),
('{"am": "መጽሐፈ የእስጢር ተጨማሪ", "en": "Additions to Esther", "or": "Dabalataa Asteer", "ti": "የእስጢር ተጨማሪ", "so": "Wax lagu daray Esteer"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 52, 7),
('{"am": "ጸሎተ መናስሴ", "en": "Prayer of Manasseh", "or": "Kadaannoo Manaasee", "ti": "ጸሎተ መናስሴ", "so": "Salaadda Manaseh"}'::jsonb, '{"am": "ብሉይ ኪዳን", "en": "Old Testament"}'::jsonb, 53, 1);

-- NEW TESTAMENT BOOKS (27 Books)

-- Gospels (4 Books)
INSERT INTO public.bible_books (name, testament, book_number, chapter_count) VALUES
('{"am": "የማቴዎስ ወንጌል", "en": "Matthew", "or": "Wangeelichaa Maatiyoos", "ti": "ወንጌል ማቴዎስ", "so": "Matayos"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 54, 28),
('{"am": "የማርቆስ ወንጌል", "en": "Mark", "or": "Wangeelichaa Maarqos", "ti": "ወንጌል ማርቆስ", "so": "Markos"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 55, 16),
('{"am": "የሉቃስ ወንጌል", "en": "Luke", "or": "Wangeelichaa Luqaas", "ti": "ወንጌል ሉቃስ", "so": "Luukos"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 56, 24),
('{"am": "የዮሐንስ ወንጌል", "en": "John", "or": "Wangeelichaa Yohaannis", "ti": "ወንጌል ዮሐንስ", "so": "Yooxanaa"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 57, 21);

-- Acts (1 Book)
INSERT INTO public.bible_books (name, testament, book_number, chapter_count) VALUES
('{"am": "የሐዋርያት ሥራ", "en": "Acts", "or": "Hojii Ergamtoota", "ti": "ሥራሕቲ ሐዋርያት", "so": "Falimaha"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 58, 28);

-- Paul''s Letters (14 Books)
INSERT INTO public.bible_books (name, testament, book_number, chapter_count) VALUES
('{"am": "ወደ ሮሜ", "en": "Romans", "or": "Gara Roomota", "ti": "ሮሜ", "so": "Roomaanka"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 59, 16),
('{"am": "ወደ ቆሮንቶስ ቀዳማዊ", "en": "1 Corinthians", "or": "1 Qoronttoosa", "ti": "1 ቆሮንቶስ", "so": "1 Korintos"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 60, 16),
('{"am": "ወደ ቆሮንቶስ ካልኣይ", "en": "2 Corinthians", "or": "2 Qoronttoosa", "ti": "2 ቆሮንቶስ", "so": "2 Korintos"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 61, 13),
('{"am": "ወደ ገላትያ", "en": "Galatians", "or": "Gara Galaatiyaas", "ti": "ገላትያ", "so": "Galatiya"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 62, 6),
('{"am": "ወደ ኤፌሶን", "en": "Ephesians", "or": "Gara Efesoon", "ti": "ኤፌሶን", "so": "Efesos"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 63, 6),
('{"am": "ወደ ፊልጵስዩስ", "en": "Philippians", "or": "Gara Filiphiyoos", "ti": "ፊልጵስዩስ", "so": "Filibiyaanka"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 64, 4),
('{"am": "ወደ ቈላስይስ", "en": "Colossians", "or": "Gara Qolaasiyoosa", "ti": "ቈላስይስ", "so": "Kolosaanka"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 65, 4),
('{"am": "ወደ ተሰሎንቄ ቀዳማዊ", "en": "1 Thessalonians", "or": "1 Teesaalooniiqeeta", "ti": "1 ተሰሎንቄ", "so": "1 Tesaloniika"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 66, 5),
('{"am": "ወደ ተሰሎንቄ ካልኣይ", "en": "2 Thessalonians", "or": "2 Teesaalooniiqeeta", "ti": "2 ተሰሎንቄ", "so": "2 Tesaloniika"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 67, 3),
('{"am": "ወደ ጢሞቴዎስ ቀዳማዊ", "en": "1 Timothy", "or": "1 Xiimooteewos", "ti": "1 ጢሞቴዎስ", "so": "1 Timoteyos"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 68, 6),
('{"am": "ወደ ጢሞቴዎስ ካልኣይ", "en": "2 Timothy", "or": "2 Xiimooteewos", "ti": "2 ጢሞቴዎስ", "so": "2 Timoteyos"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 69, 4),
('{"am": "ወደ ቲቶስ", "en": "Titus", "or": "Gara Xiixoos", "ti": "ቲቶስ", "so": "Tiitos"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 70, 3),
('{"am": "ወደ ፊልሞና", "en": "Philemon", "or": "Gara Fiilmoonaa", "ti": "ፊልሞና", "so": "Filemon"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 71, 1),
('{"am": "ወደ ዕብራውያን", "en": "Hebrews", "or": "Gara Ibrootaa", "ti": "ዕብራውያን", "so": "Cibraaniyada"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 72, 13);

-- General Epistles (7 Books)
INSERT INTO public.bible_books (name, testament, book_number, chapter_count) VALUES
('{"am": "የያዕቆብ መልእክት", "en": "James", "or": "Yaaqoob", "ti": "የያዕቆብ", "so": "Yacquub"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 73, 5),
('{"am": "የጴጥሮስ ቀዳማዊ መልእክት", "en": "1 Peter", "or": "1 Phexroos", "ti": "1 ጴጥሮስ", "so": "1 Butros"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 74, 5),
('{"am": "የጴጥሮስ ካልኣይ መልእክት", "en": "2 Peter", "or": "2 Phexroos", "ti": "2 ጴጥሮስ", "so": "2 Butros"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 75, 3),
('{"am": "የዮሐንስ ቀዳማዊ መልእክት", "en": "1 John", "or": "1 Yohaannis", "ti": "1 ዮሐንስ", "so": "1 Yooxanaa"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 76, 5),
('{"am": "የዮሐንስ ካልኣይ መልእክት", "en": "2 John", "or": "2 Yohaannis", "ti": "2 ዮሐንስ", "so": "2 Yooxanaa"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 77, 1),
('{"am": "የዮሐንስ ሦስተኛው መልእክት", "en": "3 John", "or": "3 Yohaannis", "ti": "3 ዮሐንስ", "so": "3 Yooxanaa"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 78, 1),
('{"am": "የይሁዳ መልእክት", "en": "Jude", "or": "Yihudaa", "ti": "የይሁዳ", "so": "Yahuuda"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 79, 1);

-- Revelation (1 Book)
INSERT INTO public.bible_books (name, testament, book_number, chapter_count) VALUES
('{"am": "የዮሐንስ ራእይ", "en": "Revelation", "or": "Mul''ata Yohaannis", "ti": "የዮሐንስ ራእይ", "so": "Muujinta"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 80, 22);

-- Additional Ethiopian Orthodox Books
INSERT INTO public.bible_books (name, testament, book_number, chapter_count) VALUES
('{"am": "መጽሐፈ ምሥጢር", "en": "Book of Mysteries", "or": "Kitaaba Iccitii", "ti": "መጽሐፈ ምሥጢር", "so": "Buugga Qarsoodiga"}'::jsonb, '{"am": "አዲስ ኪዳን", "en": "New Testament"}'::jsonb, 81, 35);

-- ============================================================================
-- POPULATE BIBLE CHAPTERS
-- ============================================================================

DO $$
DECLARE
  book_record RECORD;
  chapter_num INT;
BEGIN
  FOR book_record IN SELECT id, chapter_count FROM public.bible_books LOOP
    FOR chapter_num IN 1..book_record.chapter_count LOOP
      INSERT INTO public.bible_chapters (book_id, chapter_number, verse_count)
      VALUES (
        book_record.id,
        chapter_num,
        -- Default verse count (simplified - real implementation would have exact counts)
        CASE 
          WHEN chapter_num = 1 THEN 31
          WHEN chapter_num = 119 THEN 176  -- Psalm 119
          ELSE 25 + (chapter_num % 10)
        END
      );
    END LOOP;
  END LOOP;
END $$;

-- ============================================================================
-- POPULATE SAMPLE VERSES (Popular verses for verse-of-the-day)
-- ============================================================================

-- Get chapter IDs for popular verses
DO $$
DECLARE
  john_3_chapter_id UUID;
  psalm_23_chapter_id UUID;
  genesis_1_chapter_id UUID;
  matthew_5_chapter_id UUID;
  romans_8_chapter_id UUID;
  proverbs_3_chapter_id UUID;
  isaiah_40_chapter_id UUID;
  philippians_4_chapter_id UUID;
BEGIN
  -- John 3 (Gospel of John, chapter 3)
  SELECT c.id INTO john_3_chapter_id
  FROM public.bible_chapters c
  JOIN public.bible_books b ON c.book_id = b.id
  WHERE b.book_number = 57 AND c.chapter_number = 3;
  
  IF john_3_chapter_id IS NOT NULL THEN
    INSERT INTO public.bible_verses (chapter_id, verse_number, text) VALUES
    (john_3_chapter_id, 16, '{"am": "እግዚአብሔር ዓለምን በእጅጉ ስለ ወዳት ልጁን ያለውን አንድ ልጁን ሰጠ፣ በእርሱም የሚያምን ሁሉ ሳይጠፋ የዘላለም ሕይወት ይኖረዋል።", "en": "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", "or": "Waaqni akkasitti addunyaa jaallateef, namni isatti amanu hundi akka hin badneef jireenya bara baraa akka argatuuf Ilma isaa tokkicha kenne.", "ti": "እግዚአብሔር ዓለምን ዓብዪ ፍቅሪ ኣፍቂሩ፣ ብእኡ ዝኣምን ዂሉ ከይጠፍእ ዘለዓለም ህይወት ምእንቲ ከረኽብ፣ ሓደኛ ዝኾነ ወዱ ሀበ።", "so": "Ilaah ayuu dunida aad u jeclaaday inuu Wiilkiisa keligiis ahaa siiyey, si qofkii isaga rumaystaa uusan halligmin laakiin uu nolosha weligeed ah helo."}'::jsonb);
  END IF;

  -- Psalm 23
  SELECT c.id INTO psalm_23_chapter_id
  FROM public.bible_chapters c
  JOIN public.bible_books b ON c.book_id = b.id
  WHERE b.book_number = 19 AND c.chapter_number = 23;
  
  IF psalm_23_chapter_id IS NOT NULL THEN
    INSERT INTO public.bible_verses (chapter_id, verse_number, text) VALUES
    (psalm_23_chapter_id, 1, '{"am": "እግዚአብሔር እረኛዬ ነው፤ የሚያስፈልገኝ ነገር የለም።", "en": "The Lord is my shepherd, I lack nothing.", "or": "Gooftaan tiksee koo ti; wanti na barbaachisu hin jiru.", "ti": "እግዚአብሔር ኣሕጻሕየይ እዩ፣ ዘድልየኒ ኣይኮነን።", "so": "Rabbigu waa Adhijirkayga, waxba igama baahna."}'::jsonb),
    (psalm_23_chapter_id, 4, '{"am": "እኔ በጨለማ ሸለቆ ብጓዝም፣ መጥፎ አልፈራም፤ አንተ ከእኔ ጋር ስለሆንክ፣ በትርክና በጠንካራ እገዛህ ታጸናናለህ።", "en": "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.", "or": "Yoon sulula dukkanaa keessa deddeemuu illee, waan hamaa hin sodaadhu; ati na wajjin jirta; bokkuun keetii fi uleen kee na jajjabeessu.", "ti": "እናተ ብሸለቆ ጸልማት እንተኸድኩውን፣ ክፉእ ኣይፈራን፣ ንስኻ ምሳይ ስለዘሎኻ፣ በትርኻን እተርእሶኻን የፅናንዑኒ።", "so": "In kastoo aan dooxada dhimashada ku dhex socdo ayaan xumaanta ka baqi maayo, waayo, adigu waad ila jirtaa, ushan iyo hangoolkaaguna way i raaxaysanayaan."}'::jsonb);
  END IF;

  -- Genesis 1 - ALL VERSES
  SELECT c.id INTO genesis_1_chapter_id
  FROM public.bible_chapters c
  JOIN public.bible_books b ON c.book_id = b.id
  WHERE b.book_number = 1 AND c.chapter_number = 1;
  
  IF genesis_1_chapter_id IS NOT NULL THEN
    INSERT INTO public.bible_verses (chapter_id, verse_number, text) VALUES
    (genesis_1_chapter_id, 1, '{"am": "መጀመሪያ እግዚአብሔር ሰማይንና ምድርን ፈጠረ።", "en": "In the beginning God created the heavens and the earth.", "or": "Jalqaba keessa Waaqni samiiwwanii fi lafa uume.", "ti": "መጀመርታ እግዚአብሔር ሰማያትን ምድርን ፈጠረ።", "so": "Bilowgii Ilaah baa abuuray samooyinka iyo dhulka."}'::jsonb),
    (genesis_1_chapter_id, 2, '{"am": "ምድርም ባዶና ባዶ ነበረች፤ ጨለማም በባህርው ላይ ነበረ፤ የእግዚአብሔር መንፈስም ውኃዎች ላይ ተንሳፋፊ ነበረ።", "en": "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.", "or": "Lafti garuu onaanii fi duwwaa turte; dukkanni fuula bishaanii irra ture; Hafuurri Waaqaas bishaanii irra tartiibaa ture.", "ti": "ምድሪ ድማ ባዶን ባዲን ነበረት፤ ጸልማት ኣብ ልዕሊ ኣፍ ዕምቂ ነበረ፤ መንፈስ እግዚኣብሔር ድማ ኣብ ልዕሊ ማያት ይሰቅል ነበረ።", "so": "Dhulkuna wuxuu ahaa mid aan micnaha lahayn oo madhan, gudcurna wuxuu dul joogay moolka, Ruuxa Ilaahna wuxuu dul socday biyaha."}'::jsonb),
    (genesis_1_chapter_id, 3, '{"am": "እግዚአብሔርም፤ ብርሃን ይሁን አለ፤ ብርሃንም ሆነ።", "en": "And God said, Let there be light, and there was light.", "or": "Waaqni immoo, Ifni haa tahu jedhe; ifnis ni tahe.", "ti": "እግዚኣብሄር ድማ፡ ብርሃን ይኹን በሃሉ፤ ብርሃን ኮነ።", "so": "Ilaahna wuxuu yidhi, Iftiin ha noqoto, iftiinna way noqotay."}'::jsonb),
    (genesis_1_chapter_id, 4, '{"am": "እግዚአብሔርም ብርሃኑን መልካም ነው ብሎ አየው፤ እግዚአብሔርም ብርሃኑን ከጨለማው ለየው።", "en": "God saw that the light was good, and he separated the light from the darkness.", "or": "Waaqnis akka ifni gaarii tahe arge; Waaqnis ifa dukkana irraa addaan baase.", "ti": "እግዚኣብሔር ብርሃን ጽቡቕ ምዃኑ ርእዩ፤ እግዚኣብሔርም ብርሃን ካብ ጸልማት ፈለዮ።", "so": "Ilaahna wuxuu arkay in iftiinku wanaagsan yahay, Ilaahna iftiinka ayuu ka soocay gudcurka."}'::jsonb),
    (genesis_1_chapter_id, 5, '{"am": "እግዚአብሔርም ብርሃኑን ቀን ብሎ ጠራው፤ ጨለማውንም ሌሊት ብሎ ጠራው። ማታም ሆነ ጠዋትም የመጀመሪያው ቀን ሆነ።", "en": "God called the light day, and the darkness he called night. And there was evening, and there was morning—the first day.", "or": "Waaqnis ifa guyyaa jedhee moggaase; dukkana immoo halkan jedhee moggaase. Galgala fi ganama taʼe; guyyaa jalqabaa taʼe.", "ti": "እግዚኣብሔር ብርሃን መዓልቲ በሃሉ፤ ጸልማትከ ለይቲ በሃሉ። ምሸትን ጽባሕን ቀዳማይ መዓልቲ ኮነ።", "so": "Ilaahna iftiinka wuxuu u bixiyey maalin, gudcurkana wuxuu u bixiyey habeen. Oo waxaa jiray fiid iyo subax, maalintii kowaad."}'::jsonb),
    (genesis_1_chapter_id, 6, '{"am": "እግዚአብሔርም፤ በውኃዎች መካከል ምድረ በዳ ይሁን፥ ውኃዎችንም ከውኃዎች ይለይ አለ።", "en": "And God said, Let there be a vault between the waters to separate water from water.", "or": "Waaqnis, Bishaanota gidduutti bantiin haa jiraatu; bishaanota bishaanota irraa haa addaan baasu jedhe.", "ti": "እግዚኣብሔር ድማ፡ ኣብ ማእከል ማያት ጸፈሮት ይኹን፤ ማያት ካብ ማያት የፍልን በሃሉ።", "so": "Ilaahna wuxuu yidhi, Samada ha noqoto biyaha dhexdooda inay biyaha ka soocdo."}'::jsonb),
    (genesis_1_chapter_id, 7, '{"am": "እግዚአብሔርም ምድረ በዳውን አደረገ፤ ከምድረ በዳው በታች ያለውን ውኃ ከምድረ በዳው በላይ ካለው ውኃ ለየው፤ እንዲሁም ሆነ።", "en": "So God made the vault and separated the water under the vault from the water above it. And it was so.", "or": "Waaqnis bantii hojjete; bishaan bantii jalatti jiru bishaan ishee irra jiru irraa addaan baase; akkanaanis taʼe.", "ti": "እግዚኣብሔር ጸፈሮት ገበሮ፤ ኣብ ትሕቲ ጸፈሮት ዘሎ ማይ ኻብቲ ኣብ ልዕሊ ጸፈሮት ዘሎ ማይ ፈለዮ፤ ከምኡ ድማ ኮነ።", "so": "Ilaahna samada ayuu sameeyey oo kala soocay biyihii samada ka hooseeyey iyo biyihii samada ka sarreeyey, sidaasna waa noqotay."}'::jsonb),
    (genesis_1_chapter_id, 8, '{"am": "እግዚአብሔርም ምድረ በዳውን ሰማይ ብሎ ጠራው። ማታም ሆነ ጠዋትም ሁለተኛው ቀን ሆነ።", "en": "God called the vault sky. And there was evening, and there was morning—the second day.", "or": "Waaqnis bantii sana samii jedhee moggaase. Galgala fi ganama taʼe; guyyaa lammaffaa taʼe.", "ti": "እግዚኣብሔር ጸፈሮት ሰማይ በሃሉ። ምሸትን ጽባሕን ካልኣይ መዓልቲ ኮነ።", "so": "Ilaahna samada wuxuu u bixiyey cir. Oo waxaa jiray fiid iyo subax, maalintii labaad."}'::jsonb),
    (genesis_1_chapter_id, 9, '{"am": "እግዚአብሔርም፤ ከሰማይ በታች ያለው ውኃ በአንድ ቦታ ይሰብሰብ፥ ደረቅም መሬት ይታይ አለ፤ እንዲሁም ሆነ።", "en": "And God said, Let the water under the sky be gathered to one place, and let dry ground appear. And it was so.", "or": "Waaqnis, Bishaan samii jalatti jiru tokko iddootti walitti haa qabamu; lafa goggogaanis haa muldhatu jedhe; akkanaanis taʼe.", "ti": "እግዚኣብሔር ድማ፡ ኣብ ትሕቲ ሰማይ ዘሎ ማይ ናብ ሓደ ቦታ ይኣኽብ፤ የቢስ መሬትን ይርአ በሃሉ፤ ከምኡ ድማ ኮነ።", "so": "Ilaahna wuxuu yidhi, Biyaha cirka ka hooseeya meel ha isugu soo ururaan, oo dhulka engeganna ha muuqdo, sidaasna waa noqotay."}'::jsonb),
    (genesis_1_chapter_id, 10, '{"am": "እግዚአብሔርም ደረቅ መሬትን ምድር ብሎ ጠራው፤ የተሰበሰበውን ውኃም ባሕሮች ብሎ ጠራው፤ እግዚአብሔርም መልካም ነው ብሎ አየው።", "en": "God called the dry ground land, and the gathered waters he called seas. And God saw that it was good.", "or": "Waaqnis lafa goggogaa lafa jedhee moggaase; bishaan walitti qabame immoo galaana jedhee moggaase. Waaqnis akka inni gaarii tahe arge.", "ti": "እግዚኣብሔር የቢስ መሬት መሬት በሃሉ፤ ንስብስብ ማያት ድማ ባሕሪ በሃሉ። እግዚኣብሔር ጽቡቕ ምዃኑ ርእዩ።", "so": "Ilaahna dhulka engegnaa wuxuu u bixiyey dhul, biyihii ururay wuxuu u bixiyey bado. Ilaahna wuu arkay inay wanaagsan yihiin."}'::jsonb),
    (genesis_1_chapter_id, 11, '{"am": "እግዚአብሔርም፤ ምድር አረንጓዴ ሣርን፥ በዘሩ የሚዘራ ዕፀ ዘርንና በምድር ላይ በዘሩ የሚያፈራ በዘሩ ዘር ያለበት ፍሬ ዕፀን ታበቅል አለ፤ እንዲሁም ሆነ።", "en": "Then God said, Let the land produce vegetation: seed-bearing plants and trees on the land that bear fruit with seed in it, according to their various kinds. And it was so.", "or": "Waaqnis, Lafti biqiltuu haa biqilchu; biqiltuu sanyii baasu, muka firii sanyii of keessaa qabu, gosa isaaniitiin lafa irra jiru haa biqilchu jedhe; akkanaanis taʼe.", "ti": "እግዚኣብሔር ድማ፡ መሬት ሳዕሪ ይበቅል፤ ብዘርኡ ዘመቈሊ ኣፍራሕትን እምባታት ዘዕቕብ ፍረ ዝህቡ ኣእዋም ድማ ብዓይነቶም ኣብ ምድሪ ይበቅሉ በሃሉ፤ ከምኡ ድማ ኮነ።", "so": "Ilaahna wuxuu yidhi, Dhulku ha soo bixiyo doog, geed iniinole ah iyo geed midho dhalaya oo uu iniinuhu ku jiro, siday u kala yihiin, oo dhulka saaran. Sidaasna waa noqotay."}'::jsonb),
    (genesis_1_chapter_id, 12, '{"am": "ምድርም አረንጓዴ ሣርን፥ በዘሩ የሚዘራ ዕፀ ዘርንና በዘሩ ዘር ያለበት ፍሬ የሚያደርግ ዕፀን አበቀለች። እግዚአብሔርም መልካም ነው ብሎ አየው።", "en": "The land produced vegetation: plants bearing seed according to their kinds and trees bearing fruit with seed in it according to their kinds. And God saw that it was good.", "or": "Lafti biqiltuu biqilchite; biqiltuu gosa isaatiin sanyii baasu, muka gosa isaatiin firii sanyii of keessaa qabu biqilche. Waaqnis akka inni gaarii tahe arge.", "ti": "መሬት ሳዕሪ ኣብቀለ፤ ብዓይነቱ ዘመቐሊ ኣፍራሕቲ፤ ብዓይነቱ ዝዓይነት ዝዕቕቦ ፍረ ዘፍረየ እምባታት። እግዚኣብሔር ጽቡቕ ምዃኑ ርእዩ።", "so": "Dhulkuna wuxuu soo bixiyey doog, geed iniino dhalaya oo kala duwan, iyo dhir midho dhalaya oo ay iniinuhu ku jiro oo kala duwan. Ilaahna wuu arkay inay wanaagsan yihiin."}'::jsonb),
    (genesis_1_chapter_id, 13, '{"am": "ማታም ሆነ ጠዋትም ሦስተኛው ቀን ሆነ።", "en": "And there was evening, and there was morning—the third day.", "or": "Galgala fi ganama taʼe; guyyaa sadaffaa taʼe.", "ti": "ምሸትን ጽባሕን ሣልሳይ መዓልቲ ኮነ።", "so": "Oo waxaa jiray fiid iyo subax, maalintii saddexaad."}'::jsonb),
    (genesis_1_chapter_id, 14, '{"am": "እግዚአብሔርም፤ በሰማይ ምድረ በዳ ቀንንና ሌሊትን እንዲለዩ ብርሃናት ይሁኑ፤ ለምልክትም ለጊዜያት ለቀናትና ለዓመታት ይሁኑ።", "en": "And God said, Let there be lights in the vault of the sky to separate the day from the night, and let them serve as signs to mark sacred times, and days and years", "or": "Waaqnis, Guyyaa halkan irraa addaan baasuuf bantii samiitti ifawwan haa jiraatan; isaan akka mallattoo taʼaniif, akka waqtii, guyyaa fi waggoota murteessaniif haa taʼan jedhe.", "ti": "እግዚኣብሔር ድማ፡ መዓልቲ ካብ ለይቲ ንምፍላይ ኣብ ጸፈሮት ሰማይ ብርሃናት ይኹኑ፤ ንምልክትን ግዜታትን መዓልታትን ዓመታትን ይኹኑ በሃሉ።", "so": "Ilaahna wuxuu yidhi, Samada cirka ha ka mid noqdaan iftiimmo inay kala soocaan maalinta iyo habeenka, oo ha u ahaadeen calaamooyin iyo xilliyo, iyo maalmo iyo sannado."}'::jsonb),
    (genesis_1_chapter_id, 15, '{"am": "እነርሱም በሰማይ ምድረ በዳ ምድርን ለማብራት ብርሃናት ይሁኑ አለ፤ እንዲሁም ሆነ።", "en": "and let them be lights in the vault of the sky to give light on the earth. And it was so.", "or": "Lafa irrattis akka ibsaniif bantii samiitti ifawwan haa taʼan jedhe; akkanaanis taʼe.", "ti": "ንምድሪ ንኽብርህዎ ኣብ ጸፈሮት ሰማይ ብርሃናት ይኹኑ በሃሉ፤ ከምኡ ድማ ኮነ።", "so": "oo samada cirka ha uga mid noqdaan iftiimmo ay dhulka u iftiimiyaan. Sidaasna waa noqotay."}'::jsonb),
    (genesis_1_chapter_id, 16, '{"am": "እግዚአብሔርም ሁለት ታላላቅ ብርሃናትን አደረገ፤ ታላቁንም ብርሃን ቀንን እንዲገዛ፥ አነስተኛውንም ብርሃን ሌሊትን እንዲገዛ፤ ከዋክብትንም አደረገ።", "en": "God made two great lights—the greater light to govern the day and the lesser light to govern the night. He also made the stars.", "or": "Waaqnis ifawwan gurguddoo lama hojjete; guyyaa bulchuuf ifa guddaa, halkan bulchuuf immoo ifa xinnoo hojjete; urjiiwwanis hojjete.", "ti": "እግዚኣብሔር ክልተ ዓበይቲ ብርሃናት ገበረ፤ መዓልቲ ንኽእዝዝ ዝዓበየ ብርሃን፤ ለይቲ ንኽእዝዝ ዝንእሰ ብርሃን፤ ከዋኽብትን ገበረ።", "so": "Ilaahna wuxuu sameeyey laba iftiin oo waaweyn, iftiinka weyn inuu maalinta u taliyona, iftiinka yarna inuu habeenka u taliyona. Xiddigahana wuu sameeyey."}'::jsonb),
    (genesis_1_chapter_id, 17, '{"am": "እግዚአብሔርም ምድርን እንዲያበሩ በሰማይ ምድረ በዳ ዘረጋቸው።", "en": "God set them in the vault of the sky to give light on the earth", "or": "Waaqnis lafa irratti akka ibsaniif bantii samiitti isaan dhaabe.", "ti": "እግዚኣብሔር ንምድሪ ንኽብርህዋ ኣብ ጸፈሮት ሰማይ ኣቐመጦም።", "so": "Ilaahna samada cirka ayuu dhigay inay dhulka u iftiimiyaan"}'::jsonb),
    (genesis_1_chapter_id, 18, '{"am": "ቀንንና ሌሊትን እንዲገዙ፥ ብርሃንንም ከጨለማው እንዲለዩ፤ እግዚአብሔርም መልካም ነው ብሎ አየው።", "en": "to govern the day and the night, and to separate light from darkness. And God saw that it was good.", "or": "guyyaa fi halkan akka bulchaniif, ifa immoo dukkana irraa akka addaan baasaniif. Waaqnis akka inni gaarii tahe arge.", "ti": "መዓልትን ለይትን ንኽእዝዙ፤ ብርሃንን ካብ ጸልማት ንኽፍልዩ። እግዚኣብሔር ጽቡቕ ምዃኑ ርእዩ።", "so": "inay u taliyaan maalinta iyo habeenka, iyo inay kala soocaan iftiinka iyo gudcurka. Ilaahna wuu arkay inay wanaagsan yihiin."}'::jsonb),
    (genesis_1_chapter_id, 19, '{"am": "ማታም ሆነ ጠዋትም አራተኛው ቀን ሆነ።", "en": "And there was evening, and there was morning—the fourth day.", "or": "Galgala fi ganama taʼe; guyyaa afuraffaa taʼe.", "ti": "ምሸትን ጽባሕን ራብዓይ መዓልቲ ኮነ።", "so": "Oo waxaa jiray fiid iyo subax, maalintii afraad."}'::jsonb),
    (genesis_1_chapter_id, 20, '{"am": "እግዚአብሔርም፤ ውኃዎች የሕያው ነፍስ መንጋ ይዘሩ፤ አእዋፍም በምድር ላይ በሰማይ ምድረ በዳ ይብረሩ አለ።", "en": "And God said, Let the water teem with living creatures, and let birds fly above the earth across the vault of the sky.", "or": "Waaqnis, Bishaan uumamtoota lubbuqabeeyyii hedduu haa horsiisan; simbirroonnis lafa irra, bantii samii jalatti haa barisan jedhe.", "ti": "እግዚኣብሔር ድማ፡ ማያት ህያው ዘለዎ ወፍሪ ነፍሳት ይፈስ፤ ኣዕዋፍን ኣብ ልዕሊ ምድሪ ኣብ ልዕሊ ጸፈሮት ሰማይ ይሃንጹ በሃሉ።", "so": "Ilaahna wuxuu yidhi, Biyuhu ha ka buuxsanyihiin waxyaalo badan oo nool, shimbirruhuna ha duulduulaan dhulka kor iyo xagga samada cirka ah."}'::jsonb),
    (genesis_1_chapter_id, 21, '{"am": "እግዚአብሔርም ታላላቅ የባሕር አራዊትንና ውኃዎች የዘሩትን ሁሉ በዘሩ የሚንቀሳቀስ የሕያው ነፍስ ሁሉ፥ ሁሉንም የተያያዘ ወፍ በዘሩ ፈጠረ። እግዚአብሔርም መልካም ነው ብሎ አየው።", "en": "So God created the great creatures of the sea and every living thing with which the water teems and that moves about in it, according to their kinds, and every winged bird according to its kind. And God saw that it was good.", "or": "Waaqnis uumamtoota gurguddoo galaanaa, uumamtoota jiraatoo bishaanota keessatti sochooan hunda, gosa isaaniitiin, simbirroo qoochoo qabu hundas gosa isaatiin uume. Waaqnis akka isaan gaarii taʼan arge.", "ti": "እግዚኣብሔር ዓበይቲ ዓሳታት ባሕሪ፤ ኵሎም ዝነብሩ ዘለዎ ወፍሪ ዝነቕሐቕሑ ነፍሳት ብዓይነቶም ነፋሪ ዘለዎም ዅሎም ኣዕዋፍ ብዓይነቶም ፈጠረ። እግዚኣብሔር ጽቡቕ ምዃኖም ርእዩ።", "so": "Ilaahna wuxuu abuuray bahallo waaweyn oo badda, iyo uun kasta oo nool oo biyuhu ka buuxsanyihiin oo dhaqaaqa sida ay u kala yihiin, iyo shimbir kasta oo baalal leh sida ay u kala yihiin. Ilaahna wuu arkay inay wanaagsan yihiin."}'::jsonb),
    (genesis_1_chapter_id, 22, '{"am": "እግዚአብሔርም እነርሱን ባረከ እንዲህም አለ፤ ፍሩ ብዙ ሁኑ፥ በባሕር ውኃም ውስጥ ብዙ ሁኑ፤ አእዋፍም በምድር ላይ ይብዙ።", "en": "God blessed them and said, Be fruitful and increase in number and fill the water in the seas, and let the birds increase on the earth.", "or": "Waaqnis isaan eebbisee akkana jedhe; Horaa baayʼadhaa, bishaan galaanaa keessas guutaa; simbirroonnis lafa irra haa baayʼatan.", "ti": "እግዚኣብሔር ባረኾምን በሃሎምን፡ ፈርዩ ብዝሑ፤ ማይ ባሕሪ ምልኡ፤ ኣዕዋፍን ኣብ ምድሪ ይብዝሑ።", "so": "Ilaahna waa u duceeyey oo wuxuu ku yidhi, Wax badan dhala oo tarma, oo buuxiya biyaha badaha dhexdooda, shimbirruhuna ha ku tarmeen dhulka."}'::jsonb),
    (genesis_1_chapter_id, 23, '{"am": "ማታም ሆነ ጠዋትም አምስተኛው ቀን ሆነ።", "en": "And there was evening, and there was morning—the fifth day.", "or": "Galgala fi ganama taʼe; guyyaa shanaffaa taʼe.", "ti": "ምሸትን ጽባሕን ሓምሻይ መዓልቲ ኮነ።", "so": "Oo waxaa jiray fiid iyo subax, maalintii shanaad."}'::jsonb),
    (genesis_1_chapter_id, 24, '{"am": "እግዚአብሔርም፤ ምድር የሕያው ነፍስን በዘሩ፥ እንስሳንና የምድርን አራዊትን በዘሩ ታበቅል አለ፤ እንዲሁም ሆነ።", "en": "And God said, Let the land produce living creatures according to their kinds: the livestock, the creatures that move along the ground, and the wild animals, each according to its kind. And it was so.", "or": "Waaqnis, Lafti uumamtoota jiraatoo gosa isaaniitiin, horii, uumamtoota lafa irra looʼan, bineensota lafa gosa isaaniitiin haa hortee jedhe; akkanaanis taʼe.", "ti": "እግዚኣብሔር ድማ፡ መሬት ህያው ዘለዋ ነፍሳት ብዓይነቶም፤ እንስሳታትን ዝረግጽ መሬት ዘለዎምን ኣራዊት መሬት ብዓይነቶምን ይፍጠር በሃሉ፤ ከምኡ ድማ ኮነ።", "so": "Ilaahna wuxuu yidhi, Dhulku ha soo saaro waxyaalo nool oo kala duwan, xoolo iyo waxyaalaha dhulka gurguurta iyo dugaagga, mid walba sida uu yahay. Sidaasna waa noqotay."}'::jsonb),
    (genesis_1_chapter_id, 25, '{"am": "እግዚአብሔርም የምድርን አራዊት በዘሩ፥ እንስሳንም በዘሩ፥ በምድርም ላይ የሚንቀሳቀስ ሁሉ በዘሩ አደረገ። እግዚአብሔርም መልካም ነው ብሎ አየው።", "en": "God made the wild animals according to their kinds, the livestock according to their kinds, and all the creatures that move along the ground according to their kinds. And God saw that it was good.", "or": "Waaqnis bineensota lafa gosa isaaniitiin, horii gosa isaaniitiin, waan lafa irra looʼu hunda gosa isaatiin hojjete. Waaqnis akka inni gaarii tahe arge.", "ti": "እግዚኣብሔር ኣራዊት መሬት ብዓይነቶም፤ እንስሳታት ብዓይነቶም፤ ኩሎም ዝረግጽ መሬት ብዓይነቶም ገበረ። እግዚኣብሔር ጽቡቕ ምዃኑ ርእዩ።", "so": "Ilaahna wuxuu sameeyey dugaagga sida ay u kala yihiin, iyo xoolaha sida ay u kala yihiin, iyo wax kasta oo dhulka gurguurta sida ay u kala yihiin. Ilaahna wuu arkay inay wanaagsan yihiin."}'::jsonb),
    (genesis_1_chapter_id, 26, '{"am": "እግዚአብሔርም፤ ሰውን በመልካችን እንደ ምስላችን እንፍጠር፤ በባሕር ዓሣም ሁሉ፥ በሰማይ አእዋፍም በእንስሳም ሁሉ በምድርም ላይ በምድር ላይ በሚንቀሳቀስ ነፍስ ሁሉ ይግዙ አለ።", "en": "Then God said, Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground.", "or": "Waaqnis akkana jedhe; Kottaa nama bifa keenyaan, fakkeenya keenyaan haa hojjennu; innis qurxummii galaanaa irratti, simbirroo samii irratti, loon irratti, lafa hunda irratti, waan lafa irra looʼu hunda irrattis haa bulchu.", "ti": "እግዚኣብሔር ድማ፡ ሰብ ብምስልና ብመሰልና ንፍጠሮ፤ ዓሳ ባሕሪን ኣዕዋፍ ሰማይን እንስሳታትን ኵላ ምድርን ኵሎም ዝረግጽ መሬት ዘለዎምን የእዝዙ በሃሉ።", "so": "Ilaahna wuxuu yidhi, Aynu dadka ku samayno muuqaalkeenna iyo ekadeenna, oo ha u taliyeen kalluunka badda, iyo shimbirraha cirka, iyo xoolaha, iyo dhulka oo dhan, iyo wax kasta oo dhulka gurguurta."}'::jsonb),
    (genesis_1_chapter_id, 27, '{"am": "እግዚአብሔርም ሰውን በራሱ ምስል ፈጠረው፤ በእግዚአብሔር ምስል ፈጠረው፤ ወንድና ሴትን ፈጠራቸው።", "en": "So God created mankind in his own image, in the image of God he created them; male and female he created them.", "or": "Waaqnis nama bifa ofii isaatiin uume; bifa Waaqaatiin isa uume; dhiiraa fi dubartii isaan uume.", "ti": "እግዚኣብሔር ሰብ ብምስሉ ፈጠሮ፤ ብምስሊ እግዚኣብሔር ፈጠሮ፤ ተባዕታይን ኣንስተይትን ፈጠሮም።", "so": "Ilaahna dadka wuxuu ku abuuray muuqaalkiisa, muuqaalka Ilaah buu ku abuuray, lab iyo dhadig buu u abuuray."}'::jsonb),
    (genesis_1_chapter_id, 28, '{"am": "እግዚአብሔርም ባረካቸው፤ እግዚአብሔርም እነሆ በምድር ገጽ ላይ ያለውን ሁሉ ሣር ዘር የሚዘራንና ፍሬ ዘር ያለበትን የሚያፈራ ዕፀ ሁሉ ሰጣችኋለሁ፤ ለእናንተም ለምግብ ይሆናሉ አላቸው።", "en": "God blessed them and said to them, Be fruitful and increase in number; fill the earth and subdue it. Rule over the fish in the sea and the birds in the sky and over every living creature that moves on the ground.", "or": "Waaqnis isaan eebbisee akkana isaaniin jedhe; Horaa baayʼadhaa; lafa guutaa bulchaa. Qurxummii galaanaa irratti, simbirroo samii irratti, uumamtoota jiraatoo lafa irra jiran hunda irrattis bulchaa.", "ti": "እግዚኣብሔር ባረኾምን በሎምን፡ ፈርዩ ብዝሑ፤ ምድሪ ምልኡዋ እዝዙዋ። ዓሳ ባሕሪን ኣዕዋፍ ሰማይን ኩሎም ዝነብሩ ዘለዎም ኣብ ልዕሊ ምድሪ ዝረግጹ ኣራዊትን እዝዙ።", "so": "Ilaahna waa u duceeyey oo wuxuu ku yidhi, Wax badan dhala oo tarma, oo buuxiya dhulka oo xukuma. Xukuma kalluunka badda, iyo shimbirraha cirka, iyo uun kasta oo nool ee dhulka gurguurta."}'::jsonb),
    (genesis_1_chapter_id, 29, '{"am": "እግዚአብሔርም፤ እነሆ በምድር ገጽ ላይ ያለውን ሁሉ ሣር ዘር የሚዘራንና ፍሬ ዘር ያለበትን የሚያፈራ ዕፀ ሁሉ ሰጣችኋለሁ፤ ለእናንተም ለምግብ ይሆናሉ አላቸው።", "en": "Then God said, I give you every seed-bearing plant on the face of the whole earth and every tree that has fruit with seed in it. They will be yours for food.", "or": "Waaqnis akkana jedhe; Kunoo, ani biqiltuu sanyii baasu kan lafa hunda irra jiru hunda, muka firii sanyii of keessaa qabu hunda isinii kenne; isaan nyaata keessan taʼu.", "ti": "እግዚኣብሔር ድማ፡ እንሆ ሃበኩኹም ብኵሉ ገጽ ምድሪ ዘሎ ኵሉ ዘመቐሊ ኣፍራሕቲ ዝዕቕቦ ፍረ ዘፍረየ ዅሉ እምባ፤ ንስኻትኩም ንምግብ ይኹን በሎም።", "so": "Ilaahna wuxuu yidhi, Bal eega, waxaan idin siinayaa geed kasta oo iniinole ah oo ku yaal dhulka dushiisa oo dhan, iyo geed kasta oo midho dhalaya oo iniinu ku jiro. Iyagu cunto bay idiin ahaan doonaan."}'::jsonb),
    (genesis_1_chapter_id, 30, '{"am": "ለምድርም አራዊት ሁሉ፥ ለሰማይም አእዋፍ ሁሉ፥ በምድርም ላይ ለሚንቀሳቀሱ ሁሉ ለሕያው ነፍስ ያለው ሁሉ ሣር ሁሉ ለምግብ ይሆናል አለ። እንዲሁም ሆነ።", "en": "And to all the beasts of the earth and all the birds in the sky and all the creatures that move along the ground—everything that has the breath of life in it—I give every green plant for food. And it was so.", "or": "Bineensota lafa hundaaf, simbirroo samii hundaaf, waan lafa irra looʼu hunda keessaa waan hafuurri jireenyaa keessa jiru hundaaf immoo biqiltuu magariisa hunda nyaataaf kenne jedhe; akkanaanis taʼe.", "ti": "ንዅሎም ኣራዊት መሬትን ንዅሎም ኣዕዋፍ ሰማይን ንዅሎም ዝረግጽ መሬት ዘለዎም ህያው ዘለዎም ነፋስ ህይወት፤ ዅሉ ሳዕሪ ለምለም ንምግብ ሃብክዎም በሃሎም፤ ከምኡ ድማ ኮነ።", "so": "Oo waxaan u siinayaa dugaagga dhulka oo dhan, iyo shimbirraha cirka oo dhan, iyo wax kasta oo dhulka gurguurta oo neef nool leh, geed kasta oo cagaaran ah inay cunto u ahaadaan. Sidaasna waa noqotay."}'::jsonb),
    (genesis_1_chapter_id, 31, '{"am": "እግዚአብሔርም ያደረገውን ሁሉ አየ፤ እነሆም እጅግ መልካም ነበረ። ማታም ሆነ ጠዋትም ስድስተኛው ቀን ሆነ።", "en": "God saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day.", "or": "Waaqnis waan hojjete hunda ni ilaale; kunoo baayʼee gaarii ture. Galgala fi ganama taʼe; guyyaa jaʼaffaa taʼe.", "ti": "እግዚኣብሔር ዝገበሮ ዅሉ ርእዩ፤ እንሆ ኣዝዩ ጽቡቕ ነበረ። ምሸትን ጽባሕን ሻድሻይ መዓልቲ ኮነ።", "so": "Ilaahna wuxuu arkay wixii uu sameeyey oo dhan, oo wuxuu arkay inay aad u wanaagsan yihiin. Oo waxaa jiray fiid iyo subax, maalintii lixaad."}'::jsonb);
  END IF;

  -- Matthew 5:16 (Sermon on the Mount)
  SELECT c.id INTO matthew_5_chapter_id
  FROM public.bible_chapters c
  JOIN public.bible_books b ON c.book_id = b.id
  WHERE b.book_number = 54 AND c.chapter_number = 5;
  
  IF matthew_5_chapter_id IS NOT NULL THEN
    INSERT INTO public.bible_verses (chapter_id, verse_number, text) VALUES
    (matthew_5_chapter_id, 16, '{"am": "እንደዚሁ ብርሃናችሁ በሰዎች ፊት ያብራ፤ መልካም ሥራችሁን ተመልክተው፣ በሰማያት ያለን አባታችሁን ያከብሩት።", "en": "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.", "or": "Akkasuma ifni keessan fuula namoota dura haa ifu, akka isaan hojii gaarii keessan arguudhaanii Abbaa keessan kan samii keessa jiru kabajan.", "ti": "ከምኡውን ብርሃንኩም ኣብ ቅድሚ ሰባት ይብራህ፣ ከምዝኾነ ድማ ጽቡቕ ግብርኹም ርእዮም ኣብ ሰማይ ዘሎ ኣቦኹም ይኸብሩ።", "so": "Sidaas oo kale iftiinkaagu ha u dhalaalo dadka hortooda, si ay u arkaan shuqulkaaga wanaagsan oo ay u ammaanaan Aabbahaaga jannada ku jira."}'::jsonb);
  END IF;

  -- Romans 8:28
  SELECT c.id INTO romans_8_chapter_id
  FROM public.bible_chapters c
  JOIN public.bible_books b ON c.book_id = b.id
  WHERE b.book_number = 59 AND c.chapter_number = 8;
  
  IF romans_8_chapter_id IS NOT NULL THEN
    INSERT INTO public.bible_verses (chapter_id, verse_number, text) VALUES
    (romans_8_chapter_id, 28, '{"am": "እግዚአብሔርን ለሚወድዱና በዓላማው ለተጠሩ ሁሉ፣ በሁሉ ነገር ላይ ያለው ሁሉ ነገር ለበጎ ይሆናል።", "en": "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", "or": "Kana hundaa keessatti Waaqni warra isa jaallataniif, warra kaayyoo isaatiin waamaman hundaaf gaarummaadhaan akka hojjetu ni beekna.", "ti": "ኩሉ ነገር ንዝፈትውዎ ነገር፣ ብመሰረት ዕላማኡ ንተጸዊዖም፣ ንጽቡቕ ከምዝሰርሕ ንፈልጥ።", "so": "Waannu og nahay in Ilaah wax walba u shaqeeyo wanaagga kuwa isaga jecel, kuwaasoo loogu yeedhay sida qasdiga uu leeyahay."}'::jsonb);
  END IF;

  -- Proverbs 3:5-6
  SELECT c.id INTO proverbs_3_chapter_id
  FROM public.bible_chapters c
  JOIN public.bible_books b ON c.book_id = b.id
  WHERE b.book_number = 20 AND c.chapter_number = 3;
  
  IF proverbs_3_chapter_id IS NOT NULL THEN
    INSERT INTO public.bible_verses (chapter_id, verse_number, text) VALUES
    (proverbs_3_chapter_id, 5, '{"am": "በሙሉ ልብህ በእግዚአብሔር እመን፤ በራስህ ግንዛቤ ግን አትታመን።", "en": "Trust in the Lord with all your heart and lean not on your own understanding.", "or": "Gooftaa yaada kee guutuudhaan amanadhu; hubannaa kee mataa keetii irratti hin hirkatiin.", "ti": "ብዅሉ ልብኻ እግዚአብሔር ተኣማመን፣ ኣብ ርድኢትካ ግና ኣይትድገፍ።", "so": "Rabbiga qalbigaaga oo dhan ku aamin, fahamkaagana ha ku tiirsan."}'::jsonb),
    (proverbs_3_chapter_id, 6, '{"am": "በምታደርጋቸው ሁሉ አውቅ፤ እርሱም መንገድህን ቀጥ ያደርጋል።", "en": "In all your ways submit to him, and he will make your paths straight.", "or": "Karaa kee hunda keessatti isa beeki; innis daandii kee sirreessa.", "ti": "ኩሉ መገድኻ ኣፍልጦ፣ ንሱ ድማ መገድኻ የቀጥር።", "so": "Jidadkaaga oo dhan aqoonso, isna wuxuu ku toosin doonaa waddadaada."}'::jsonb);
  END IF;

  -- Isaiah 40:31
  SELECT c.id INTO isaiah_40_chapter_id
  FROM public.bible_chapters c
  JOIN public.bible_books b ON c.book_id = b.id
  WHERE b.book_number = 23 AND c.chapter_number = 40;
  
  IF isaiah_40_chapter_id IS NOT NULL THEN
    INSERT INTO public.bible_verses (chapter_id, verse_number, text) VALUES
    (isaiah_40_chapter_id, 31, '{"am": "እግዚአብሔርን የሚተማመኑ ግን ኃይላቸው ይታደሳል። እንደ ንስር ክንፋቸውን ይዘርዝራሉ፤ ይሮጣሉ ግን አይደክሙም፤ ይሄዳሉ ግን አይደክሙም።", "en": "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.", "or": "Warri Gooftaa abdatan garuu humna isaanii ni haaromsu. Akka risaa qoochoo isaanii diriirsu; ni fiigan garuu hin dadhabani; ni deeman garuu hin gatatan.", "ti": "እቶም ንእግዚአብሔር ዝተኣማመኑ ግን ሓይሎም ይሐድስ፣ ከም ንስሪ ኣኽናፎም ይዝርግሑ፣ ይጎዩ ግን ኣይድኽሙን፣ ይኸዱ ግን ኣይደኽሙን።", "so": "Laakiin kuwa Rabbiga rajaynaya ayaa xooggooda cusboonaysiisan doona, waxay u duuli doonaan sidii gorgorka, way ordi doonaan oo ma daali doonaan, way socon doonaan oo ma itaali doonaan."}'::jsonb);
  END IF;

  -- Philippians 4:13
  SELECT c.id INTO philippians_4_chapter_id
  FROM public.bible_chapters c
  JOIN public.bible_books b ON c.book_id = b.id
  WHERE b.book_number = 64 AND c.chapter_number = 4;
  
  IF philippians_4_chapter_id IS NOT NULL THEN
    INSERT INTO public.bible_verses (chapter_id, verse_number, text) VALUES
    (philippians_4_chapter_id, 13, '{"am": "በሚያጠንከረኝ በክርስቶስ በሁሉ ነገር እችላለሁ።", "en": "I can do all this through him who gives me strength.", "or": "Waan hunda isa na jabeessu sana keessatti nan dandaʼa.", "ti": "ንሱ ዝሓየለኒ ብኣቱ ደኣ ብዅሉ ነገር ክኽእል እኽእል።", "so": "Wax walba waan ku samayn karaa kan xoog i siiya."}'::jsonb);
  END IF;

END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bible_books_book_number ON public.bible_books(book_number);
CREATE INDEX IF NOT EXISTS idx_bible_chapters_book_chapter ON public.bible_chapters(book_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_bible_verses_chapter_verse ON public.bible_verses(chapter_id, verse_number);

-- Add comment
COMMENT ON TABLE public.bible_books IS 'Ethiopian Orthodox Tewahedo Bible books (81 books)';
