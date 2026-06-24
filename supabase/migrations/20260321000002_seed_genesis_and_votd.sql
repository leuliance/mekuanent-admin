-- ==========================================================================
-- SEED: Genesis (50 chapters) + Verse of the Day
-- Populates chapters, verses with Amharic + English text
-- ==========================================================================

DO $$
DECLARE
    v_book_id UUID;
    v_ch_id UUID;
    v_verse_id UUID;
    v_ch INT;
BEGIN

SELECT id INTO v_book_id FROM bible_books WHERE paratext_code = 'GEN';

IF v_book_id IS NULL THEN
    RAISE EXCEPTION 'Genesis book not found — run the schema rebuild migration first';
END IF;

-- Skip if already seeded
IF EXISTS (SELECT 1 FROM bible_chapters WHERE book_id = v_book_id LIMIT 1) THEN
    RAISE NOTICE 'Genesis chapters already exist, skipping';
    RETURN;
END IF;

-- =========================================================================
-- Chapter 1 (31 verses)
-- =========================================================================
INSERT INTO bible_chapters (book_id, chapter_number, verse_count)
VALUES (v_book_id, 1, 31)
RETURNING id INTO v_ch_id;

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
(v_ch_id, 1,  '{"am":"በመጀመሪያ እግዚአብሔር ሰማይንና ምድርን ፈጠረ።","en":"In the beginning God created the heavens and the earth."}'),
(v_ch_id, 2,  '{"am":"ምድርም ባዶና ጠፍ ነበረች፤ ጨለማም ከጥልቁ ላይ ነበረ፤ የእግዚአብሔርም መንፈስ በውኃ ላይ ያንዣብብ ነበር።","en":"Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters."}'),
(v_ch_id, 3,  '{"am":"እግዚአብሔርም፦ ብርሃን ይሁን አለ፤ ብርሃንም ሆነ።","en":"And God said, \"Let there be light,\" and there was light."}'),
(v_ch_id, 4,  '{"am":"እግዚአብሔርም ብርሃኑ መልካም እንደ ሆነ አየ፤ እግዚአብሔርም ብርሃኑን ከጨለማው ለየ።","en":"God saw that the light was good, and he separated the light from the darkness."}'),
(v_ch_id, 5,  '{"am":"እግዚአብሔርም ብርሃኑን ቀን ብሎ ጠራው፤ ጨለማውንም ሌሊት ብሎ ጠራው። ማታም ሆነ ጥዋትም ሆነ፤ አንድ ቀን።","en":"God called the light \"day,\" and the darkness he called \"night.\" And there was evening, and there was morning—the first day."}'),
(v_ch_id, 6,  '{"am":"እግዚአብሔርም፦ በውኃ መካከል ጠፈር ይሁን፤ ውኃንም ከውኃ ይለይ አለ።","en":"And God said, \"Let there be a vault between the waters to separate water from water.\""}'),
(v_ch_id, 7,  '{"am":"እግዚአብሔርም ጠፈሩን አደረገ፤ ከጠፈሩ በታች ያለውን ውኃ ከጠፈሩ በላይ ካለው ውኃ ለየ፤ እንዲሁም ሆነ።","en":"So God made the vault and separated the water under the vault from the water above it. And it was so."}'),
(v_ch_id, 8,  '{"am":"እግዚአብሔርም ጠፈሩን ሰማይ ብሎ ጠራው። ማታም ሆነ ጥዋትም ሆነ፤ ሁለተኛ ቀን።","en":"God called the vault \"sky.\" And there was evening, and there was morning—the second day."}'),
(v_ch_id, 9,  '{"am":"እግዚአብሔርም፦ ከሰማይ በታች ያለው ውኃ በአንድ ስፍራ ይሰበሰብ፤ ደረቅም ይታይ አለ፤ እንዲሁም ሆነ።","en":"And God said, \"Let the water under the sky be gathered to one place, and let dry ground appear.\" And it was so."}'),
(v_ch_id, 10, '{"am":"እግዚአብሔርም ደረቁን ምድር ብሎ ጠራው፤ የተሰበሰበውንም ውኃ ባሕር ብሎ ጠራው፤ እግዚአብሔርም መልካም እንደ ሆነ አየ።","en":"God called the dry ground \"land,\" and the gathered waters he called \"seas.\" And God saw that it was good."}'),
(v_ch_id, 11, '{"am":"እግዚአብሔርም፦ ምድር ሣር፣ ዘር የሚያፈራ ቡቃያ፣ በምድር ላይ ዘሩ በውስጡ ያለው ፍሬ በየወገኑ የሚያፈራ ዛፍ ያብቅል አለ፤ እንዲሁም ሆነ።","en":"Then God said, \"Let the land produce vegetation: seed-bearing plants and trees on the land that bear fruit with seed in it, according to their various kinds.\" And it was so."}'),
(v_ch_id, 12, '{"am":"ምድርም ሣር፣ ዘር በየወገኑ የሚያፈራ ቡቃያ፣ ዘሩ በውስጡ ያለው ፍሬ በየወገኑ የሚያፈራ ዛፍ አበቀለች፤ እግዚአብሔርም መልካም እንደ ሆነ አየ።","en":"The land produced vegetation: plants bearing seed according to their kinds and trees bearing fruit with seed in it according to their kinds. And God saw that it was good."}'),
(v_ch_id, 13, '{"am":"ማታም ሆነ ጥዋትም ሆነ፤ ሦስተኛ ቀን።","en":"And there was evening, and there was morning—the third day."}'),
(v_ch_id, 14, '{"am":"እግዚአብሔርም፦ ቀንን ከሌሊት ለመለየት በሰማይ ጠፈር ብርሃናት ይሁኑ፤ ለምልክትና ለወቅት ለቀንና ለዓመት ይሁኑ አለ።","en":"And God said, \"Let there be lights in the vault of the sky to separate the day from the night, and let them serve as signs to mark sacred times, and days and years.\""}'),
(v_ch_id, 15, '{"am":"በምድርም ላይ ለማብራት በሰማይ ጠፈር ላይ ብርሃናት ይሁኑ አለ፤ እንዲሁም ሆነ።","en":"\"and let them be lights in the vault of the sky to give light on the earth.\" And it was so."}'),
(v_ch_id, 16, '{"am":"እግዚአብሔርም ሁለቱን ታላላቅ ብርሃናት አደረገ፤ ትልቁን ብርሃን ቀንን ይገዛ ዘንድ ትንሹንም ብርሃን ሌሊትን ይገዛ ዘንድ፤ ከዋክብትንም አደረገ።","en":"God made two great lights—the greater light to govern the day and the lesser light to govern the night. He also made the stars."}'),
(v_ch_id, 17, '{"am":"እግዚአብሔርም በምድር ላይ ያበሩ ዘንድ በሰማይ ጠፈር ላይ አኖራቸው።","en":"God set them in the vault of the sky to give light on the earth."}'),
(v_ch_id, 18, '{"am":"ቀንንና ሌሊትንም ይገዙ ዘንድ ብርሃኑንም ከጨለማው ይለዩ ዘንድ፤ እግዚአብሔርም መልካም እንደ ሆነ አየ።","en":"to govern the day and the night, and to separate light from darkness. And God saw that it was good."}'),
(v_ch_id, 19, '{"am":"ማታም ሆነ ጥዋትም ሆነ፤ አራተኛ ቀን።","en":"And there was evening, and there was morning—the fourth day."}'),
(v_ch_id, 20, '{"am":"እግዚአብሔርም፦ ውኃ ሕይወት ያላቸውን ተንቀሳቃሾች ያፍልቅ፤ ወፎችም ከምድር በላይ በሰማይ ጠፈር ላይ ይብረሩ አለ።","en":"And God said, \"Let the water teem with living creatures, and let birds fly above the earth across the vault of the sky.\""}'),
(v_ch_id, 21, '{"am":"እግዚአብሔርም ታላላቆቹን የባሕር እንስሳት ውኃ ያፈለቃቸውን ተንቀሳቃሾች ሕያዋን ሁሉ በየወገናቸው ክንፍ ያላቸውንም ወፎች ሁሉ በየወገናቸው ፈጠረ፤ እግዚአብሔርም መልካም እንደ ሆነ አየ።","en":"So God created the great creatures of the sea and every living thing with which the water teems and that moves about in it, according to their kinds, and every winged bird according to its kind. And God saw that it was good."}'),
(v_ch_id, 22, '{"am":"እግዚአብሔርም፦ ብዙ ተባዙ፤ የባሕርንም ውኃ ሙሉ፤ ወፎችም በምድር ላይ ይብዙ ብሎ ባረካቸው።","en":"God blessed them and said, \"Be fruitful and increase in number and fill the water in the seas, and let the birds increase on the earth.\""}'),
(v_ch_id, 23, '{"am":"ማታም ሆነ ጥዋትም ሆነ፤ አምስተኛ ቀን።","en":"And there was evening, and there was morning—the fifth day."}'),
(v_ch_id, 24, '{"am":"እግዚአብሔርም፦ ምድር ሕያዋንን በየወገናቸው እንስሳትን ተንቀሳቃሾችንና የምድር አራዊትን በየወገናቸው ታውጣ አለ፤ እንዲሁም ሆነ።","en":"And God said, \"Let the land produce living creatures according to their kinds: the livestock, the creatures that move along the ground, and the wild animals, each according to its kind.\" And it was so."}'),
(v_ch_id, 25, '{"am":"እግዚአብሔርም የምድር አራዊትን በየወገናቸው እንስሳትንም በየወገናቸው በምድር ላይ የሚንቀሳቀሱትንም ሁሉ በየወገናቸው አደረገ፤ እግዚአብሔርም መልካም እንደ ሆነ አየ።","en":"God made the wild animals according to their kinds, the livestock according to their kinds, and all the creatures that move along the ground according to their kinds. And God saw that it was good."}'),
(v_ch_id, 26, '{"am":"እግዚአብሔርም፦ ሰውን በመልካችን እንደ ምሳሌአችን እንፍጠር፤ የባሕርን ዓሦች የሰማይንም ወፎች እንስሳትንም ምድርንም ሁሉ በምድር ላይ የሚንቀሳቀሱትንም ሁሉ ይግዙ አለ።","en":"Then God said, \"Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground.\""}'),
(v_ch_id, 27, '{"am":"እግዚአብሔርም ሰውን በራሱ መልክ ፈጠረው፤ በእግዚአብሔር መልክ ፈጠረው፤ ወንድና ሴት አድርጎ ፈጠራቸው።","en":"So God created mankind in his own image, in the image of God he created them; male and female he created them."}'),
(v_ch_id, 28, '{"am":"እግዚአብሔርም ባረካቸው፤ እግዚአብሔርም፦ ብዙ ተባዙ ምድርንም ሙሉአት፤ ግዙአትም፤ የባሕርንም ዓሦች የሰማይንም ወፎች በምድር ላይ የሚንቀሳቀሱትንም ሕያዋን ሁሉ ግዙ አላቸው።","en":"God blessed them and said to them, \"Be fruitful and increase in number; fill the earth and subdue it. Rule over the fish in the sea and the birds in the sky and over every living creature that moves on the ground.\""}'),
(v_ch_id, 29, '{"am":"እግዚአብሔርም፦ እነሆ በምድር ሁሉ ላይ ያለውን ዘር የሚያፈራ ቡቃያ ሁሉ ዘር የሚያፈራ ፍሬ ያለውንም ዛፍ ሁሉ ሰጠኋችሁ፤ ለመብል ይሁናችሁ አለ።","en":"Then God said, \"I give you every seed-bearing plant on the face of the whole earth and every tree that has fruit with seed in it. They will be yours for food.\""}'),
(v_ch_id, 30, '{"am":"ለምድርም አራዊት ሁሉ ለሰማይም ወፎች ሁሉ ሕይወት ላለው በምድር ላይ ለሚንቀሳቀሰው ሁሉ ለምግብ የሚሆን ለምለም ቡቃያ ሁሉን ሰጠሁ አለ፤ እንዲሁም ሆነ።","en":"\"And to all the beasts of the earth and all the birds in the sky and all the creatures that move along the ground—everything that has the breath of life in it—I give every green plant for food.\" And it was so."}'),
(v_ch_id, 31, '{"am":"እግዚአብሔርም ያደረገውን ሁሉ አየ፤ እነሆም እጅግ መልካም ነበረ። ማታም ሆነ ጥዋትም ሆነ፤ ስድስተኛ ቀን።","en":"God saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day."}');

