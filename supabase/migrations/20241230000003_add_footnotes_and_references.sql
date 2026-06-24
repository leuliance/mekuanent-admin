-- Add footnotes and cross_references tables

-- Drop existing tables if they exist (for clean reset)
DROP TABLE IF EXISTS public.bible_cross_references CASCADE;
DROP TABLE IF EXISTS public.bible_footnotes CASCADE;

-- Footnotes table with JSONB for translations
CREATE TABLE IF NOT EXISTS public.bible_footnotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  verse_id UUID REFERENCES public.bible_verses(id) ON DELETE CASCADE NOT NULL,
  marker JSONB NOT NULL, -- Multilingual markers like {"en": "a", "am": "ሀ", "or": "a", "ti": "ሀ", "so": "a"}
  note JSONB NOT NULL, -- Multilingual footnotes
  type VARCHAR(30) DEFAULT 'textual' CHECK (type IN ('textual', 'cross_reference', 'alternate_translation', 'cultural')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Cross references table with JSONB for references and descriptions
CREATE TABLE IF NOT EXISTS public.bible_cross_references (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  verse_id UUID REFERENCES public.bible_verses(id) ON DELETE CASCADE NOT NULL,
  reference JSONB NOT NULL, -- Multilingual reference like {"en": "John 1:1", "am": "ዮሐንስ 1:1"}
  reference_book_id UUID REFERENCES public.bible_books(id) ON DELETE CASCADE, -- Direct book reference for parsing
  reference_chapter INTEGER, -- Chapter number
  reference_verse_start INTEGER, -- Starting verse number
  reference_verse_end INTEGER, -- Ending verse number (optional)
  description JSONB, -- Optional multilingual description
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bible_footnotes_verse_id ON public.bible_footnotes(verse_id);
CREATE INDEX IF NOT EXISTS idx_bible_cross_references_verse_id ON public.bible_cross_references(verse_id);

-- Enable RLS
ALTER TABLE public.bible_footnotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_cross_references ENABLE ROW LEVEL SECURITY;

-- Create policies for read access
CREATE POLICY "Enable read access for all users" ON public.bible_footnotes
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.bible_cross_references
  FOR SELECT USING (true);

-- Add sample footnotes and cross-references for Genesis 1
DO $$
DECLARE
  v_genesis_book_id UUID;
  v_genesis_chapter_id UUID;
  v_verse_1_id UUID;
  v_verse_2_id UUID;
  v_verse_3_id UUID;
  v_verse_5_id UUID;
  v_verse_26_id UUID;
  v_verse_27_id UUID;
  -- Book IDs for cross-references
  v_john_book_id UUID;
  v_hebrews_book_id UUID;
  v_psalm_book_id UUID;
  v_corinthians_book_id UUID;
  v_matthew_book_id UUID;
  v_colossians_book_id UUID;
BEGIN
  -- Get book IDs
  SELECT id INTO v_genesis_book_id FROM public.bible_books WHERE name->>'en' = 'Genesis';
  SELECT id INTO v_john_book_id FROM public.bible_books WHERE name->>'en' = 'John';
  SELECT id INTO v_hebrews_book_id FROM public.bible_books WHERE name->>'en' = 'Hebrews';
  SELECT id INTO v_psalm_book_id FROM public.bible_books WHERE name->>'en' = 'Psalms';
  SELECT id INTO v_corinthians_book_id FROM public.bible_books WHERE name->>'en' = '2 Corinthians';
  SELECT id INTO v_matthew_book_id FROM public.bible_books WHERE name->>'en' = 'Matthew';
  SELECT id INTO v_colossians_book_id FROM public.bible_books WHERE name->>'en' = 'Colossians';
  
  -- Get Genesis Chapter 1 ID
  SELECT id INTO v_genesis_chapter_id FROM public.bible_chapters WHERE book_id = v_genesis_book_id AND chapter_number = 1;
  
  -- Get specific verse IDs
  SELECT id INTO v_verse_1_id FROM public.bible_verses WHERE chapter_id = v_genesis_chapter_id AND verse_number = 1;
  SELECT id INTO v_verse_2_id FROM public.bible_verses WHERE chapter_id = v_genesis_chapter_id AND verse_number = 2;
  SELECT id INTO v_verse_3_id FROM public.bible_verses WHERE chapter_id = v_genesis_chapter_id AND verse_number = 3;
  SELECT id INTO v_verse_5_id FROM public.bible_verses WHERE chapter_id = v_genesis_chapter_id AND verse_number = 5;
  SELECT id INTO v_verse_26_id FROM public.bible_verses WHERE chapter_id = v_genesis_chapter_id AND verse_number = 26;
  SELECT id INTO v_verse_27_id FROM public.bible_verses WHERE chapter_id = v_genesis_chapter_id AND verse_number = 27;
  
  -- Add comprehensive footnotes for Genesis 1 (sequential markers across chapter with multilingual markers)
  IF v_verse_1_id IS NOT NULL THEN
    INSERT INTO public.bible_footnotes (verse_id, marker, note, type) VALUES
    (v_verse_1_id, '{"en": "a", "am": "ሀ", "or": "a", "ti": "ሀ", "so": "a"}'::jsonb, '{"en": "Or In the beginning when God created or When God began to create", "am": "ወይም በመጀመሪያ ጊዜ ፈጣሪ ሲፈጥር", "or": "Yookiin jalqaba yeroo Waaqni uume", "ti": "ወይከ ኣብ መጀመርታ እንከሎ እግዚኣብሔር ሰሪሑ", "so": "Ama Bilowgii Ilaah markuu abuuray"}'::jsonb, 'alternate_translation');
  END IF;
  
  IF v_verse_2_id IS NOT NULL THEN
    INSERT INTO public.bible_footnotes (verse_id, marker, note, type) VALUES
    (v_verse_2_id, '{"en": "b", "am": "ለ", "or": "b", "ti": "ለ", "so": "b"}'::jsonb, '{"en": "Or possibly became", "am": "ወይም ምናልባት ሆነች", "or": "Yookiin taate", "ti": "ወይከ ምናልባት ኮነት", "so": "Ama noqotay"}'::jsonb, 'alternate_translation'),
    (v_verse_2_id, '{"en": "c", "am": "ሐ", "or": "c", "ti": "ሐ", "so": "c"}'::jsonb, '{"en": "Or Spirit of God was hovering over", "am": "ወይም የእግዚአብሔር መንፈስ ላይ ነበረ", "or": "Yookiin Hafuurri Waaqaa irra hovering", "ti": "ወይከ መንፈስ እግዚኣብሔር ላዕሊ ነበረ", "so": "Ama Ruuxa Ilaah kor u socday"}'::jsonb, 'alternate_translation');
  END IF;
  
  IF v_verse_5_id IS NOT NULL THEN
    INSERT INTO public.bible_footnotes (verse_id, marker, note, type) VALUES
    (v_verse_5_id, '{"en": "d", "am": "መ", "or": "d", "ti": "መ", "so": "d"}'::jsonb, '{"en": "Or evening came, and morning came, the first day", "am": "ወይም ማታ መጣ እና ጠዋት መጣ የመጀመሪያው ቀን", "or": "Yookiin galgala dhufee fi ganaama dhufee guyyaa jalqabaa", "ti": "ወይከ ምሸት መጸ እሞ ጽባሕ መጸ ቀዳማይ መዓልቲ", "so": "Ama fiidkii dhacay oo subaxii dhacay maalintii kowaad"}'::jsonb, 'alternate_translation');
  END IF;
  
  IF v_verse_26_id IS NOT NULL THEN
    INSERT INTO public.bible_footnotes (verse_id, marker, note, type) VALUES
    (v_verse_26_id, '{"en": "e", "am": "ሠ", "or": "e", "ti": "ሠ", "so": "e"}'::jsonb, '{"en": "Probable reading of the original Hebrew text; Masoretic Text the earth", "am": "የመጀመሪያው የዕብራይስጥ ጽሑፍ ተገቢ ንባብ፤ ማሶሬቲክ ጽሑፍ ምድሩን", "or": "Dubbisa sirrii barreeffama Ibrii jalqabaa; Barreeffamni Masoretic lafa", "ti": "ብርቱዕ ንባብ ጥንታዊ ዕብራይስጥ ጽሑፍ፤ ጽሑፍ ማሶሬቲክ ምድሪ", "so": "Akhris saxda ah qoraalka asalka ah ee Cibraaniga; Qoraalka Masoretic dhulka"}'::jsonb, 'textual');
  END IF;
  
  IF v_verse_27_id IS NOT NULL THEN
    INSERT INTO public.bible_footnotes (verse_id, marker, note, type) VALUES
    (v_verse_27_id, '{"en": "f", "am": "ረ", "or": "f", "ti": "ረ", "so": "f"}'::jsonb, '{"en": "Or man; Hebrew adam", "am": "ወይም ሰው፤ ዕብራይስጥ አዳም", "or": "Yookiin nama; Ibrii adam", "ti": "ወይከ ሰብ፤ ዕብራይስጥ አዳም", "so": "Ama nin; Cibraani adam"}'::jsonb, 'textual');
  END IF;
  
  -- Add comprehensive cross-references for Genesis 1
  IF v_verse_1_id IS NOT NULL THEN
    INSERT INTO public.bible_cross_references (verse_id, reference, reference_book_id, reference_chapter, reference_verse_start, reference_verse_end, description) VALUES
    (v_verse_1_id, '{"en": "John 1:1-3", "am": "ዮሐንስ 1:1-3", "or": "Yohaannis 1:1-3", "ti": "ዮሐንስ 1:1-3", "so": "Yooxanaa 1:1-3"}'::jsonb, v_john_book_id, 1, 1, 3, '{"en": "The Word was with God in the beginning", "am": "ቃሉ በመጀመሪያ ከእግዚአብሔር ጋር ነበረ", "or": "Dubbiin jalqaba irratti Waaqa bira ture", "ti": "ቃሉ ኣብ መጀመርታ ምስ እግዚኣብሔር ነበረ", "so": "Eraygu wuxuu la jiray Ilaah bilowgii"}'::jsonb),
    (v_verse_1_id, '{"en": "Hebrews 11:3", "am": "ዕብራውያን 11:3", "or": "Ibroota 11:3", "ti": "ዕብራውያን 11:3", "so": "Cibraaniyada 11:3"}'::jsonb, v_hebrews_book_id, 11, 3, NULL, '{"en": "By faith we understand the universe was created by God", "am": "በእምነት ዓለም በእግዚአብሔር እንደተፈጠረ እንረዳለን", "or": "Amanamummaadhaan akka addunyaan Waaqaan uumamte ni hubanna", "ti": "ብእምነት ዓለም ብእግዚኣብሔር ከም እተፈጥረ ንርድእ", "so": "Rumaysadka ayaannu ku fahanay in caalamka uu Ilaah abuuray"}'::jsonb),
    (v_verse_1_id, '{"en": "Psalm 33:6", "am": "መዝሙር 33:6", "or": "Faarfannaa 33:6", "ti": "መዝሙር 33:6", "so": "Sabuurrada 33:6"}'::jsonb, v_psalm_book_id, 33, 6, NULL, '{"en": "By the word of the LORD the heavens were made", "am": "በእግዚአብሔር ቃል ሰማይ ተፈጠረ", "or": "Dubbii Gooftaatiin samiiwwan uumaman", "ti": "ብቃል እግዚኣብሔር ሰማያት ተፈጠሩ", "so": "Erayga Rabbiga ayaa samooyinka lagu sameeyey"}'::jsonb);
  END IF;
  
  IF v_verse_3_id IS NOT NULL THEN
    INSERT INTO public.bible_cross_references (verse_id, reference, reference_book_id, reference_chapter, reference_verse_start, reference_verse_end, description) VALUES
    (v_verse_3_id, '{"en": "2 Corinthians 4:6", "am": "2 ቆሮንቶስ 4:6", "or": "2 Qoronttoosa 4:6", "ti": "2 ቆሮንቶስ 4:6", "so": "2 Korintiyaansiinta 4:6"}'::jsonb, v_corinthians_book_id, 4, 6, NULL, '{"en": "God said, Let light shine out of darkness", "am": "እግዚአብሔር ብርሃን ከጨለማ እንዲወጣ ብሏል", "or": "Waaqni jedhe, Ifni dukkana keessaa haa baau", "ti": "እግዚኣብሔር በሃሊ፡ ብርሃን ካብ ጸልማት ይወጽእ", "so": "Ilaah wuxuu yidhi, Iftiinka ha ka soo baxo gudcurka"}'::jsonb),
    (v_verse_3_id, '{"en": "Psalm 33:9", "am": "መዝሙር 33:9", "or": "Faarfannaa 33:9", "ti": "መዝሙር 33:9", "so": "Sabuurrada 33:9"}'::jsonb, v_psalm_book_id, 33, 9, NULL, '{"en": "For he spoke, and it came to be", "am": "ተናግሮ ሆነ", "or": "Inni dubbate; taʼe", "ti": "ተዛረበ፤ ኮነ", "so": "Waayo, wuu hadlay, oo waa noqotay"}'::jsonb);
  END IF;
  
  IF v_verse_26_id IS NOT NULL THEN
    INSERT INTO public.bible_cross_references (verse_id, reference, reference_book_id, reference_chapter, reference_verse_start, reference_verse_end, description) VALUES
    (v_verse_26_id, '{"en": "Genesis 5:1", "am": "ዘፍጥረት 5:1", "or": "Uumama 5:1", "ti": "ዘፍጥረት 5:1", "so": "Bilowga 5:1"}'::jsonb, v_genesis_book_id, 5, 1, NULL, '{"en": "When God created mankind, he made them in his likeness", "am": "እግዚአብሔር ሰውን ሲፈጥር በእርሱ መሰል አደረጋቸው", "or": "Waaqni yeroo namoomaa uume, fakkeenyuma isaatiin isaan uume", "ti": "እግዚኣብሔር ሰብ ክፈጥር ብመሰሉ ገበሮም", "so": "Markii Ilaah dadka abuuray, wuxuu ku abuuray muuqaalkiisa"}'::jsonb),
    (v_verse_26_id, '{"en": "Genesis 9:6", "am": "ዘፍጥረት 9:6", "or": "Uumama 9:6", "ti": "ዘፍጥረት 9:6", "so": "Bilowga 9:6"}'::jsonb, v_genesis_book_id, 9, 6, NULL, '{"en": "For in the image of God has God made mankind", "am": "እግዚአብሔር ሰውን በእግዚአብሔር ምስል ፈጠረ", "or": "Waaqni bifa Waaqaatiin namoota uumeera", "ti": "እግዚኣብሔር ሰብ ብምስሊ እግዚኣብሔር ፈጠረ", "so": "Waayo, Ilaah dadka wuxuu ku abuuray muuqaalka Ilaah"}'::jsonb),
    (v_verse_26_id, '{"en": "Psalm 8:5-8", "am": "መዝሙር 8:5-8", "or": "Faarfannaa 8:5-8", "ti": "መዝሙር 8:5-8", "so": "Sabuurrada 8:5-8"}'::jsonb, v_psalm_book_id, 8, 5, 8, '{"en": "You made them rulers over the works of your hands", "am": "በእጅህ ሥራ ላይ አስተዳዳሪ አደረግሃቸው", "or": "Hojii harka keetii irratti isaan bulchituu goote", "ti": "ኣብ ግብሪ ኢድካ መሓዛይ ገበርካዮም", "so": "Waxaad ka dhigtay inay u taliyaan shuqulka gacmahaaga"}'::jsonb);
  END IF;
  
  IF v_verse_27_id IS NOT NULL THEN
    INSERT INTO public.bible_cross_references (verse_id, reference, reference_book_id, reference_chapter, reference_verse_start, reference_verse_end, description) VALUES
    (v_verse_27_id, '{"en": "Genesis 5:2", "am": "ዘፍጥረት 5:2", "or": "Uumama 5:2", "ti": "ዘፍጥረት 5:2", "so": "Bilowga 5:2"}'::jsonb, v_genesis_book_id, 5, 2, NULL, '{"en": "Male and female he created them", "am": "ወንድና ሴት ፈጠራቸው", "or": "Dhiiraa fi dubartii isaan uume", "ti": "ተባዕታይን ኣንስተይትን ፈጠሮም", "so": "Lab iyo dhadig buu u abuuray"}'::jsonb),
    (v_verse_27_id, '{"en": "Matthew 19:4", "am": "ማቴዎስ 19:4", "or": "Maatewos 19:4", "ti": "ማቴዎስ 19:4", "so": "Matayos 19:4"}'::jsonb, v_matthew_book_id, 19, 4, NULL, '{"en": "At the beginning the Creator made them male and female", "am": "ፈጣሪው በመጀመሪያ ወንድና ሴት እንደፈጠራቸው", "or": "Uumaan jalqaba irratti dhiiraa fi dubartii isaan uume", "ti": "ፈጣሪ ኣብ መጀመርታ ተባዕታይን ኣንስተይትን ገበሮም", "so": "Bilowgii Abuuruhu lab iyo dhadig u abuuray"}'::jsonb),
    (v_verse_27_id, '{"en": "Colossians 3:10", "am": "ቆላስይስ 3:10", "or": "Qolaasiyaas 3:10", "ti": "ቆላስይስ 3:10", "so": "Kolosiyaansiinta 3:10"}'::jsonb, v_colossians_book_id, 3, 10, NULL, '{"en": "Put on the new self, which is being renewed in the image of its Creator", "am": "አዲሱን ሰው ለብሱ በፈጣሪው ምስል እየታደሰ ያለውን", "or": "Nama haaraa uffadhaa kan bifa Uumaa isaatiin haaromfamu", "ti": "ሓድሽ ሰብ ልበሱ ብምስሊ ፈጣሪኡ እናሐደሰ ዘሎ", "so": "Qaado nafta cusub oo lagu cusboonaysiin muuqaalka Abuurihiisa"}'::jsonb);
  END IF;

END $$;
