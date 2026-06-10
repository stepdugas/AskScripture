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