-- =========================================================================
-- Chapter 2 (25 verses)
-- =========================================================================
INSERT INTO bible_chapters (book_id, chapter_number, verse_count)
VALUES (v_book_id, 2, 25)
RETURNING id INTO v_ch_id;

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
(v_ch_id, 1,  '{"am":"ሰማይና ምድር ሠራዊታቸውም ሁሉ ተፈጸሙ።","en":"Thus the heavens and the earth were completed in all their vast array."}'),
(v_ch_id, 2,  '{"am":"እግዚአብሔርም ያደረገውን ሥራ በሰባተኛው ቀን ፈጸመ፤ ካደረገውም ሥራ ሁሉ በሰባተኛው ቀን ዐረፈ።","en":"By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work."}'),
(v_ch_id, 3,  '{"am":"እግዚአብሔርም ሰባተኛውን ቀን ባረከው ቀደሰውም፤ እግዚአብሔር ሊያደርገው ከፈጠረው ሥራ ሁሉ በእርሱ ዐርፎአልና።","en":"Then God blessed the seventh day and made it holy, because on it he rested from all the work of creating that he had done."}'),
(v_ch_id, 4,  '{"am":"የሰማይና የምድር ትውልድ በተፈጠሩ ጊዜ ይህ ነው። ጌታ እግዚአብሔር ምድርንና ሰማይን ባደረገ ቀን።","en":"This is the account of the heavens and the earth when they were created, when the LORD God made the earth and the heavens."}'),
(v_ch_id, 5,  '{"am":"ጌታ እግዚአብሔር በምድር ላይ ዝናም አላዘነመም ነበርና ምድርን የሚያርስም ሰው አልነበረም፤ የምድርም ቡቃያ ሁሉ ገና በምድር ላይ አልነበረም፤ የምድርም ሣር ሁሉ ገና አልበቀለም ነበር።","en":"Now no shrub had yet appeared on the earth and no plant had yet sprung up, for the LORD God had not sent rain on the earth and there was no one to work the ground."}'),
(v_ch_id, 6,  '{"am":"ጤዛ ግን ከምድር ይወጣ ነበር፤ የምድርንም ገጽ ሁሉ ያጠጣ ነበር።","en":"but streams came up from the earth and watered the whole surface of the ground."}'),
(v_ch_id, 7,  '{"am":"ጌታ እግዚአብሔርም ሰውን ከምድር አፈር አበጀው፤ በፊቱም የሕይወትን እስትንፋስ እፍ አለበት፤ ሰውም ሕያው ነፍስ ሆነ።","en":"Then the LORD God formed a man from the dust of the ground and breathed into his nostrils the breath of life, and the man became a living being."}'),
(v_ch_id, 8,  '{"am":"ጌታ እግዚአብሔርም በምሥራቅ በኤድን ገነት ተከለ፤ ያበጀውንም ሰው በዚያ አኖረው።","en":"Now the LORD God had planted a garden in the east, in Eden; and there he put the man he had formed."}'),
(v_ch_id, 9,  '{"am":"ጌታ እግዚአብሔርም ለማየት ያማረ ለመብልም የሚከጅል ዛፍ ሁሉ ከምድር አበቀለ፤ የሕይወትንም ዛፍ በገነት መካከል የመልካምንና የክፉን ዕውቀት ዛፍ አበቀለ።","en":"The LORD God made all kinds of trees grow out of the ground—trees that were pleasing to the eye and good for food. In the middle of the garden were the tree of life and the tree of the knowledge of good and evil."}'),
(v_ch_id, 10, '{"am":"ገነቱንም ያጠጣ ዘንድ ወንዝ ከኤድን ይወጣ ነበር፤ ከዚያም ተለይቶ አራት ወንዞች ሆነ።","en":"A river watering the garden flowed from Eden; from there it was separated into four headwaters."}'),
(v_ch_id, 11, '{"am":"የአንደኛው ስም ፊሶን ነው፤ እርሱ ወርቅ ያለበትን የኤውላጥን ምድር ሁሉ ይከብባል።","en":"The name of the first is the Pishon; it winds through the entire land of Havilah, where there is gold."}'),
(v_ch_id, 12, '{"am":"የዚያም ምድር ወርቅ ጥሩ ነው፤ በዚያም ሽቱ ከበረቴ ድንጋይም አለ።","en":"(The gold of that land is good; aromatic resin and onyx are also there.)"}'),
(v_ch_id, 13, '{"am":"የሁለተኛውም ወንዝ ስም ግዮን ነው፤ እርሱ የኢትዮጵያን ምድር ሁሉ ይከብባል።","en":"The name of the second river is the Gihon; it winds through the entire land of Cush."}'),
(v_ch_id, 14, '{"am":"የሦስተኛውም ወንዝ ስም ጤግሮስ ነው፤ እርሱ ከአሦር ምሥራቅ የሚሄድ ነው። አራተኛውም ወንዝ ኤፍራጥስ ነው።","en":"The name of the third river is the Tigris; it runs along the east side of Ashur. And the fourth river is the Euphrates."}'),
(v_ch_id, 15, '{"am":"ጌታ እግዚአብሔርም ሰውን ወስዶ ሊያርሳትና ሊጠብቃት በኤድን ገነት ውስጥ አኖረው።","en":"The LORD God took the man and put him in the Garden of Eden to work it and take care of it."}'),
(v_ch_id, 16, '{"am":"ጌታ እግዚአብሔርም ሰውን አዘዘው፤ እንዲህም አለው፦ ከገነት ዛፍ ሁሉ ትበላ ዘንድ ትበላለህ።","en":"And the LORD God commanded the man, \"You are free to eat from any tree in the garden.\""}'),
(v_ch_id, 17, '{"am":"ከመልካምና ከክፉ ዕውቀት ዛፍ ግን አትብላ፤ ከእርሱ በበላህ ቀን ሞትን ትሞታለህና።","en":"\"but you must not eat from the tree of the knowledge of good and evil, for when you eat from it you will certainly die.\""}'),
(v_ch_id, 18, '{"am":"ጌታ እግዚአብሔርም፦ ሰው ብቻውን ይሆን ዘንድ መልካም አይደለም፤ የሚመቸውን ረዳት እሠራለታለሁ አለ።","en":"The LORD God said, \"It is not good for the man to be alone. I will make a helper suitable for him.\""}'),
(v_ch_id, 19, '{"am":"ጌታ እግዚአብሔርም የምድርን አራዊት ሁሉ የሰማይንም ወፎች ሁሉ ከምድር አበጀ፤ ሰውም ምን እንደሚላቸው ለማየት ወደ ሰው አመጣቸው፤ ሰውም ሕያውን ነፍስ ሁሉ የጠራውን ያ ስሙ ሆነ።","en":"Now the LORD God had formed out of the ground all the wild animals and all the birds in the sky. He brought them to the man to see what he would name them; and whatever the man called each living creature, that was its name."}'),
(v_ch_id, 20, '{"am":"ሰውም ለእንስሳት ሁሉ ለሰማይም ወፎች ለምድርም አራዊት ሁሉ ስም አወጣ፤ ለሰው ግን የሚመቸው ረዳት አልተገኘለትም።","en":"So the man gave names to all the livestock, the birds in the sky and all the wild animals. But for Adam no suitable helper was found."}'),
(v_ch_id, 21, '{"am":"ጌታ እግዚአብሔርም ሰውን ጥልቅ እንቅልፍ አስተኛው፤ እንቅልፍም አደረበት፤ ከጎድን አጥንቶቹ አንዲቱን ወስዶ ሥጋ በምትካቸው ሞላ።","en":"So the LORD God caused the man to fall into a deep sleep; and while he was sleeping, he took one of the man''s ribs and then closed up the place with flesh."}'),
(v_ch_id, 22, '{"am":"ጌታ እግዚአብሔርም ከሰው ከወሰዳት ጎድን አጥንት ሴቲቱን ሠራ፤ ወደ ሰውም አመጣት።","en":"Then the LORD God made a woman from the rib he had taken out of the man, and he brought her to the man."}'),
(v_ch_id, 23, '{"am":"ሰውም፦ ይህች ከአጥንቶቼ አጥንት ከሥጋዬም ሥጋ ናት፤ ከሰው ተወስዳለችና ሴት ትባል አለ።","en":"The man said, \"This is now bone of my bones and flesh of my flesh; she shall be called ''woman,'' for she was taken out of man.\""}'),
(v_ch_id, 24, '{"am":"ስለዚህ ሰው አባቱንና እናቱን ይተዋል ከሚስቱም ጋር ይተባበራል፤ አንድ ሥጋም ይሆናሉ።","en":"That is why a man leaves his father and mother and is united to his wife, and they become one flesh."}'),
(v_ch_id, 25, '{"am":"ሁለቱም ሰውና ሚስቱ ዕራቁታቸውን ነበሩ፤ አይተፋፈሩምም ነበር።","en":"Adam and his wife were both naked, and they felt no shame."}');

