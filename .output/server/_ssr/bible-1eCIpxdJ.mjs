import { c as createServerRpc } from "./createServerRpc-29xaFZcb.mjs";
import { getSupabaseServerClient } from "./server-DDesMkLt.mjs";
import { c as createServerFn } from "./index.mjs";
import { o as object, _ as _enum, s as string, n as number } from "../_libs/zod.mjs";
import "../_chunks/_libs/@supabase/ssr.mjs";
import "../_chunks/_libs/@supabase/supabase-js.mjs";
import "../_chunks/_libs/@supabase/postgrest-js.mjs";
import "../_chunks/_libs/@supabase/realtime-js.mjs";
import "../_chunks/_libs/@supabase/storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_chunks/_libs/@supabase/auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_chunks/_libs/@supabase/functions-js.mjs";
import "../_libs/cookie.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_chunks/_libs/@tanstack/router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:https";
import "node:http2";
import "../_chunks/_libs/react.mjs";
import "../_chunks/_libs/@tanstack/react-router.mjs";
import "../_libs/tiny-warning.mjs";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const serialize = (data) => JSON.parse(JSON.stringify(data));
const getBooksSchema = object({
  page: number().optional(),
  limit: number().optional(),
  search: string().optional(),
  testament: _enum(["old", "new"]).optional()
});
const getBibleBooks_createServerFn_handler = createServerRpc({
  id: "b0aa7fbaf530a409d7707ef6ca6b59e97ee0003602d48c38ccab1993d5bca973",
  name: "getBibleBooks",
  filename: "src/api/bible.ts"
}, (opts, signal) => getBibleBooks.__executeServer(opts, signal));
const getBibleBooks = createServerFn({
  method: "GET"
}).inputValidator(getBooksSchema).handler(getBibleBooks_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const page = data.page || 1;
  const limit = data.limit || 66;
  const offset = (page - 1) * limit;
  let query = supabase.from("bible_books").select("*", {
    count: "exact"
  }).order("book_number", {
    ascending: true
  }).range(offset, offset + limit - 1);
  if (data.search) {
    query = query.or(`name->>en.ilike.%${data.search}%,name->>am.ilike.%${data.search}%`);
  }
  const {
    data: books,
    error,
    count
  } = await query;
  if (error) {
    throw new Error(error.message);
  }
  let filteredBooks = books || [];
  if (data.testament) {
    filteredBooks = filteredBooks.filter((book) => {
      const testament = book.testament;
      if (data.testament === "old") {
        return testament?.en?.toLowerCase().includes("old");
      }
      return testament?.en?.toLowerCase().includes("new");
    });
  }
  return serialize({
    books: filteredBooks,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  });
});
const getBibleBook_createServerFn_handler = createServerRpc({
  id: "23a130f5adddd1257fbe38399a86ea80f4dcaa4b3dd12e1e3a4a294aee17a8b2",
  name: "getBibleBook",
  filename: "src/api/bible.ts"
}, (opts, signal) => getBibleBook.__executeServer(opts, signal));
const getBibleBook = createServerFn({
  method: "GET"
}).inputValidator(object({
  id: string()
})).handler(getBibleBook_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: book,
    error
  } = await supabase.from("bible_books").select("*").eq("id", data.id).single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(book);
});
const getBibleBookStats_createServerFn_handler = createServerRpc({
  id: "974a6a4b367fa851d6760c17586be5b9a49729e42abf7dffb26bf35ff2d9dd1f",
  name: "getBibleBookStats",
  filename: "src/api/bible.ts"
}, (opts, signal) => getBibleBookStats.__executeServer(opts, signal));
const getBibleBookStats = createServerFn({
  method: "GET"
}).handler(getBibleBookStats_createServerFn_handler, async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: books,
    error
  } = await supabase.from("bible_books").select("testament");
  if (error) {
    throw new Error(error.message);
  }
  const oldTestament = books?.filter((b) => {
    const testament = b.testament;
    return testament?.en?.toLowerCase().includes("old");
  }).length || 0;
  const newTestament = books?.filter((b) => {
    const testament = b.testament;
    return testament?.en?.toLowerCase().includes("new");
  }).length || 0;
  return serialize({
    total: books?.length || 0,
    oldTestament,
    newTestament
  });
});
const createBookSchema = object({
  book_number: number(),
  chapter_count: number(),
  name: object({
    en: string(),
    am: string().optional()
  }),
  testament: object({
    en: string(),
    am: string().optional()
  })
});
const createBibleBook_createServerFn_handler = createServerRpc({
  id: "e0a7307af09d107bd4e5a898c7b073494285a865ce5c85107204b9910ea9a871",
  name: "createBibleBook",
  filename: "src/api/bible.ts"
}, (opts, signal) => createBibleBook.__executeServer(opts, signal));
const createBibleBook = createServerFn({
  method: "POST"
}).inputValidator(createBookSchema).handler(createBibleBook_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: book,
    error
  } = await supabase.from("bible_books").insert({
    book_number: data.book_number,
    chapter_count: data.chapter_count,
    name: data.name,
    testament: data.testament
  }).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(book);
});
const updateBookSchema = object({
  id: string(),
  book_number: number().optional(),
  chapter_count: number().optional(),
  name: object({
    en: string(),
    am: string().optional()
  }).optional(),
  testament: object({
    en: string(),
    am: string().optional()
  }).optional()
});
const updateBibleBook_createServerFn_handler = createServerRpc({
  id: "19515615719aaaf084e52fa2f76449e88767ceff7f1f5c7dab0e7470a2d226fd",
  name: "updateBibleBook",
  filename: "src/api/bible.ts"
}, (opts, signal) => updateBibleBook.__executeServer(opts, signal));
const updateBibleBook = createServerFn({
  method: "POST"
}).inputValidator(updateBookSchema).handler(updateBibleBook_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    id,
    ...updateData
  } = data;
  const {
    data: book,
    error
  } = await supabase.from("bible_books").update(updateData).eq("id", id).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(book);
});
const deleteBibleBook_createServerFn_handler = createServerRpc({
  id: "7a134dde487c2e7cada1db962b7b4217665085c37a422d19654e00500f2e10f1",
  name: "deleteBibleBook",
  filename: "src/api/bible.ts"
}, (opts, signal) => deleteBibleBook.__executeServer(opts, signal));
const deleteBibleBook = createServerFn({
  method: "POST"
}).inputValidator(object({
  id: string()
})).handler(deleteBibleBook_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("bible_books").delete().eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const getChaptersSchema = object({
  bookId: string(),
  page: number().optional(),
  limit: number().optional()
});
const getBibleChapters_createServerFn_handler = createServerRpc({
  id: "763ca99bd77de63dd50c0fc7a604c505b9ffb923cac46e621e5e714cbdbd13e1",
  name: "getBibleChapters",
  filename: "src/api/bible.ts"
}, (opts, signal) => getBibleChapters.__executeServer(opts, signal));
const getBibleChapters = createServerFn({
  method: "GET"
}).inputValidator(getChaptersSchema).handler(getBibleChapters_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const page = data.page || 1;
  const limit = data.limit || 150;
  const offset = (page - 1) * limit;
  const {
    data: chapters,
    error,
    count
  } = await supabase.from("bible_chapters").select("*", {
    count: "exact"
  }).eq("book_id", data.bookId).order("chapter_number", {
    ascending: true
  }).range(offset, offset + limit - 1);
  if (error) {
    throw new Error(error.message);
  }
  return serialize({
    chapters: chapters || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  });
});
const getBibleChapter_createServerFn_handler = createServerRpc({
  id: "90bd3f566c97b140e100dd015f7a8c8e1804513a7ddfabf319e33ad7973d7c5d",
  name: "getBibleChapter",
  filename: "src/api/bible.ts"
}, (opts, signal) => getBibleChapter.__executeServer(opts, signal));
const getBibleChapter = createServerFn({
  method: "GET"
}).inputValidator(object({
  id: string()
})).handler(getBibleChapter_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: chapter,
    error
  } = await supabase.from("bible_chapters").select("*, bible_books(*)").eq("id", data.id).single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(chapter);
});
const createChapterSchema = object({
  book_id: string(),
  chapter_number: number(),
  verse_count: number()
});
const createBibleChapter_createServerFn_handler = createServerRpc({
  id: "b23c4e8fc3655ad01a169be32e6f6f275887781469e7ea47d664dd813048f45b",
  name: "createBibleChapter",
  filename: "src/api/bible.ts"
}, (opts, signal) => createBibleChapter.__executeServer(opts, signal));
const createBibleChapter = createServerFn({
  method: "POST"
}).inputValidator(createChapterSchema).handler(createBibleChapter_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: chapter,
    error
  } = await supabase.from("bible_chapters").insert(data).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(chapter);
});
const updateChapterSchema = object({
  id: string(),
  chapter_number: number().optional(),
  verse_count: number().optional()
});
const updateBibleChapter_createServerFn_handler = createServerRpc({
  id: "f81828e97e8e357e43a737f580def7599b1ff26c94aac433c5ba932bce9413f3",
  name: "updateBibleChapter",
  filename: "src/api/bible.ts"
}, (opts, signal) => updateBibleChapter.__executeServer(opts, signal));
const updateBibleChapter = createServerFn({
  method: "POST"
}).inputValidator(updateChapterSchema).handler(updateBibleChapter_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    id,
    ...updateData
  } = data;
  const {
    data: chapter,
    error
  } = await supabase.from("bible_chapters").update(updateData).eq("id", id).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(chapter);
});
const deleteBibleChapter_createServerFn_handler = createServerRpc({
  id: "8a390080d94832cd6203a07fc65ac930672f111324848664f96421f956b26b29",
  name: "deleteBibleChapter",
  filename: "src/api/bible.ts"
}, (opts, signal) => deleteBibleChapter.__executeServer(opts, signal));
const deleteBibleChapter = createServerFn({
  method: "POST"
}).inputValidator(object({
  id: string()
})).handler(deleteBibleChapter_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("bible_chapters").delete().eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const getVersesSchema = object({
  chapterId: string(),
  page: number().optional(),
  limit: number().optional(),
  search: string().optional()
});
const getBibleVerses_createServerFn_handler = createServerRpc({
  id: "78d78cdbf65e538d15ee23a5a21131c5f2aa632873269f020dd68a5147a0563a",
  name: "getBibleVerses",
  filename: "src/api/bible.ts"
}, (opts, signal) => getBibleVerses.__executeServer(opts, signal));
const getBibleVerses = createServerFn({
  method: "GET"
}).inputValidator(getVersesSchema).handler(getBibleVerses_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const page = data.page || 1;
  const limit = data.limit || 200;
  const offset = (page - 1) * limit;
  let query = supabase.from("bible_verses").select("*", {
    count: "exact"
  }).eq("chapter_id", data.chapterId).order("verse_number", {
    ascending: true
  }).range(offset, offset + limit - 1);
  if (data.search) {
    query = query.or(`text->>en.ilike.%${data.search}%,text->>am.ilike.%${data.search}%`);
  }
  const {
    data: verses,
    error,
    count
  } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return serialize({
    verses: verses || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  });
});
const getBibleVerse_createServerFn_handler = createServerRpc({
  id: "055dfaf82fcd4e3f4f4a05537d864521e33d64a5c723d45725d968e856c2bed1",
  name: "getBibleVerse",
  filename: "src/api/bible.ts"
}, (opts, signal) => getBibleVerse.__executeServer(opts, signal));
const getBibleVerse = createServerFn({
  method: "GET"
}).inputValidator(object({
  id: string()
})).handler(getBibleVerse_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: verse,
    error
  } = await supabase.from("bible_verses").select("*, bible_chapters(*, bible_books(*))").eq("id", data.id).single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(verse);
});
const createVerseSchema = object({
  chapter_id: string(),
  verse_number: number(),
  text: object({
    en: string(),
    am: string().optional()
  })
});
const createBibleVerse_createServerFn_handler = createServerRpc({
  id: "66e151e83e191105c0c1936257b4a2419d311b93c8bc25a86b851755e9b68a41",
  name: "createBibleVerse",
  filename: "src/api/bible.ts"
}, (opts, signal) => createBibleVerse.__executeServer(opts, signal));
const createBibleVerse = createServerFn({
  method: "POST"
}).inputValidator(createVerseSchema).handler(createBibleVerse_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: verse,
    error
  } = await supabase.from("bible_verses").insert(data).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(verse);
});
const updateVerseSchema = object({
  id: string(),
  verse_number: number().optional(),
  text: object({
    en: string(),
    am: string().optional()
  }).optional()
});
const updateBibleVerse_createServerFn_handler = createServerRpc({
  id: "4f3186460542b4a27f94d56d2c85044b2d055d54a616e7facb807f20be081a44",
  name: "updateBibleVerse",
  filename: "src/api/bible.ts"
}, (opts, signal) => updateBibleVerse.__executeServer(opts, signal));
const updateBibleVerse = createServerFn({
  method: "POST"
}).inputValidator(updateVerseSchema).handler(updateBibleVerse_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    id,
    ...updateData
  } = data;
  const {
    data: verse,
    error
  } = await supabase.from("bible_verses").update(updateData).eq("id", id).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(verse);
});
const deleteBibleVerse_createServerFn_handler = createServerRpc({
  id: "3f0ce2ceb1949445c50d7f4c5853a31755a802a2a0f7adbe2275058686cc41ef",
  name: "deleteBibleVerse",
  filename: "src/api/bible.ts"
}, (opts, signal) => deleteBibleVerse.__executeServer(opts, signal));
const deleteBibleVerse = createServerFn({
  method: "POST"
}).inputValidator(object({
  id: string()
})).handler(deleteBibleVerse_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("bible_verses").delete().eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const searchBibleVerses_createServerFn_handler = createServerRpc({
  id: "4fe7827292a4ddcf42118c15344866a3d97417929dae5d93e853ee453e8437b2",
  name: "searchBibleVerses",
  filename: "src/api/bible.ts"
}, (opts, signal) => searchBibleVerses.__executeServer(opts, signal));
const searchBibleVerses = createServerFn({
  method: "GET"
}).inputValidator(object({
  query: string()
})).handler(searchBibleVerses_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: results,
    error
  } = await supabase.rpc("search_bible_verses_text", {
    search_query: data.query
  });
  if (error) {
    throw new Error(error.message);
  }
  return serialize(results || []);
});
const getBibleFootnotes_createServerFn_handler = createServerRpc({
  id: "7ab45f46e0ab1f4341be54309229612317db068ed0d753e7d9c2f6fe057e6ed2",
  name: "getBibleFootnotes",
  filename: "src/api/bible.ts"
}, (opts, signal) => getBibleFootnotes.__executeServer(opts, signal));
const getBibleFootnotes = createServerFn({
  method: "GET"
}).inputValidator(object({
  verseId: string()
})).handler(getBibleFootnotes_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: footnotes,
    error
  } = await supabase.from("bible_footnotes").select("*").eq("verse_id", data.verseId).order("created_at", {
    ascending: true
  });
  if (error) {
    throw new Error(error.message);
  }
  return serialize(footnotes || []);
});
const createFootnoteSchema = object({
  verse_id: string(),
  marker: object({
    en: string(),
    am: string().optional()
  }),
  note: object({
    en: string(),
    am: string().optional()
  }),
  type: string().optional()
});
const createBibleFootnote_createServerFn_handler = createServerRpc({
  id: "580bf606fac1f180eed10d63431459ff38e2e41425150bd36bfbb088cba38051",
  name: "createBibleFootnote",
  filename: "src/api/bible.ts"
}, (opts, signal) => createBibleFootnote.__executeServer(opts, signal));
const createBibleFootnote = createServerFn({
  method: "POST"
}).inputValidator(createFootnoteSchema).handler(createBibleFootnote_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: footnote,
    error
  } = await supabase.from("bible_footnotes").insert(data).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(footnote);
});
const updateFootnoteSchema = object({
  id: string(),
  marker: object({
    en: string(),
    am: string().optional()
  }).optional(),
  note: object({
    en: string(),
    am: string().optional()
  }).optional(),
  type: string().optional()
});
const updateBibleFootnote_createServerFn_handler = createServerRpc({
  id: "f023346eec6915a8a6a84df84be0563a56bac74bd13d5078b3b9c9a18ee72e7e",
  name: "updateBibleFootnote",
  filename: "src/api/bible.ts"
}, (opts, signal) => updateBibleFootnote.__executeServer(opts, signal));
const updateBibleFootnote = createServerFn({
  method: "POST"
}).inputValidator(updateFootnoteSchema).handler(updateBibleFootnote_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    id,
    ...updateData
  } = data;
  const {
    data: footnote,
    error
  } = await supabase.from("bible_footnotes").update(updateData).eq("id", id).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(footnote);
});
const deleteBibleFootnote_createServerFn_handler = createServerRpc({
  id: "fa14e5b0dc217bb167771e92a6121b5466f00a850355960bc479b7c5a1ce00b0",
  name: "deleteBibleFootnote",
  filename: "src/api/bible.ts"
}, (opts, signal) => deleteBibleFootnote.__executeServer(opts, signal));
const deleteBibleFootnote = createServerFn({
  method: "POST"
}).inputValidator(object({
  id: string()
})).handler(deleteBibleFootnote_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("bible_footnotes").delete().eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
const getBibleCrossReferences_createServerFn_handler = createServerRpc({
  id: "6e7f2054dd1923c142a6474e619110c49a1b5a27c8ea5712b5397b53156cd913",
  name: "getBibleCrossReferences",
  filename: "src/api/bible.ts"
}, (opts, signal) => getBibleCrossReferences.__executeServer(opts, signal));
const getBibleCrossReferences = createServerFn({
  method: "GET"
}).inputValidator(object({
  verseId: string()
})).handler(getBibleCrossReferences_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: references,
    error
  } = await supabase.from("bible_cross_references").select("*, bible_books!bible_cross_references_reference_book_id_fkey(*)").eq("verse_id", data.verseId).order("created_at", {
    ascending: true
  });
  if (error) {
    throw new Error(error.message);
  }
  return serialize(references || []);
});
const createCrossRefSchema = object({
  verse_id: string(),
  reference: object({
    en: string(),
    am: string().optional()
  }),
  description: object({
    en: string(),
    am: string().optional()
  }).optional(),
  reference_book_id: string().optional(),
  reference_chapter: number().optional(),
  reference_verse_start: number().optional(),
  reference_verse_end: number().optional()
});
const createBibleCrossReference_createServerFn_handler = createServerRpc({
  id: "97f0e070724bc420208f1f670c9b40c868d4c4ed1d8747121f2844552a2124f6",
  name: "createBibleCrossReference",
  filename: "src/api/bible.ts"
}, (opts, signal) => createBibleCrossReference.__executeServer(opts, signal));
const createBibleCrossReference = createServerFn({
  method: "POST"
}).inputValidator(createCrossRefSchema).handler(createBibleCrossReference_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    data: reference,
    error
  } = await supabase.from("bible_cross_references").insert(data).select().single();
  if (error) {
    throw new Error(error.message);
  }
  return serialize(reference);
});
const deleteBibleCrossReference_createServerFn_handler = createServerRpc({
  id: "d92ea202c6d10a5e673359889c393f5974daec463d97b6fc3481d504f7bfb950",
  name: "deleteBibleCrossReference",
  filename: "src/api/bible.ts"
}, (opts, signal) => deleteBibleCrossReference.__executeServer(opts, signal));
const deleteBibleCrossReference = createServerFn({
  method: "POST"
}).inputValidator(object({
  id: string()
})).handler(deleteBibleCrossReference_createServerFn_handler, async ({
  data
}) => {
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.from("bible_cross_references").delete().eq("id", data.id);
  if (error) {
    throw new Error(error.message);
  }
  return {
    success: true
  };
});
export {
  createBibleBook_createServerFn_handler,
  createBibleChapter_createServerFn_handler,
  createBibleCrossReference_createServerFn_handler,
  createBibleFootnote_createServerFn_handler,
  createBibleVerse_createServerFn_handler,
  deleteBibleBook_createServerFn_handler,
  deleteBibleChapter_createServerFn_handler,
  deleteBibleCrossReference_createServerFn_handler,
  deleteBibleFootnote_createServerFn_handler,
  deleteBibleVerse_createServerFn_handler,
  getBibleBookStats_createServerFn_handler,
  getBibleBook_createServerFn_handler,
  getBibleBooks_createServerFn_handler,
  getBibleChapter_createServerFn_handler,
  getBibleChapters_createServerFn_handler,
  getBibleCrossReferences_createServerFn_handler,
  getBibleFootnotes_createServerFn_handler,
  getBibleVerse_createServerFn_handler,
  getBibleVerses_createServerFn_handler,
  searchBibleVerses_createServerFn_handler,
  updateBibleBook_createServerFn_handler,
  updateBibleChapter_createServerFn_handler,
  updateBibleFootnote_createServerFn_handler,
  updateBibleVerse_createServerFn_handler
};
