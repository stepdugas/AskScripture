/**
 * Translation Bias Flags
 * ----------------------
 * A curated list of well-documented translation debates. Each entry names a passage
 * where translators have made theologically loaded or contested choices, and
 * explains what's at stake — in plain English — so a reader can see the seam
 * between the text and the interpretation.
 *
 * Sources behind these entries: Brown-Driver-Briggs (BDB), Liddell-Scott-Jones (LSJ),
 * Bauer-Danker-Arndt-Gingrich (BDAG), Theological Dictionary of the New Testament (TDNT),
 * Jewish Publication Society Tanakh, and a range of monograph-level studies on
 * each contested term.
 *
 * This is editorial work, not exhaustive scholarship. Each entry below cites
 * recognized debates from the secondary literature; the framing is meant to
 * surface the debate, not adjudicate it.
 */

export type BiasFlag = {
  /** stable id used in URLs */
  id: string;
  /** book slug as used in our routes */
  bookSlug: string;
  /** chapter */
  chapter: number;
  /** verses the flag attaches to (first verse used for sorting) */
  verses: number[];
  /** short headline for the flag — appears on hover/click */
  headline: string;
  /** the underlying Hebrew/Greek term in transliterated form */
  term: string;
  /** original script for the term */
  script: string;
  /** "Hebrew" | "Aramaic" | "Greek" */
  language: "Hebrew" | "Aramaic" | "Greek";
  /** 1-2 sentence summary of what's at stake */
  summary: string;
  /** longer explanation, may be multi-paragraph */
  body: string;
  /** how major translations render the term */
  renderings: { translation: string; text: string }[];
  /** tags for filtering */
  tags: ("gender" | "sexuality" | "creation" | "afterlife" | "atonement" | "authority" | "slavery" | "christology" | "messianic")[];
};