-- =========================================================================
-- Chapter 3 (24 verses)
-- =========================================================================
INSERT INTO bible_chapters (book_id, chapter_number, verse_count)
VALUES (v_book_id, 3, 24)
RETURNING id INTO v_ch_id;

INSERT INTO bible_verses (chapter_id, verse_number, text) VALUES
(v_ch_id, 1,  '{"am":"እባቡም ጌታ እግዚአብሔር ከሠራቸው ከምድር አራዊት ሁሉ ይልቅ ተንኮለኛ ነበረ። ሴቲቱንም፦ እግዚአብሔር ከገነት ዛፍ ሁሉ አትብሉ ብሎ አዝዟልን? አላት።","en":"Now the serpent was more crafty than any of the wild animals the LORD God had made. He said to the woman, \"Did God really say, ''You must not eat from any tree in the garden''?\""}'),
(v_ch_id, 2,  '{"am":"ሴቲቱም ለእባቡ፦ ከገነት ዛፎች ፍሬ እንበላለን አለችው።","en":"The woman said to the serpent, \"We may eat fruit from the trees in the garden.\""}'),
(v_ch_id, 3,  '{"am":"ከገነት ግን መካከል ካለው ከዛፉ ፍሬ እግዚአብሔር፦ ከእርሱ አትብሉ፤ አትንኩትም፤ እንዳትሞቱ አለ።","en":"\"but God did say, ''You must not eat fruit from the tree that is in the middle of the garden, and you must not touch it, or you will die.''\""}'),
(v_ch_id, 4,  '{"am":"እባቡም ሴቲቱን፦ ሞትን አትሞቱም አላት።","en":"\"You will not certainly die,\" the serpent said to the woman."}'),
(v_ch_id, 5,  '{"am":"ከእርሱ በበላችሁ ቀን ዓይናችሁ እንዲከፈት እግዚአብሔር ያውቃልና፤ እንደ እግዚአብሔርም መልካምና ክፉን የምታውቁ ትሆናላችሁ።","en":"\"For God knows that when you eat from it your eyes will be opened, and you will be like God, knowing good and evil.\""}'),
(v_ch_id, 6,  '{"am":"ሴቲቱም ዛፉ ለመብል ያማረ ለዓይንም የሚያስጎመዥ ለጥበብም መልካም እንደ ሆነ አየች፤ ከፍሬውም ወስዳ በላች፤ ለባሏም ደግሞ ሰጠችው፤ እርሱም በላ።","en":"When the woman saw that the fruit of the tree was good for food and pleasing to the eye, and also desirable for gaining wisdom, she took some and ate it. She also gave some to her husband, who was with her, and he ate it."}'),
(v_ch_id, 7,  '{"am":"የሁለቱም ዓይኖች ተከፈቱ፤ ዕራቁታቸውንም እንደ ሆኑ አወቁ፤ የበለስንም ቅጠል ሰፍተው ወገብ ጠፍር አደረጉ።","en":"Then the eyes of both of them were opened, and they realized they were naked; so they sewed fig leaves together and made coverings for themselves."}'),
(v_ch_id, 8,  '{"am":"ጌታ እግዚአብሔርንም በቀኑ ቅዝቃዜ በገነት ውስጥ ሲሄድ ሰሙ፤ ሰውና ሚስቱም ከጌታ እግዚአብሔር ፊት በገነት ዛፎች መካከል ተሸሸጉ።","en":"Then the man and his wife heard the sound of the LORD God as he was walking in the garden in the cool of the day, and they hid from the LORD God among the trees of the garden."}'),
(v_ch_id, 9,  '{"am":"ጌታ እግዚአብሔርም ሰውን ጠርቶ፦ ወዴት ነህ? አለው።","en":"But the LORD God called to the man, \"Where are you?\""}'),
(v_ch_id, 10, '{"am":"እርሱም፦ በገነት ውስጥ ድምፅህን ሰማሁ፤ ዕራቁቴን ስለ ሆንሁ ፈራሁ፤ ተሸሸግሁም አለ።","en":"He answered, \"I heard you in the garden, and I was afraid because I was naked; so I hid.\""}'),
(v_ch_id, 11, '{"am":"እርሱም፦ ዕራቁትህን እንደ ሆንህ ማን ነገረህ? ከእርሱ እንዳትበላ ካዘዝሁህ ዛፍ በላህን? አለ።","en":"And he said, \"Who told you that you were naked? Have you eaten from the tree that I commanded you not to eat from?\""}'),
(v_ch_id, 12, '{"am":"ሰውም፦ ከእኔ ጋር ትሆን ዘንድ የሰጠኸኝ ሴቲቱ ከዛፉ ሰጠችኝ፤ በላሁም አለ።","en":"The man said, \"The woman you put here with me—she gave me some fruit from the tree, and I ate it.\""}'),
(v_ch_id, 13, '{"am":"ጌታ እግዚአብሔርም ሴቲቱን፦ ይህ ያደረግሽው ምንድር ነው? አላት። ሴቲቱም፦ እባቡ አሳተኝ፤ በላሁም አለች።","en":"Then the LORD God said to the woman, \"What is this you have done?\" The woman said, \"The serpent deceived me, and I ate.\""}'),
(v_ch_id, 14, '{"am":"ጌታ እግዚአብሔርም ለእባቡ፦ ይህን ስላደረግህ ከእንስሳት ሁሉ ከምድርም አራዊት ሁሉ ከተረገምህ፤ በሆድህ ትሄዳለህ አፈርንም ትበላለህ በሕይወትህ ዘመን ሁሉ አለ።","en":"So the LORD God said to the serpent, \"Because you have done this, cursed are you above all livestock and all wild animals! You will crawl on your belly and you will eat dust all the days of your life.\""}'),
(v_ch_id, 15, '{"am":"በአንተና በሴቲቱ መካከል በዘርህና በዘርዋ መካከል ጠላትነት አደርጋለሁ፤ እርሱ ራስህን ይቀጠቅጣል፤ አንተም ተረከዙን ትቀጠቅጣለህ።","en":"\"And I will put enmity between you and the woman, and between your offspring and hers; he will crush your head, and you will strike his heel.\""}'),
(v_ch_id, 16, '{"am":"ሴቲቱንም፦ መከራሽንና ፅንስሽን እጅግ አበዛለሁ፤ በመከራ ልጆች ትወልጃለሽ፤ ፈቃድሽም ወደ ባልሽ ይሆናል፤ እርሱም ይገዛሻል አላት።","en":"To the woman he said, \"I will make your pains in childbearing very severe; with painful labor you will give birth to children. Your desire will be for your husband, and he will rule over you.\""}'),
(v_ch_id, 17, '{"am":"ለሰውም፦ የሚስትህን ቃል ስለ ሰማህ ከእርሱ አትብላ ብዬ ካዘዝሁህ ዛፍም ስለ በላህ ምድር ከተረገመች ከአንተ የተነሣ፤ በሕይወትህ ዘመን ሁሉ በድካም ከእርስዋ ትበላለህ አለ።","en":"To Adam he said, \"Because you listened to your wife and ate fruit from the tree about which I commanded you, ''You must not eat from it,'' cursed is the ground because of you; through painful toil you will eat food from it all the days of your life.\""}'),
(v_ch_id, 18, '{"am":"እሾህና አሜከላ ታበቅልልሃለች፤ የምድርንም ቡቃያ ትበላለህ።","en":"\"It will produce thorns and thistles for you, and you will eat the plants of the field.\""}'),
(v_ch_id, 19, '{"am":"ወደ ተገኘሃት ምድር እስክትመለስ ድረስ በፊትህ ወዝ እንጀራህን ትበላለህ፤ አፈር ነህና ወደ አፈርም ትመለሳለህ።","en":"\"By the sweat of your brow you will eat your food until you return to the ground, since from it you were taken; for dust you are and to dust you will return.\""}'),
(v_ch_id, 20, '{"am":"ሰውም ሚስቱን ሔዋን ብሎ ጠራት፤ የሕያዋን ሁሉ እናት ናትና።","en":"Adam named his wife Eve, because she would become the mother of all the living."}'),
(v_ch_id, 21, '{"am":"ጌታ እግዚአብሔርም ለሰውና ለሚስቱ የቁርበት ልብስ ሠርቶ አለበሳቸው።","en":"The LORD God made garments of skin for Adam and his wife and clothed them."}'),
(v_ch_id, 22, '{"am":"ጌታ እግዚአብሔርም፦ እነሆ ሰው መልካምንና ክፉን ለማወቅ ከእኛ እንደ አንዱ ሆነ፤ አሁንም እጁን እንዳይዘረጋ ከሕይወት ዛፍም ወስዶ እንዳይበላ ለዘላለምም እንዳይኖር አለ።","en":"And the LORD God said, \"The man has now become like one of us, knowing good and evil. He must not be allowed to reach out his hand and take also from the tree of life and eat, and live forever.\""}'),
(v_ch_id, 23, '{"am":"ጌታ እግዚአብሔርም ከኤድን ገነት አስወጣው፤ የተገኘባትን ምድር ያርስ ዘንድ።","en":"So the LORD God banished him from the Garden of Eden to work the ground from which he had been taken."}'),
(v_ch_id, 24, '{"am":"ሰውን አባረረው፤ ወደ ሕይወትም ዛፍ የሚወስደውን መንገድ ለመጠበቅ በኤድን ገነት ምሥራቅ ኪሩቤልንና የሚገለባበጥ የእሳት ሰይፍ አኖረ።","en":"After he drove the man out, he placed on the east side of the Garden of Eden cherubim and a flaming sword flashing back and forth to guard the way to the tree of life."}');

-- =========================================================================
-- Chapters 4-50: Create empty chapter rows (you will add verses via admin)
-- =========================================================================
INSERT INTO bible_chapters (book_id, chapter_number, verse_count)
SELECT v_book_id, ch, CASE ch
    WHEN 4 THEN 26 WHEN 5 THEN 32 WHEN 6 THEN 22 WHEN 7 THEN 24
    WHEN 8 THEN 22 WHEN 9 THEN 29 WHEN 10 THEN 32 WHEN 11 THEN 32
    WHEN 12 THEN 20 WHEN 13 THEN 18 WHEN 14 THEN 24 WHEN 15 THEN 21
    WHEN 16 THEN 16 WHEN 17 THEN 27 WHEN 18 THEN 33 WHEN 19 THEN 38
    WHEN 20 THEN 18 WHEN 21 THEN 34 WHEN 22 THEN 24 WHEN 23 THEN 20
    WHEN 24 THEN 67 WHEN 25 THEN 34 WHEN 26 THEN 35 WHEN 27 THEN 46
    WHEN 28 THEN 22 WHEN 29 THEN 35 WHEN 30 THEN 43 WHEN 31 THEN 55
    WHEN 32 THEN 32 WHEN 33 THEN 20 WHEN 34 THEN 31 WHEN 35 THEN 29
    WHEN 36 THEN 43 WHEN 37 THEN 36 WHEN 38 THEN 30 WHEN 39 THEN 23
    WHEN 40 THEN 23 WHEN 41 THEN 57 WHEN 42 THEN 38 WHEN 43 THEN 34
    WHEN 44 THEN 34 WHEN 45 THEN 28 WHEN 46 THEN 34 WHEN 47 THEN 31
    WHEN 48 THEN 22 WHEN 49 THEN 33 WHEN 50 THEN 26
    ELSE 0
END
FROM generate_series(4, 50) AS ch;

-- =========================================================================
-- Seed verse_of_the_day with Genesis 1:1 for today
-- =========================================================================
SELECT v.id INTO v_verse_id
FROM bible_verses v
JOIN bible_chapters c ON c.id = v.chapter_id
WHERE c.book_id = v_book_id
  AND c.chapter_number = 1
  AND v.verse_number = 1
LIMIT 1;

IF v_verse_id IS NOT NULL THEN
    INSERT INTO verse_of_the_day (verse_id, scheduled_date)
    VALUES (v_verse_id, CURRENT_DATE)
    ON CONFLICT (scheduled_date) DO NOTHING;
END IF;

END $$;