export const BIAS_FLAGS: BiasFlag[] = [
  {
    id: "gen-1-26-image",
    bookSlug: "genesis",
    chapter: 1,
    verses: [26, 27],
    headline: "“Let us make man in our image” — selem and demut",
    term: "tselem / demut",
    script: "צֶלֶם / דְּמוּת",
    language: "Hebrew",
    summary:
      "The terms behind “image” and “likeness” describe a physical statue or representation; the move from concrete sculpture to abstract “spiritual likeness” is interpretive.",
    body:
      "In the Hebrew Bible, tselem typically refers to a physical image or idol — a carved or molded representation. Demut, often paired with it, names resemblance. Ancient Near Eastern royal inscriptions describe kings as the “image” of their god, placed in distant lands to represent the deity's rule. Genesis 1 plausibly echoes that royal-image language, applied to humanity collectively. English translations have historically softened the concreteness into “image and likeness,” which can read as abstract spirituality. The original framing is closer to representation, function, and visible likeness.",
    renderings: [
      { translation: "BSB", text: "Let Us make man in Our image, after Our likeness" },
      { translation: "WEB", text: "Let us make man in our image, after our likeness" },
      { translation: "KJV", text: "Let us make man in our image, after our likeness" },
    ],
    tags: ["creation", "authority"],
  },
  {
    id: "gen-1-6-raqia",
    bookSlug: "genesis",
    chapter: 1,
    verses: [6, 7, 8, 14, 15, 17, 20],
    headline: "raqia: \"firmament,\" \"expanse,\" or the ancient sky-vault?",
    term: "raqia",
    script: "רָקִיעַ",
    language: "Hebrew",
    summary:
      "The Hebrew root rqʿ means to hammer out (as a metal sheet). \"Firmament\" (KJV, via Latin firmamentum) preserves the solidity. \"Expanse\" (most modern translations) sounds more like modern atmosphere. The two are reading the same Hebrew through different concerns: one preserves the ancient cosmology, the other smooths it for modern readers.",
    body:
      "The verb form raqaʿ is used in Exodus 39:3 and Numbers 17:3 for hammering metal flat into a sheet. The noun raqia denotes that beaten-out result. Ancient Near Eastern cosmology pictured the world with a solid sky-vault holding waters above the earth; Genesis 1:6-8 describes God installing one.\n\nThe KJV's \"firmament\" preserves the solidity (from Latin firmamentum, itself reflecting the Septuagint's stereōma). \"Expanse,\" used in most modern translations, communicates a sense closer to the modern reader's experience of the sky. Some scholars argue \"firmament\" or even \"dome\" / \"vault\" better serves readers who want to encounter the text on its own ancient terms; others argue \"expanse\" lets the contemporary reader engage the theological claim of Genesis 1 without getting tangled in a cosmology no one holds anymore. Both readings agree on what raqaʿ describes in Hebrew; they disagree on what to do with that distance from contemporary English usage.",
    renderings: [
      { translation: "BSB", text: "Let there be an expanse between the waters" },
      { translation: "WEB", text: "Let there be an expanse in the middle of the waters" },
      { translation: "KJV", text: "Let there be a firmament in the midst of the waters" },
      { translation: "YLT", text: "Let an expanse be in the midst of the waters" },
    ],
    tags: ["creation"],
  },
  {
    id: "gen-2-18-ezer",
    bookSlug: "genesis",
    chapter: 2,
    verses: [18, 20],
    headline: "ezer kenegdo: what kind of partner?",
    term: "ezer kenegdo",
    script: "עֵזֶר כְּנֶגְדּוֹ",
    language: "Hebrew",
    summary:
      "Hebrew ezer (\"help, helper\") is used of God rescuing Israel in most of its other occurrences. The pairing kenegdo means \"corresponding to\" or \"matching.\" Translators and theologians read the phrase as anything from \"complementary helper\" to \"strong ally of equivalent standing.\"",
    body:
      "Of the 21 Old Testament occurrences of ezer, 16 describe God acting on Israel's behalf (Ex 18:4; Ps 33:20; 121:1-2). The word itself carries no built-in rank — God can be an ezer, and so can humans. The pairing kenegdo means \"corresponding to,\" \"opposite,\" or \"matching.\"\n\nFrom this much, two main readings flow. A complementarian reading takes \"helper suitable for him\" to describe a partner who functions differently from the man — distinct roles, equal worth — and notes that in the wider Genesis 2 narrative, the man is created first and given the naming task. An egalitarian reading takes ezer kenegdo as a phrase about peer-to-peer partnership: ezer often names rescue from a stronger party, and kenegdo describes someone facing the man as an equal. English \"helper\" can support either reading depending on which sense of the English word the reader brings; some translators argue \"counterpart\" or \"partner\" is closer to what the Hebrew foregrounds, while others hold that \"helper\" preserves the Genesis 2 emphasis on the man's prior creation. Both readings have serious scholarly defenders.",
    renderings: [
      { translation: "BSB", text: "a helper suitable for him" },
      { translation: "WEB", text: "I will make him a helper comparable to him" },
      { translation: "KJV", text: "an help meet for him" },
      { translation: "YLT", text: "an helper — as his counterpart" },
    ],
    tags: ["gender", "authority"],
  },
  {
    id: "isa-7-14-almah",
    bookSlug: "isaiah",
    chapter: 7,
    verses: [14],
    headline: "“Virgin” or “young woman”? — almah",
    term: "almah",
    script: "עַלְמָה",
    language: "Hebrew",
    summary:
      "Hebrew almah means a young woman of marriageable age. The Greek Septuagint translated it parthenos (“virgin”), which Matthew 1:23 quotes. Translations diverge on how to render the Hebrew in Isaiah.",
    body:
      "Hebrew has betulah, often glossed “virgin,” though even betulah is not unambiguous on its own — Joel 1:8 has a betulah mourning her husband, and Genesis 24:16 has to add the qualifier “whom no man had known” to specify virginity. Almah names a young woman of marriageable age; sexual status is not part of its lexical core (HALOT, BDB). When the Septuagint translators rendered Isaiah 7:14 into Greek (~3rd c. BCE), they chose parthenos, which more strictly implies virginity. Matthew 1:23 quotes the Septuagint reading to interpret Mary. English Bibles handle this differently: most evangelical translations preserve “virgin” in Isaiah; mainline and Jewish translations tend toward “young woman.” The dispute is not about Matthew, who follows his Greek source — it is about what Isaiah's Hebrew says on its own terms.",
    renderings: [
      { translation: "BSB", text: "Behold, the virgin will be with child" },
      { translation: "WEB", text: "Behold, the virgin will conceive" },
      { translation: "KJV", text: "Behold, a virgin shall conceive" },
      { translation: "JPS (Jewish)", text: "Behold, the young woman is with child" },
    ],
    tags: ["messianic", "christology"],
  },
  {
    id: "mat-5-22-gehenna",
    bookSlug: "matthew",
    chapter: 5,
    verses: [22, 29, 30],
    headline: "geenna: \"hell,\" \"Gehenna,\" or the Valley of Hinnom?",
    term: "geenna",
    script: "γέεννα",
    language: "Greek",
    summary:
      "Greek geenna transliterates Hebrew Ge-Hinnom — the Valley of Hinnom outside Jerusalem, a place associated in the prophets with judgment. English \"hell\" carries centuries of later imagery; transliterating as \"Gehenna\" keeps the original referent visible. Translations split on which reading serves the reader better.",
    body:
      "Jesus uses geenna, a Greek transliteration of Hebrew Ge-Hinnom (Valley of Hinnom), a ravine south of Jerusalem associated in the prophets with child sacrifice and divine judgment (Jer 7:31-32). By the first century the location served as a vivid image of fiery judgment in Jewish discourse.\n\nTranslators choose between two strategies. \"Hell\" — the older English convention, used in most major translations — communicates immediate theological weight: the reader hears the term they associate with eternal judgment. The cost is that centuries of later imagery (Dante, Milton, popular theology) get pulled in along with the word. \"Gehenna\" — used in WEB, YLT, and a growing number of recent translations — preserves the geographic and prophetic resonance, so the reader has to learn what Jesus was referring to. The cost is unfamiliarity: \"Gehenna\" doesn't trigger the same recognition. Both are defensible; the choice tracks whether the translator weighs continuity with the English Bible tradition or precision about Jesus's referent more heavily.",
    renderings: [
      { translation: "BSB", text: "will be in danger of the fire of hell" },
      { translation: "WEB", text: "in danger of the fire of Gehenna" },
      { translation: "KJV", text: "shall be in danger of hell fire" },
      { translation: "YLT", text: "shall be in danger of the gehenna of the fire" },
    ],
    tags: ["afterlife"],
  },
  {
    id: "mat-25-46-aionios",
    bookSlug: "matthew",
    chapter: 25,
    verses: [46],
    headline: "aiōnios: how long is the age that lasts?",
    term: "aiōnios",
    script: "αἰώνιος",
    language: "Greek",
    summary:
      "Aiōnios is the adjective of aiōn (age, era). Across the Greek Bible it can mean either \"unending/eternal\" or \"belonging to the age to come.\" The verse pairs aiōnios punishment with aiōnios life — whichever sense the translator picks applies to both halves.",
    body:
      "Aiōn means \"age\" or \"era\" — sometimes a finite long time, sometimes \"the age to come\" as a theological category. Aiōnios is the adjectival form.\n\nThe majority view among translators, ancient and modern, is that aiōnios in this verse means \"eternal\" in the sense of unending — the Septuagint uses aiōnios for God's permanence, and the Vulgate's aeternus shaped the entire Latin and English tradition. A minority view, with patristic representatives (Gregory of Nyssa and other universalist-leaning fathers) and contemporary defenders, reads aiōnios as \"pertaining to the age (to come)\" rather than \"unending\" — a duration tied to the eschatological age rather than asserted to be infinite. Both readings are grammatically possible from the Greek; the choice is partly lexical and partly theological. Whichever sense the translator picks applies to both nouns: punishment and life are described with the same adjective in the same verse.",
    renderings: [
      { translation: "BSB", text: "into eternal punishment, but the righteous into eternal life" },
      { translation: "WEB", text: "into eternal punishment, but the righteous into eternal life" },
      { translation: "YLT", text: "to punishment age-during, but the righteous to life age-during" },
    ],
    tags: ["afterlife"],
  },
  {
    id: "jhn-3-16-monogenes",
    bookSlug: "john",
    chapter: 3,
    verses: [16, 18],
    headline: "“Only begotten” or “one and only”? — monogenēs",
    term: "monogenēs",
    script: "μονογενής",
    language: "Greek",
    summary:
      "Built from monos (only) + genos (kind/class), monogenēs means “one of a kind” or “unique.” The KJV's “only begotten” reflects an older etymology (genos read as gennaō, “to beget”).",
    body:
      "Etymology and usage point to “unique,” “one of a kind.” In Hebrews 11:17 monogenēs describes Isaac — who was not Abraham's only son, but his uniquely promised one. The Latin Vulgate translated monogenēs as unigenitus (“only-begotten”), partly out of trinitarian concerns; the King James inherited that gloss. Modern lexicons (BDAG, LSJ) favor “unique” or “one and only.” The change isn't trivial: “only begotten” suggests something about how the Son is, while “unique” is about which Son.",
    renderings: [
      { translation: "BSB", text: "He gave His one and only Son" },
      { translation: "WEB", text: "he gave his one and only Son" },
      { translation: "KJV", text: "he gave his only begotten Son" },
    ],
    tags: ["christology"],
  },
  {
    id: "rom-16-1-diakonos",
    bookSlug: "romans",
    chapter: 16,
    verses: [1, 2],
    headline: "Phoebe the diakonos: servant, minister, or deacon?",
    term: "diakonos",
    script: "διάκονος",
    language: "Greek",
    summary:
      "Paul calls Phoebe a diakonos of the church at Cenchreae. The same word elsewhere is rendered \"servant,\" \"minister,\" or \"deacon\" depending on the context and translator — and the disagreement over what to call Phoebe is part of a longer debate about whether \"diakonos\" had become a formal office by the time Paul wrote.",
    body:
      "Diakonos appears 29 times in the New Testament. Across those occurrences, English translations vary widely: \"servant,\" \"minister,\" \"deacon,\" or \"servant of God\" all turn up, often in the same translation depending on context.\n\nIn 1 Timothy 3:8-13, which sets out qualifications for a recognized church role, most translations use \"deacon\" — there the word clearly refers to an office. When the same word describes Paul or Apollos (1 Cor 3:5), translations usually use \"servant\" or \"minister,\" because Paul is describing his self-understanding, not naming a position.\n\nIn Romans 16:1, the question is which of these Paul has in mind for Phoebe. Translations that prefer \"servant\" treat the term as descriptive language about her service to the church. Translations that prefer \"deacon\" (notably NRSV, NRSVue, and CEB) read it as the same office named in 1 Timothy. Defenders of the \"deacon\" rendering point to Paul's parallel description of Phoebe as a prostatis (patron, protector, person of standing) and to early Christian inscriptions that name women as deacons. Defenders of \"servant\" point to the comparatively undeveloped state of church offices in Paul's earliest letters. The Greek is the same; what's contested is what \"diakonos\" meant institutionally in Paul's Rome.",
    renderings: [
      { translation: "BSB", text: "Phoebe, a servant of the church in Cenchrea" },
      { translation: "WEB", text: "Phoebe, who is a servant of the assembly that is at Cenchreae" },
      { translation: "KJV", text: "Phebe our sister, which is a servant of the church" },
      { translation: "NRSVue (paid)", text: "Phoebe, a deacon of the church at Cenchreae" },
    ],
    tags: ["gender", "authority"],
  },
  {
    id: "rom-16-7-junia",
    bookSlug: "romans",
    chapter: 16,
    verses: [7],
    headline: "Junia (or Junias) and the apostles: two questions, not one",
    term: "Iounian · episēmoi en tois apostolois",
    script: "Ἰουνιαν · ἐπίσημοι ἐν τοῖς ἀποστόλοις",
    language: "Greek",
    summary:
      "Two distinct debates have run on this verse: (1) is the person Paul greets a woman (Junia) or a man (Junias)? (2) is she/he \"outstanding among the apostles\" — i.e. an apostle — or \"well-known to the apostles\"? Current scholarship has largely answered the first; the second is still active.",
    body:
      "The accusative form Iounian is grammatically ambiguous between the woman's name Junia and the (otherwise unattested) hypothetical man's name Junias. The earliest manuscripts that include accents accent it as a woman's name, and Greek church fathers — including John Chrysostom, who was not a champion of women's leadership — read it as Junia. Some 20th-century lexicons introduced the masculine form on the assumption that Paul would not have called a woman an apostle; subsequent scholarship (Eldon Epp's 2005 monograph is the standard reference) has shifted most translations back to Junia. This part of the debate is now broadly settled in favor of \"Junia.\"\n\nThe second question — what Paul means by episēmoi en tois apostolois — is still actively contested. The traditional and majority reading is \"outstanding among the apostles\" (an inclusive sense: Junia and Andronicus belong to the apostolic group). A minority reading proposed by Burer and Wallace (2001) and defended elsewhere takes the phrase as \"well-known to the apostles\" (an exclusive sense: they are esteemed by the apostles but not themselves apostles). The Greek construction permits both grammatically; the dispute turns on parallels in Greek literature and on the Greek fathers' usage. Most current scholarship favors the inclusive reading; a substantial minority defends the exclusive one.",
    renderings: [
      { translation: "BSB", text: "Andronicus and Junia… outstanding among the apostles" },
      { translation: "WEB", text: "Andronicus and Junia… notable among the apostles" },
      { translation: "KJV", text: "Andronicus and Junia… of note among the apostles" },
    ],
    tags: ["gender", "authority"],
  },
  {
    id: "1co-6-9-arsenokoitai",
    bookSlug: "1-corinthians",
    chapter: 6,
    verses: [9],
    headline: "arsenokoitai and malakoi: a rare word and a wide one",
    term: "arsenokoitai / malakoi",
    script: "ἀρσενοκοῖται / μαλακοί",
    language: "Greek",
    summary:
      "Arsenokoitai is an unusual compound that Paul (or someone in his circle) may have coined; malakoi (\"soft ones\") had a wide pejorative range in ancient Greek. Both terms describe behavior Paul lists as inconsistent with the kingdom; what behavior, exactly, is the long-running question.",
    body:
      "Arsenokoitēs (singular) appears only twice in the New Testament (1 Cor 6:9; 1 Tim 1:10) and almost nowhere in earlier Greek literature. The compound joins arsēn (\"male\") and koitē (\"bed,\" a Greek euphemism for sexual intercourse). Most scholars trace its construction to Leviticus 18:22 and 20:13 in the Septuagint, where the same two words occur adjacent to each other in the Greek of the prohibition against male same-sex intercourse. That connection is widely accepted; what it implies for the referent in Paul is where readers diverge.\n\nOne well-defended position holds that Paul is drawing on the Levitical prohibition and extending it: arsenokoitai names men who have sex with men, period, regardless of the social configuration of that sex. On this reading the translation tradition from the Reformation forward (KJV's \"abusers of themselves with mankind\") and most modern conservative translations (\"men who have sex with men,\" \"homosexual offenders\") are doing reasonable lexicography.\n\nA second well-defended position holds that arsenokoitai targets a specific kind of male sexual conduct — exploitative pederasty, prostitution, master-slave coercion, or some combination — that was the visible form of male-male sex in Paul's Greco-Roman context. On this reading, translations like \"male sexual predators\" or paraphrases that name exploitation more explicitly are closer to Paul's intent than the broader \"homosexuals.\" Defenders point to the lack of attestation outside Christian literature and to the social register of male sex in the period.\n\nMalakoi (\"soft ones\") had a notoriously wide pejorative range in classical Greek — morally weak, effeminate, luxurious, or sexually receptive. Some translations pair it with arsenokoitai under one English phrase; others render it separately. Translations from the 1946 RSV onward introduced the modern term \"homosexuals,\" which subsequent versions inherited or revised. Both lines of reading have published defenders in current biblical-studies journals; the question is genuinely live, and translation choice typically tracks the translator's prior judgment about which reading the lexical and historical evidence best supports.",
    renderings: [
      { translation: "BSB", text: "men who submit to or perform homosexual acts" },
      { translation: "WEB", text: "male prostitutes, nor homosexuals" },
      { translation: "KJV", text: "effeminate, nor abusers of themselves with mankind" },
      { translation: "YLT", text: "effeminate, nor sodomites" },
    ],
    tags: ["sexuality"],
  },
  {
    id: "1co-11-3-kephale",
    bookSlug: "1-corinthians",
    chapter: 11,
    verses: [3],
    headline: "“Head” as authority or as source? — kephalē",
    term: "kephalē",
    script: "κεφαλή",
    language: "Greek",
    summary:
      "Kephalē literally means “head” (the body part). Whether it carries the figurative sense “authority over” or “source/origin” in this passage is a long-running scholarly debate.",
    body:
      "Kephalē straightforwardly means “head.” The metaphorical sense is the question. In classical Greek, “head” more often connotes source or origin (as in “the head of a river”). The Septuagint sometimes uses kephalē for the Hebrew rosh (“leader”), but it also avoids that translation in many cases. Studies by Catherine Kroeger, Wayne Grudem, Anthony Thiselton, and others have argued at length on both sides. The interpretive stakes in 1 Cor 11 and Eph 5 are large, and the Greek itself does not resolve the question.",
    renderings: [
      { translation: "BSB", text: "the head of every man is Christ" },
      { translation: "WEB", text: "the head of every man is Christ" },
      { translation: "KJV", text: "the head of every man is Christ" },
    ],
    tags: ["gender", "authority"],
  },
  {
    id: "eph-5-22-hypotasso",
    bookSlug: "ephesians",
    chapter: 5,
    verses: [21, 22, 23, 24, 25],
    headline: "Ephesians 5:21-22: where does the sentence end?",
    term: "hypotassō",
    script: "ὑποτάσσω",
    language: "Greek",
    summary:
      "The earliest manuscripts of Ephesians 5:22 have no verb — the imperative carries over from verse 21 (\"submitting to one another\"). Translators and readers diverge on whether the continuous-sentence structure means the wifely submission of v22 is a sub-case of the mutual submission of v21, or whether v22 introduces a distinct relational pattern that the grammar happens to abbreviate.",
    body:
      "The Greek of Ephesians 5:22 in the earliest manuscripts does not contain its own imperative verb. The verse reads literally something like \"wives, to your own husbands as to the Lord.\" The verb hypotassesthe (\"submit yourselves,\" or \"be subordinate to\") belongs to verse 21: \"submitting to one another out of reverence for Christ.\" Grammatically, the instruction to wives is a continuation of the same sentence.\n\nThe textual evidence is uncontested; the interpretive question is what the continuity means.\n\nOne reading — held by many egalitarian commentators — treats the grammatical continuity as theologically load-bearing: the wife's submission to her husband is a particular instance of the mutual submission Paul has just instructed for the whole community. On this reading, the chapter-and-verse divisions and the imported verb in most English translations partly obscure Paul's argument.\n\nA second reading — held by many complementarian commentators — agrees the sentences are linked but argues that v21 functions as a general principle and v22-33 specifies how it applies within the household, where Paul then names asymmetric relational patterns (wives, husbands, children, fathers, slaves, masters) that are not simply mirror-images. On this reading, importing the verb in v22 doesn't distort Paul's meaning; it makes a long sentence more readable in English.\n\nBoth readings agree on the Greek; they disagree on what to do with it.",
    renderings: [
      { translation: "BSB", text: "Wives, submit to your husbands as to the Lord" },
      { translation: "WEB", text: "Wives, be subject to your own husbands, as to the Lord" },
      { translation: "KJV", text: "Wives, submit yourselves unto your own husbands" },
    ],
    tags: ["gender", "authority"],
  },
  {
    id: "gal-2-16-pistis-christou",
    bookSlug: "galatians",
    chapter: 2,
    verses: [16, 20],
    headline: "“Faith in Christ” or “faithfulness of Christ”? — pistis Christou",
    term: "pistis Christou",
    script: "πίστις Χριστοῦ",
    language: "Greek",
    summary:
      "The genitive Christou can read as objective (“faith in Christ”) or subjective (“faithfulness of Christ”). Different choices reshape the meaning of “justification by faith.”",
    body:
      "Greek genitives are flexible. Pistis Christou can mean “faith directed at Christ” (objective genitive) or “the faith/faithfulness exercised by Christ” (subjective genitive). Most Reformation-era and 20th-century English translations went with the objective reading. Beginning with Richard Hays's 1983 monograph and continuing through the “New Perspective on Paul” debate (Sanders, Dunn, Wright), many scholars now defend the subjective reading. The two readings build different soteriologies. The Greek allows both.",
    renderings: [
      { translation: "BSB", text: "justified… through faith in Jesus Christ" },
      { translation: "WEB", text: "justified by faith in Jesus Christ" },
      { translation: "KJV", text: "justified… by the faith of Jesus Christ" },
    ],
    tags: ["atonement", "christology"],
  },
  {
    id: "gen-2-7-nephesh",
    bookSlug: "genesis",
    chapter: 2,
    verses: [7],
    headline: "“Living soul” or “living being”? — nephesh chayyah",
    term: "nephesh chayyah",
    script: "נֶפֶשׁ חַיָּה",
    language: "Hebrew",
    summary:
      "Nephesh denotes a living, breathing creature — including animals (Gen 1:21). It is not a separable “soul” in the later Platonic sense.",
    body:
      "Hebrew nephesh names the living, breathing self — appetites, emotions, and physical life included. In Genesis 1:21 the very same phrase nephesh chayyah is used for sea creatures. The notion of a separable, immortal soul as the “real you” comes more from Plato (and later Christian appropriations of Hellenistic thought) than from the Hebrew Bible. Translating nephesh as “soul” in Genesis 2:7 imports later metaphysics; “living being” or “living creature” stays closer to the Hebrew.",
    renderings: [
      { translation: "BSB", text: "and the man became a living being" },
      { translation: "WEB", text: "and the man became a living soul" },
      { translation: "KJV", text: "and man became a living soul" },
    ],
    tags: ["creation"],
  },
  {
    id: "rom-8-5-sarx",
    bookSlug: "romans",
    chapter: 8,
    verses: [3, 4, 5, 6, 7, 8, 9, 12, 13],
    headline: "“Flesh” or “fallen nature”? — sarx",
    term: "sarx",
    script: "σάρξ",
    language: "Greek",
    summary:
      "Greek sarx straightforwardly means “flesh” — the physical body. Paul's metaphorical use is contested; translating it as “sinful nature” bakes in one interpretation.",
    body:
      "Paul uses sarx (“flesh”) in multiple registers: physical body, kinship/ethnicity, and a moral orientation away from God. The NIV (1984) influenced many later translations by rendering sarx as “sinful nature” in Romans 8 and elsewhere. The move clarifies one reading but also predetermines it — Paul's argument can be read as a contrast between two ways of being human (according to flesh / according to the Spirit), not a contrast between “your sinful nature” and grace.",
    renderings: [
      { translation: "BSB", text: "Those who live according to the flesh" },
      { translation: "WEB", text: "Those who live according to the flesh" },
      { translation: "KJV", text: "they that are after the flesh" },
    ],
    tags: ["atonement"],
  },
  {
    id: "gen-1-26-adam",
    bookSlug: "genesis",
    chapter: 1,
    verses: [26, 27, 28],
    headline: "ʾadam: \"man,\" \"Adam,\" or \"the human\"?",
    term: "ʾadam / hāʾādām",
    script: "אָדָם / הָאָדָם",
    language: "Hebrew",
    summary:
      "Hebrew ʾadam is built from adamah (\"ground, earth\"). It functions as a category term for humanity, a generic singular (\"the human\"), and a proper name (\"Adam\") — sometimes within the same passage. English Bibles usually pick one rendering and lose the wordplay; readings of Genesis 1-3 turn on which one.",
    body:
      "ʾadam is etymologically tied to adamah (\"ground, soil\") — the human is the earth-creature, made from the dirt. In Genesis 1:26-27 the term names humanity as a category (\"let us make ʾadam in our image\") and is immediately glossed as plural — \"male and female he created them.\" In Genesis 2-3, the same word appears with and without the definite article (hāʾādām, \"the human\"), and most modern scholars read the article-bearing form as a generic singular (\"the earth-creature\") rather than a proper name; the name \"Adam\" emerges in chapter 4-5 as the article drops.\n\nThis matters for at least three reading questions. (1) Is the first human of Genesis 2 a man, or an undifferentiated human from whom sexual difference is later drawn? Phyllis Trible (God and the Rhetoric of Sexuality) and others have argued the latter — the ish (man) / ishshah (woman) language only appears after the side/rib is taken. (2) Does the imago Dei attach to a male individual or to humanity-as-such? Genesis 1:27 places it on the male-and-female plural. (3) Should English translation preserve the earth-pun? Robert Alter renders \"the human\" precisely to keep the adamah / ʾadam wordplay audible. Most evangelical translations render \"man\" or \"Adam\" throughout and lose both the pun and the ambiguity. The Hebrew supports either choice; the cost of \"man\" / \"Adam\" is foreclosing readings the Hebrew leaves open.",
    renderings: [
      { translation: "BSB", text: "Let Us make man in Our image… male and female He created them" },
      { translation: "WEB", text: "Let’s make man in our image… male and female he created them" },
      { translation: "KJV", text: "Let us make man in our image… male and female created he them" },
      { translation: "Alter", text: "Let us make a human in our image, by our likeness… male and female He created them" },
    ],
    tags: ["gender", "creation"],
  },
  {
    id: "lev-18-22-toevah",
    bookSlug: "leviticus",
    chapter: 18,
    verses: [22],
    headline: "toʿevah: \"abomination,\" or ritually out of category?",
    term: "toʿevah",
    script: "תּוֹעֵבָה",
    language: "Hebrew",
    summary:
      "English \"abomination\" carries 17th-century moral revulsion. The Hebrew toʿevah is closer to \"category-violation\" — something ritually or culturally out of place. The same word covers eating shrimp (Lev 11), wearing mixed fibers (Deut 22:11), and a remarried wife returning to a first husband (Deut 24:4), alongside the male-male intercourse prohibition of Lev 18:22.",
    body:
      "Toʿevah occurs around 117 times in the Hebrew Bible. Its semantic range covers ritual impurity (Lev 11 dietary prohibitions), boundary violations (mixed fibers, ploughing with mixed teams), cultic-foreign practices (Deut 12:31, Egyptian shepherds in Gen 46:34), and serious moral wrongs (deceit in Prov 11:1, child sacrifice in Deut 12:31). It is not a univocal moral category. Mary Douglas's Purity and Danger and subsequent scholarship (Jacob Milgrom's Leviticus 17-22 commentary; the Anchor Bible) emphasize the category-violation register: toʿevah names what is out of place in a given symbolic system, not what is intrinsically evil.\n\nThe KJV's \"abomination\" — inherited by most major English translations — collapses this range into a single English term loaded with 17th-century moral revulsion. The result is that Lev 18:22 and 20:13 sound like an unambiguous categorical moral judgment, while Lev 11's identical word applied to shrimp sounds like a quaint cultic taboo. Readers without access to the Hebrew get the impression that scripture distinguishes these passages by intensity when the lexical evidence does not.\n\nWhat to do with this is contested. Some translators argue \"abomination\" is now misleading and prefer \"detestable thing,\" \"taboo,\" or \"ritually impermissible.\" Others retain \"abomination\" but argue the reader should be taught the term covers a wide range. Affirming scholarship (William Loader, James Brownson) leans on the category-violation reading to argue Lev 18:22 belongs to the holiness code's symbolic-order concerns rather than a stand-alone moral absolute. Traditional scholarship (Robert Gagnon) argues that the moral weight of toʿevah is determinable from immediate context and that the Lev 18 prohibitions are moral in register. The Hebrew supports a long argument; the English flattens it.",
    renderings: [
      { translation: "BSB", text: "it is an abomination" },
      { translation: "WEB", text: "It is an abomination" },
      { translation: "KJV", text: "it is abomination" },
      { translation: "Alter", text: "it is an abhorrence" },
      { translation: "JPS (Jewish)", text: "it is an abhorrence" },
    ],
    tags: ["sexuality"],
  },
  {
    id: "psa-16-10-sheol",
    bookSlug: "psalms",
    chapter: 16,
    verses: [10],
    headline: "sheol / hades: \"hell,\" \"the grave,\" or the realm of the dead?",
    term: "sheol / hadēs",
    script: "שְׁאוֹל / ᾅδης",
    language: "Hebrew",
    summary:
      "Hebrew sheol is the underworld realm of the dead — a shared place all the dead descend to, not a punitive afterlife. Greek hadēs is its Septuagint equivalent. The KJV's \"hell\" for both — alongside its \"hell\" for geenna — folded three distinct Bible-world categories into one English word.",
    body:
      "Sheol appears 65 times in the Hebrew Bible. It names the realm of the dead — a shadowy underworld where the dead exist in diminished form (Eccl 9:5-10; Ps 6:5; 88:10-12; Job 7:9-10). It is not punitive; the righteous descend there too (Gen 37:35; 1 Sam 28; Ps 16:10). The Hebrew Bible's afterlife geography is largely undifferentiated — moral sorting into reward and punishment is a later development that becomes explicit in Second Temple Jewish literature (1 Enoch, 4 Ezra) and the New Testament.\n\nThe Septuagint translated sheol as hadēs throughout, importing the Greek mythological term but functionally preserving the meaning: the place all the dead go. The New Testament inherits this — hadēs in Acts 2:27/31 (quoting Ps 16:10), Matthew 11:23, Luke 16:23, and Revelation 1:18 is the realm of the dead, not the place of final judgment. Geenna (a separate word; see the entry on Matt 5:22) is what Jesus uses for the place of fiery judgment.\n\nThe KJV used \"hell\" to translate sheol, hadēs, geenna, and even tartaroō (2 Pet 2:4) — four distinct terms collapsed into one. Modern translations vary: NIV and ESV typically use \"the realm of the dead\" or \"the grave\" for sheol/hadēs and \"hell\" for geenna; the NRSV transliterates Sheol and Hades. The pastoral and theological stakes are significant — the Bible-world geography of the afterlife is more nuanced and less univocal than \"hell\" in modern English assumes.",
    renderings: [
      { translation: "BSB", text: "For You will not abandon my soul to Sheol" },
      { translation: "WEB", text: "you will not leave my soul in Sheol" },
      { translation: "KJV", text: "For thou wilt not leave my soul in hell" },
      { translation: "Alter", text: "For You will not forsake my life to Sheol" },
    ],
    tags: ["afterlife"],
  },
  {
    id: "ecc-3-11-olam",
    bookSlug: "ecclesiastes",
    chapter: 3,
    verses: [11],
    headline: "ʿolam: \"eternity,\" \"the age,\" or \"the world\" in the heart?",
    term: "ʿolam",
    script: "עוֹלָם",
    language: "Hebrew",
    summary:
      "ʿolam covers a long-stretching duration — \"age,\" \"forever,\" \"of old,\" \"world\" — and which sense is in view is contested across passages. Ecclesiastes 3:11 puts ʿolam in the human heart, and translators diverge: \"eternity,\" \"a sense of past and future,\" \"the world,\" \"timelessness.\"",
    body:
      "ʿolam is the Hebrew Bible's primary term for very long duration. In Genesis 6:4 it describes the distant past (\"men of renown of old\"); in Psalm 90:2 it names God's permanence (\"from everlasting to everlasting\"); in Ecclesiastes 3:11 it is something God placed in the human heart. The lexical core is \"long-stretching, far-reaching duration\" — past, future, or both — but it lacks a built-in distinction between \"a very long age\" and \"genuinely infinite time.\"\n\nThis matters in two places. (1) ʿolam is the Hebrew counterpart to the Greek aiōn / aiōnios debate (see the aiōnios entry); the same ambiguity carries into the Septuagint and on into Christian eschatology. (2) Ecclesiastes 3:11 has produced an unusually wide spread of English renderings: \"eternity\" (NIV, ESV, NRSV), \"a sense of past and future\" (NEB), \"timelessness\" (Alter, drawing on Fox's commentary), even \"the world\" (medieval Jewish commentators, picking up the spatial-totality sense ʿolam later acquires in rabbinic Hebrew). Robert Alter glosses it as the human awareness of vast time — past and future stretching beyond comprehension — which intensifies the verse's pathos: God has given humans an awareness of the long sweep of time that exceeds what they can grasp.",
    renderings: [
      { translation: "BSB", text: "He has also set eternity in the hearts of men" },
      { translation: "WEB", text: "He has also set eternity in their hearts" },
      { translation: "KJV", text: "he hath set the world in their heart" },
      { translation: "Alter", text: "He has put eternity in their mind" },
      { translation: "NEB", text: "he has given men a sense of time past and future" },
    ],
    tags: ["afterlife", "creation"],
  },
  {
    id: "gen-2-23-basar",
    bookSlug: "genesis",
    chapter: 2,
    verses: [23, 24],
    headline: "basar: \"flesh,\" kinship, and \"one flesh\"",
    term: "basar",
    script: "בָּשָׂר",
    language: "Hebrew",
    summary:
      "Hebrew basar (\"flesh\") covers physical flesh, kinship (\"flesh of my flesh\" = \"my own family\"), and humanity-as-such. Genesis 2:24's \"one flesh\" plays on all three registers; reading it strictly as sexual union flattens the kinship dimension that the surrounding verses establish.",
    body:
      "Basar appears about 270 times in the Hebrew Bible. Its registers include: physical flesh of bodies, human or animal (Gen 40:19; Lev 1:6); humanity as such, often in the phrase \"all flesh\" (kol basar) (Gen 6:12; Joel 2:28); and kinship — \"my flesh\" or \"flesh of my flesh\" means \"my own family / my own kin\" (Gen 29:14; Judg 9:2; 2 Sam 5:1; 19:12-13).\n\nGenesis 2:23 deploys all three registers in two verses. The earth-creature's recognition speech — \"bone of my bones, basar of my basar\" — uses the kinship idiom: this is one of my own kind. The narrator's comment in v24 (\"and they become one basar\") draws together the physical, kinship, and humanity-as-such senses simultaneously. To read \"one flesh\" strictly as sexual union — as many evangelical marriage-theology constructions do — narrows the phrase to one register where the Hebrew is deliberately working in three. Phyllis Trible's (God and the Rhetoric of Sexuality) reading, picked up by Brueggemann and later commentators, treats Gen 2:24 as a kinship-creating claim — marriage makes new family from non-family — with the sexual dimension as one expression of that, not the whole. The complementary affirming use (Brownson, Bible, Gender, Sexuality) extends this: if one-flesh union is kinship-creation, the gender-asymmetric construals built atop the verse rest on a narrower reading than the Hebrew supports.",
    renderings: [
      { translation: "BSB", text: "bone of my bones and flesh of my flesh… they become one flesh" },
      { translation: "WEB", text: "bone of my bones, and flesh of my flesh… they will be one flesh" },
      { translation: "KJV", text: "bone of my bones, and flesh of my flesh… they shall be one flesh" },
      { translation: "Alter", text: "bone of my bones and flesh of my flesh… they become one flesh" },
    ],
    tags: ["gender", "creation"],
  },
  {
    id: "jhn-1-1-logos",
    bookSlug: "john",
    chapter: 1,
    verses: [1, 14],
    headline: "logos: \"Word,\" \"reason,\" or the cosmic ordering principle?",
    term: "logos",
    script: "λόγος",
    language: "Greek",
    summary:
      "Logos in Greek covers \"word,\" \"speech,\" \"reason,\" and \"account.\" In John 1:1 it draws on Stoic and Hellenistic-Jewish philosophy (Philo's Logos as cosmic mediator) as much as on the Hebrew dabar. English \"Word\" picks one register and quietly drops the philosophical inheritance.",
    body:
      "Logos has a wide lexical range in classical and Hellenistic Greek — speech, reason, account, principle, the ordering rationality of the cosmos. Stoic philosophy used logos for the rational principle animating the universe. Hellenistic-Jewish philosophy, especially Philo of Alexandria writing in the early 1st century CE, used Logos as a name for a divine mediator-figure standing between transcendent God and creation.\n\nJohn 1:1's prologue draws on this multi-stranded background while also echoing the Hebrew Bible — Genesis 1's \"and God said\" and the personification of Wisdom in Proverbs 8 and Sirach 24. The result is deliberately layered: the Logos is the dabar (word) by which God creates, the sophia (wisdom) through which God orders, and the rational principle that pervades the cosmos. Translating monolithically as \"Word\" preserves the Genesis 1 echo but loses the philosophical and sapiential resonances. Some translators (Moffatt, the New English Bible, Robert Alter) have experimented with \"Reason,\" \"Word,\" or transliterating \"Logos\"; none catches all the registers John seems to want.",
    renderings: [
      { translation: "BSB", text: "In the beginning was the Word" },
      { translation: "WEB", text: "In the beginning was the Word" },
      { translation: "KJV", text: "In the beginning was the Word" },
      { translation: "Moffatt", text: "The Logos existed in the very beginning" },
    ],
    tags: ["creation", "christology"],
  },
  {
    id: "jhn-3-3-anothen",
    bookSlug: "john",
    chapter: 3,
    verses: [3, 7],
    headline: "\"Born again\" or \"born from above\"? — gennēthēnai anōthen",
    term: "anōthen",
    script: "ἄνωθεν",
    language: "Greek",
    summary:
      "Anōthen means both \"again\" (temporal) and \"from above\" (spatial). Nicodemus hears \"again\" and asks how a grown man can re-enter the womb; Jesus appears to mean \"from above.\" The Greek puns deliberately. English picks one and loses the joke.",
    body:
      "Anōthen carries two senses in Greek: \"again\" (temporal — a second time) and \"from above\" (spatial — from the higher place, often a way of saying \"from God\"). John 3:3 trades on the ambiguity. Nicodemus hears \"born again\" and asks the literal-minded question — how can a grown man re-enter his mother's womb? Jesus's reply in v5-8 about water and spirit, wind blowing where it wills, makes plain that the intended sense is \"from above\" / \"from God,\" not \"a second time.\"\n\nThis is one of the clearest places in the New Testament where the English translation tradition has propagated one half of a deliberate Greek pun and made the dialogue make less sense than it does in Greek. The KJV's \"born again\" — inherited by most evangelical translations — also became the brand name for an entire wing of American Protestantism, which makes correcting it in revision politically costly. The NRSV moves to \"born from above\" with a footnote on \"again\"; most other translations retain \"born again.\" The dispute is not whether anōthen has both senses — it does — but which one to foreground.",
    renderings: [
      { translation: "BSB", text: "unless he is born again" },
      { translation: "WEB", text: "unless one is born anew" },
      { translation: "KJV", text: "Except a man be born again" },
      { translation: "NRSVue (paid)", text: "no one can see the kingdom of God without being born from above" },
    ],
    tags: ["atonement"],
  },
  {
    id: "rom-3-25-hilasterion",
    bookSlug: "romans",
    chapter: 3,
    verses: [25],
    headline: "hilastērion: \"propitiation,\" \"expiation,\" or \"mercy seat\"?",
    term: "hilastērion",
    script: "ἱλαστήριον",
    language: "Greek",
    summary:
      "Hilastērion can mean \"propitiation\" (averting wrath), \"expiation\" (covering sin), or — drawing on the Septuagint — the lid of the ark of the covenant (the kapporet / mercy seat). The choice shapes the entire atonement theology of Romans 3.",
    body:
      "Hilastērion has three live readings in Romans 3:25. (1) Propitiation: an offering that turns away wrath. This reading, dominant in Reformation theology and revived by Leon Morris, takes the verse to mean Christ's death satisfies divine wrath against sin. (2) Expiation: an offering that covers, cleanses, or removes sin. C. H. Dodd argued in the 1930s that hilastērion in Septuagint usage names the cleansing of sin, not the placation of wrath, and this reading dominated mid-20th-century English mainline scholarship. (3) Mercy seat: the Septuagint uses hilastērion for the kapporet, the lid of the ark of the covenant on which the high priest sprinkled blood on Yom Kippur (Lev 16). On this reading — defended by Daniel Bailey, N. T. Wright, and others — Paul is naming Christ as the Day of Atonement meeting-place where God's holiness and human sin are dealt with.\n\nThe English translation tradition has tracked these debates. KJV uses \"propitiation\" (inherited from the Vulgate's propitiationem); RSV famously switched to \"expiation\"; NIV reverted to \"sacrifice of atonement\"; NRSV used \"sacrifice of atonement\"; NLT uses \"sacrifice for sin.\" \"Mercy seat\" appears in footnotes more than text. The atonement theology each choice implies is not subtle: propitiation centers wrath, expiation centers cleansing, mercy seat centers covenant-meeting.",
    renderings: [
      { translation: "BSB", text: "God presented Him as the atoning sacrifice" },
      { translation: "WEB", text: "whom God set forth to be an atoning sacrifice" },
      { translation: "KJV", text: "Whom God hath set forth to be a propitiation" },
      { translation: "NRSVue (paid)", text: "whom God put forward as a sacrifice of atonement" },
    ],
    tags: ["atonement"],
  },
  {
    id: "1co-6-9-porneia",
    bookSlug: "1-corinthians",
    chapter: 6,
    verses: [9, 13, 18],
    headline: "porneia: \"sexual immorality,\" or a specific list?",
    term: "porneia",
    script: "πορνεία",
    language: "Greek",
    summary:
      "Porneia is the New Testament's catch-all term for sexual wrong. Its original sense is tied to porn­ē (prostitute) — sex involving a prostitute — but by the 1st century it had widened to a general category. What that category covered, and which behaviors fall inside it, is the long argument.",
    body:
      "Porneia originally named sex involving a pornē (prostitute). By the 1st century CE its usage had widened in Jewish and early Christian texts to a general category of sexual wrong — but the boundaries of that category are exactly the contested question. In a Jewish context, porneia often referred to the sexual prohibitions of Leviticus 18 and 20 (incest, adultery, male same-sex intercourse, bestiality). In Greco-Roman context it could name prostitution, fornication outside marriage, or sex with slaves.\n\nThe interpretive stakes are large because porneia appears in: the Jerusalem Council's prohibitions on Gentile converts (Acts 15:20, 29), Jesus's exception clause for divorce (Matt 5:32, 19:9), and most of Paul's vice lists. What counts as porneia in each context shapes Christian sexual ethics across denominations.\n\nTraditional readings (Robert Gagnon, Preston Sprinkle) treat porneia as a broad category covering all extramarital and same-sex intercourse, anchored in the Levitical prohibitions. Affirming readings (James Brownson, William Loader) argue porneia named a specific cultural register — temple prostitution, exploitative sex, coerced sex — and that extending it categorically to monogamous same-sex relationships imports modern categories into a 1st-century word. The textual evidence supports a long argument; the lexicons (BDAG, Loader's 5-volume monograph) catalog the range without settling it.",
    renderings: [
      { translation: "BSB", text: "Flee from sexual immorality" },
      { translation: "WEB", text: "Flee sexual immorality" },
      { translation: "KJV", text: "Flee fornication" },
    ],
    tags: ["sexuality"],
  },
  {
    id: "psa-23-1-chesed",
    bookSlug: "psalms",
    chapter: 23,
    verses: [6],
    headline: "chesed: \"mercy,\" \"lovingkindness,\" or covenant loyalty?",
    term: "chesed",
    script: "חֶסֶד",
    language: "Hebrew",
    summary:
      "Chesed is one of the central theological words of the Hebrew Bible — and one of the hardest to render in English. It names covenant loyalty, faithful love that exceeds obligation. \"Mercy\" (KJV) misses the covenantal weight; \"lovingkindness\" tries to compensate by inventing an English compound; \"steadfast love\" (RSV/NRSV) is a paraphrase.",
    body:
      "Chesed appears about 245 times in the Hebrew Bible. It names the kind of love that holds together a covenant relationship — love that does what loyalty requires, but also love that exceeds the strict letter of obligation, doing more than is owed. It is the word for the love between Ruth and Naomi (Ruth 1:8; 3:10), between David and Jonathan (1 Sam 20:8, 14-15), and pre-eminently for God's covenant love for Israel (Ex 34:6-7; Ps 136 — twenty-six repetitions of ki l'olam chasdo).\n\nNo English word maps cleanly. The KJV's \"mercy\" or \"lovingkindness\" captures the warmth but misses the covenant. The RSV's \"steadfast love\" gestures at faithfulness but is wordy. JPS translations often use \"kindness\" or \"faithfulness\" depending on context. Robert Alter renders chesed variously as \"kindness,\" \"faithful kindness,\" or \"steadfast kindness\" depending on register. Some commentators argue chesed should be transliterated and footnoted — like shalom, it carries too much for English.\n\nWhat's at stake: when readers encounter \"mercy\" in Psalm 23:6 (\"surely goodness and mercy shall follow me\"), the English connotation is divine forgiveness or pity. The Hebrew sense is covenant loyalty — God's chesed pursuing the psalmist not because the psalmist is pitiable but because God is faithful to the covenant. The theology shifts with the gloss.",
    renderings: [
      { translation: "BSB", text: "Surely goodness and mercy will follow me" },
      { translation: "WEB", text: "Surely goodness and loving kindness shall follow me" },
      { translation: "KJV", text: "Surely goodness and mercy shall follow me" },
      { translation: "Alter", text: "Let but goodness and kindness pursue me" },
      { translation: "JPS (Jewish)", text: "Only goodness and steadfast love shall pursue me" },
    ],
    tags: ["atonement"],
  },
  {
    id: "amo-5-24-mishpat-tzedakah",
    bookSlug: "amos",
    chapter: 5,
    verses: [24],
    headline: "mishpat / tzedakah: \"justice,\" \"righteousness,\" or social order?",
    term: "mishpat / tzedakah",
    script: "מִשְׁפָּט / צְדָקָה",
    language: "Hebrew",
    summary:
      "Hebrew mishpat (\"justice,\" \"judgment\") and tzedakah (\"righteousness,\" \"right relationship\") are paired throughout the prophets. English translations often split them — \"justice\" for one, \"righteousness\" for the other — and lose the prophets' insistence that righteousness IS social justice.",
    body:
      "Mishpat names the right ordering of community life: the judgments a court makes, the standards a society holds, the way the vulnerable are treated. Tzedakah names being in right relationship — to God, to neighbor, to the covenant community. The two words are paired throughout the Hebrew Bible (Gen 18:19; Isa 1:21; 9:7; 28:17; Jer 22:3; Ezek 18:5, 21; Amos 5:7, 24; Mic 6:8), and the pairing is not redundant — it specifies that being in right relationship (tzedakah) shows up concretely as right social order (mishpat).\n\nEnglish has split these into \"justice\" and \"righteousness,\" which carry mostly separate connotations in modern usage — \"justice\" sounds civic and procedural; \"righteousness\" sounds personal and moral. The Hebrew Bible uses them as a hendiadys: one reality named twice. When Amos 5:24 says \"let mishpat roll down like waters and tzedakah like a perennial stream,\" he is not naming two virtues; he is naming one — a society where right relationship is enacted as social justice. Splitting the words flattens the protest.\n\nThis matters interpretively. Christian usage of \"righteousness\" has often domesticated it into personal piety — being a righteous person means being morally good. The Hebrew register, especially in the prophets, anchors righteousness in how the poor and the marginalized are treated. Reading the New Testament \"righteousness\" (dikaiosynē) language back through the Hebrew clarifies why Paul's gospel of \"the righteousness of God\" is not merely about individual standing but about cosmic restoration of right relations (the central argument of N. T. Wright's Justification).",
    renderings: [
      { translation: "BSB", text: "let justice roll on like a river, and righteousness like an ever-flowing stream" },
      { translation: "WEB", text: "let justice roll on like rivers, and righteousness like a mighty stream" },
      { translation: "KJV", text: "let judgment run down as waters, and righteousness as a mighty stream" },
      { translation: "JPS (Jewish)", text: "Let justice well up like water, righteousness like an unfailing stream" },
    ],
    tags: ["authority"],
  },
  {
    id: "isa-9-6-shalom",
    bookSlug: "isaiah",
    chapter: 9,
    verses: [6, 7],
    headline: "shalom: \"peace,\" or wholeness, completeness, flourishing?",
    term: "shalom",
    script: "שָׁלוֹם",
    language: "Hebrew",
    summary:
      "Shalom is far wider than English \"peace.\" Its semantic core is wholeness, completeness, well-being — peace is one expression of that wholeness, not the whole. \"Prince of Peace\" (Isaiah 9:6) renders Sar Shalom; the Hebrew titles a ruler of cosmic completeness, not a pacifist.",
    body:
      "Shalom occurs over 200 times in the Hebrew Bible. Its root means \"to be whole, complete, sound, intact.\" From that core meaning come the more specific senses: peace (the absence of war is one form of intactness), prosperity (a household that is whole and provided for), health (bodily intactness), and the covenant well-being that comes from right relation to God. Greeting someone with shalom asks after their wholeness across all these dimensions.\n\nEnglish \"peace\" is narrower. It primarily names the absence of conflict (international peace, inner peace, peace and quiet). Translating shalom monolithically as \"peace\" preserves the most common register but loses the wider semantic field. In particular, \"Prince of Peace\" in Isaiah 9:6 has come to sound like a pacifist title — a ruler who avoids war. The Hebrew Sar Shalom names a ruler whose reign brings wholeness, completeness, and flourishing to the people — political stability, economic provision, covenant fidelity, and yes, peace. The pacifist reading is one inference from that wholeness, not the title itself.\n\nWalter Brueggemann's Peace and Cornelius Plantinga's Not the Way It's Supposed to Be both build sustained theological cases for translating and preaching shalom as cosmic wholeness rather than absence of conflict. The translation choice shapes how Christians understand the kingdom of God: as ceasefire, or as restored flourishing.",
    renderings: [
      { translation: "BSB", text: "Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace" },
      { translation: "WEB", text: "Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace" },
      { translation: "KJV", text: "Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace" },
      { translation: "JPS (Jewish)", text: "Pele-joez-el-gibbor-Abi-ad-sar-shalom" },
    ],
    tags: ["creation", "messianic"],
  },
  {
    id: "1jn-4-8-agape",
    bookSlug: "1-john",
    chapter: 4,
    verses: [7, 8, 16],
    headline: "agapē, phileō, eros: did Greek really have a hierarchy of love?",
    term: "agapē / phileō / erōs / storgē",
    script: "ἀγάπη / φιλέω / ἔρως / στοργή",
    language: "Greek",
    summary:
      "C. S. Lewis's Four Loves popularized the idea that Greek had four distinct kinds of love — agapē highest, eros lowest. The actual Greek usage is much messier; agapē and phileō overlap heavily in the New Testament, including in John 21's famous Peter dialogue.",
    body:
      "The popular Christian teaching — that Greek has four distinct words for love arranged hierarchically — comes mostly from C. S. Lewis's The Four Loves (1960), which itself drew on Anders Nygren's Agape and Eros (1930). The claim is that agapē names the self-giving, sacrificial love unique to Christian theology; phileō names friendship; erōs names romantic/sexual love; and storgē names familial affection. This neat schema gets preached often and is mostly not supported by 1st-century Greek usage.\n\nIn practice, agapē and phileō overlap heavily in Septuagint and New Testament Greek. The LXX uses agapaō for Amnon's incestuous love for Tamar (2 Sam 13:1) and for love of money (Eccl 5:10) — hardly sacrificial self-giving. The Gospel of John uses agapaō and phileō more or less interchangeably (cf. John 3:35 with 5:20; 14:23 with 16:27). The famous John 21 dialogue, where Jesus asks Peter three times \"do you agapaō me?\" and Peter answers \"I phileō you\" — and then on the third round Jesus switches to phileō — has been preached for centuries as Jesus condescending to Peter's weaker love. Most modern Johannine scholarship reads it as stylistic variation, not theological gradient.\n\nThis matters because the Four Loves framework shapes Christian preaching about love, sexuality, and friendship. The Greek itself doesn't support a clean hierarchy; the theology built atop it should be more carefully grounded than \"the Greeks had a special word for the love we mean.\" 1 John 4:8 (\"God is agapē\") is a serious theological claim; the seriousness is not because agapē is a uniquely Christian word but because of what John says about it.",
    renderings: [
      { translation: "BSB", text: "God is love" },
      { translation: "WEB", text: "God is love" },
      { translation: "KJV", text: "God is love" },
    ],
    tags: ["atonement"],
  },
  {
    id: "act-2-42-koinonia",
    bookSlug: "acts",
    chapter: 2,
    verses: [42, 44, 45],
    headline: "koinōnia: \"fellowship,\" \"communion,\" or shared property?",
    term: "koinōnia",
    script: "κοινωνία",
    language: "Greek",
    summary:
      "Koinōnia in 1st-century Greek named partnership, shared participation in something — including shared finances. Acts 2:42 places it next to having all things in common (v44-45). \"Fellowship\" — the standard English gloss — sanitizes the economic register.",
    body:
      "Koinōnia comes from koinos (\"common\") and names participation, partnership, sharing — including the very concrete sharing of resources. In 1st-century Greek the word was used for business partnerships, civic associations, marriage as shared household economy, and any voluntary arrangement where participants held things in common.\n\nActs 2:42 names koinōnia as one of four marks of the earliest Jerusalem community — the apostles' teaching, koinōnia, breaking of bread, and the prayers. Two verses later, Luke spells out what koinōnia meant in practice: \"all who believed were together and had all things in common; they would sell their possessions and goods and distribute the proceeds to all, as any had need.\" Paul uses the same word for the Macedonian and Achaean churches' financial collection for the Jerusalem poor (Rom 15:26; 2 Cor 8:4; 9:13). Koinōnia in the New Testament includes the church's pocketbook.\n\nThe English \"fellowship\" — the KJV gloss inherited by most translations — has narrowed in modern usage to social gathering: coffee hour, small group, hangtime. Translating koinōnia as \"fellowship\" in Acts 2:42 and the Pauline collection texts has the unfortunate effect of separating early Christian sharing of life from early Christian sharing of money. Modern translators face a choice: retain \"fellowship\" and accept the loss, expand to \"sharing in common life\" or \"partnership,\" or — as some recent commentators (Justo González, Acts: A Theological Commentary) suggest — translate the Acts 2 occurrences as \"sharing all things\" to preserve the economic register.",
    renderings: [
      { translation: "BSB", text: "They devoted themselves to the apostles' teaching and to the fellowship" },
      { translation: "WEB", text: "They continued steadfastly in the apostles' teaching and fellowship" },
      { translation: "KJV", text: "they continued stedfastly in the apostles' doctrine and fellowship" },
    ],
    tags: ["authority"],
  },
  {
    id: "rom-12-2-metanoia",
    bookSlug: "romans",
    chapter: 12,
    verses: [2],
    headline: "metanoia: \"repent,\" or change of mind?",
    term: "metanoia / metamorphoō",
    script: "μετάνοια / μεταμορφόω",
    language: "Greek",
    summary:
      "Metanoia is built from meta- (after, with, change) + nous (mind). Its lexical sense is \"change of mind\" or \"change of perception.\" The English \"repent\" — inherited from Latin paenitentia (\"penance\") — narrows it to remorse for sin, which is one possible outcome of metanoia but not its lexical core.",
    body:
      "Metanoia appears 22 times in the New Testament and the verb metanoeō 34 times — the central Greek term for the transformation the gospel calls for. Lexically the word means \"change of mind,\" \"change of perception,\" \"after-thought\" in the sense of revised understanding. In classical Greek it ranged from a change of plans to a fundamental reorientation of how one sees something.\n\nThe Latin translation tradition rendered metanoia as paenitentia (\"penance,\" \"sorrow for sin\") — a choice that, when inherited by English as \"repent\" / \"repentance,\" narrowed the semantic range considerably. Erasmus famously objected in his 1516 Greek New Testament notes that paenitentia missed the point: the Greek calls for a change of mind that may or may not include sorrow. Luther's 1517 Theses opened with the claim that when Christ said metanoeite, \"he willed the entire life of believers to be one of repentance\" — but Luther was already arguing against the late-medieval reduction of metanoia to the sacrament of penance.\n\nThis matters for how the New Testament's call to transformation gets heard. \"Repent\" in modern English often sounds like \"feel bad about your sin\" — a moment of remorse. The Greek metanoia names something larger: a reorientation of how one sees God, self, neighbor, and the world. John the Baptist's metanoia is not a sad feeling but a reorganized life (Luke 3:10-14). Paul's metamorphousthe in Romans 12:2 (\"be transformed by the renewing of your nous\") names the same process from the other side — letting one's mind be reshaped. Translators face a choice: retain \"repent\" and accept the late-medieval narrowing, or expand to \"change your mind,\" \"think differently,\" \"reorient,\" \"be transformed.\"",
    renderings: [
      { translation: "BSB", text: "be transformed by the renewing of your mind" },
      { translation: "WEB", text: "be transformed by the renewing of your mind" },
      { translation: "KJV", text: "be ye transformed by the renewing of your mind" },
    ],
    tags: ["atonement"],
  },
  {
    id: "luk-1-46-magnificat",
    bookSlug: "luke",
    chapter: 1,
    verses: [51, 52, 53],
    headline: "Mary's Magnificat: completed action or future hope?",
    term: "aorist + hyperēphanous",
    script: "καθεῖλεν · ὕψωσεν · ἐνέπλησεν",
    language: "Greek",
    summary:
      "Mary's song uses Greek aorist verbs — past-tense forms — to describe God scattering the proud, bringing down rulers, lifting up the lowly, filling the hungry, sending the rich away empty. Translators must decide: render as past (\"he has brought down\") and follow the Greek tense literally, or as future hope. The political register changes either way.",
    body:
      "The Magnificat (Luke 1:46-55) is structured around six aorist verbs describing what God has done: scattered the proud, brought down rulers, lifted up the lowly, filled the hungry, sent the rich away empty, helped Israel. Greek aorist is typically translated as English simple past — \"he scattered, he brought down.\" That literal rendering produces a song that announces God has already overturned the social order — before Jesus is even born.\n\nSome translators have softened this. Renderings like \"he scatters the proud,\" \"he brings down rulers,\" treat the aorists as gnomic — describing what God characteristically does — and pull the political claim out of the past tense into a general principle. Other translators, especially those reading Luke as a politically charged narrative, retain the past-tense rendering: God has already done these things, in the conception of the messiah, before his birth or ministry.\n\nThe interpretive stakes are not minor. The Magnificat's reception history includes its banning from public recitation in three different colonial contexts (British India, Guatemala under the junta, Argentina under the generals) for being politically dangerous — and that danger is sharper if the verbs are past indicative announcements of accomplished reversal than if they are general principles awaiting fulfillment. Robert Alter's translation principles (preserve the tense of the source language; do not modernize what is unsettling) would push toward retaining the aorist as past. Most English translations split the difference, producing softer language than the Greek demands.",
    renderings: [
      { translation: "BSB", text: "He has performed mighty deeds with His arm… He has brought down rulers from their thrones, but has exalted the humble" },
      { translation: "WEB", text: "He has shown strength with his arm. He has scattered the proud… He has put down princes from their thrones. And has exalted the lowly" },
      { translation: "KJV", text: "He hath shewed strength with his arm; he hath scattered the proud… He hath put down the mighty from their seats, and exalted them of low degree" },
    ],
    tags: ["authority"],
  },
  {
    id: "phm-1-doulos",
    bookSlug: "philemon",
    chapter: 1,
    verses: [16],
    headline: "doulos: \"servant\" or \"slave\" across the New Testament?",
    term: "doulos",
    script: "δοῦλος",
    language: "Greek",
    summary:
      "Doulos in 1st-century Greek usage refers to a person held as property in the Greco-Roman slave system. English translations have rendered it variously as \"servant,\" \"bondservant,\" or \"slave\" — each choice shapes how the reader hears Paul's argument in Philemon, the household codes, and Jesus's teaching.",
    body:
      "In Greco-Roman society a doulos was someone owned, bought, and held as property. The institution was widespread and legally codified; the social register of the word is unambiguous in its historical setting.\n\nEnglish translation has moved over time. The KJV used \"servant\" throughout, a choice consistent with 17th-century English usage where \"servant\" covered a wide range of unfree and contractual labor. Modern English has narrowed \"servant\" to wage labor, and increasingly many translations after about 2000 use \"slave\" or \"bondservant\" to communicate the institutional reality more directly. Defenders of \"servant\" or \"bondservant\" note that the metaphorical use of doulos for discipleship (\"servant of Christ\") doesn't read naturally with \"slave\" in English and that some passages — like Paul's self-description as a doulos of Christ — appropriate the term as a marker of devoted belonging rather than oppression. Defenders of \"slave\" argue that the Letter to Philemon, the household codes, and any New Testament discussion of the institution become harder to read accurately when the social weight of the word is muted.",
    renderings: [
      { translation: "BSB", text: "no longer as a slave, but better than a slave" },
      { translation: "WEB", text: "no longer as a slave, but more than a slave" },
      { translation: "KJV", text: "not now as a servant, but above a servant" },
    ],
    tags: ["slavery"],
  },
];

// Lookups
const BY_CHAPTER = new Map<string, BiasFlag[]>();
const BY_VERSE = new Map<string, BiasFlag[]>();
for (const f of BIAS_FLAGS) {
  const cKey = `${f.bookSlug}/${f.chapter}`;
  if (!BY_CHAPTER.has(cKey)) BY_CHAPTER.set(cKey, []);
  BY_CHAPTER.get(cKey)!.push(f);
  for (const v of f.verses) {
    const vKey = `${f.bookSlug}/${f.chapter}/${v}`;
    if (!BY_VERSE.has(vKey)) BY_VERSE.set(vKey, []);
    BY_VERSE.get(vKey)!.push(f);
  }
}

export function getFlagsForChapter(bookSlug: string, chapter: number): BiasFlag[] {
  return BY_CHAPTER.get(`${bookSlug}/${chapter}`) ?? [];
}

export function getFlagsForVerse(
  bookSlug: string,
  chapter: number,
  verse: number,
): BiasFlag[] {
  return BY_VERSE.get(`${bookSlug}/${chapter}/${verse}`) ?? [];
}

export function getFlagById(id: string): BiasFlag | undefined {
  return BIAS_FLAGS.find((f) => f.id === id);
}
