import { SiteFrame } from "../components/site-frame";

type Entry = {
  year: string;
  author: string;
  title: string;
  native?: string;
  language: string;
  discipline: string;
};

type Tradition = {
  id: string;
  label: string;
  span: string;
  note: string;
  entries: Entry[];
};

const traditions: Tradition[] = [
  {
    id: "ancient-near-east",
    label: "Mesopotamia & Egypt",
    span: "c. 2100 BCE – 300 BCE",
    note: "The earliest written record of law, myth, and mortality.",
    entries: [
      { year: "c. 2100 BCE", author: "Anonymous", title: "Epic of Gilgamesh", native: "𒀭𒂍𒈾", language: "Akkadian", discipline: "Epic" },
      { year: "c. 1754 BCE", author: "Hammurabi", title: "Code of Hammurabi", native: "𒁹𒄩𒄠𒈬𒊏𒁉", language: "Akkadian", discipline: "Law" },
      { year: "c. 1550 BCE", author: "Anonymous", title: "Book of the Dead", native: "𓂋𓏤𓈖𓉐𓂋𓏏", language: "Egyptian", discipline: "Funerary" }
    ]
  },
  {
    id: "chinese",
    label: "Chinese",
    span: "c. 1000 BCE – 1800 CE",
    note: "A continuous four-thousand-year textual tradition.",
    entries: [
      { year: "c. 1000 BCE", author: "Anonymous", title: "I Ching", native: "易經", language: "Classical Chinese", discipline: "Divination" },
      { year: "c. 500 BCE", author: "Lao Tzu", title: "Tao Te Ching", native: "道德經", language: "Classical Chinese", discipline: "Philosophy" },
      { year: "c. 475 BCE", author: "Confucius (attr.)", title: "The Analects", native: "論語", language: "Classical Chinese", discipline: "Ethics" },
      { year: "c. 500 BCE", author: "Sun Tzu", title: "The Art of War", native: "孫子兵法", language: "Classical Chinese", discipline: "Strategy" },
      { year: "1791", author: "Cao Xueqin", title: "Dream of the Red Chamber", native: "紅樓夢", language: "Classical Chinese", discipline: "Novel" }
    ]
  },
  {
    id: "indian",
    label: "Indian",
    span: "c. 1500 BCE – 600 CE",
    note: "Veda, epic, sutra &mdash; the roots of Indic thought.",
    entries: [
      { year: "c. 1500 BCE", author: "Anonymous", title: "Rigveda", native: "ऋग्वेद", language: "Vedic Sanskrit", discipline: "Scripture" },
      { year: "c. 800 BCE", author: "Various ṛṣis", title: "Upaniṣads", native: "उपनिषद्", language: "Sanskrit", discipline: "Philosophy" },
      { year: "c. 300 BCE", author: "Vyāsa (attr.)", title: "Bhagavad Gītā", native: "भगवद्गीता", language: "Sanskrit", discipline: "Philosophy" },
      { year: "c. 300 BCE", author: "Kauṭilya", title: "Arthaśāstra", native: "अर्थशास्त्र", language: "Sanskrit", discipline: "Statecraft" }
    ]
  },
  {
    id: "classical-western",
    label: "Greco-Roman",
    span: "c. 750 BCE – 180 CE",
    note: "Epic, geometry, rhetoric, empire.",
    entries: [
      { year: "c. 750 BCE", author: "Homer", title: "The Iliad", native: "Ἰλιάς", language: "Greek", discipline: "Epic" },
      { year: "c. 360 BCE", author: "Plato", title: "Republic", native: "Πολιτεία", language: "Greek", discipline: "Philosophy" },
      { year: "c. 300 BCE", author: "Euclid", title: "Elements", native: "Στοιχεῖα", language: "Greek", discipline: "Mathematics" },
      { year: "29 BCE", author: "Virgil", title: "The Aeneid", native: "Aenēis", language: "Latin", discipline: "Epic" },
      { year: "180 CE", author: "Marcus Aurelius", title: "Meditations", native: "Τὰ εἰς ἑαυτόν", language: "Greek", discipline: "Stoicism" }
    ]
  },
  {
    id: "islamic",
    label: "Islamic World",
    span: "650 – 1400",
    note: "Revelation, medicine, history, the thousand nights.",
    entries: [
      { year: "c. 650", author: "Revealed to Muhammad", title: "Qur'an", native: "ٱلْقُرْآن", language: "Arabic", discipline: "Scripture" },
      { year: "c. 1025", author: "Ibn Sīnā", title: "Canon of Medicine", native: "القانون في الطب", language: "Arabic", discipline: "Medicine" },
      { year: "c. 1100", author: "Anonymous", title: "One Thousand & One Nights", native: "أَلْف لَيْلَة وَلَيْلَة", language: "Arabic", discipline: "Tales" },
      { year: "1377", author: "Ibn Khaldūn", title: "Muqaddimah", native: "المقدمة", language: "Arabic", discipline: "History" }
    ]
  },
  {
    id: "japanese",
    label: "Japanese",
    span: "712 – 1645",
    note: "Court literature, chronicle, and the way of the sword.",
    entries: [
      { year: "712", author: "Ō no Yasumaro", title: "Kojiki", native: "古事記", language: "Old Japanese", discipline: "Chronicle" },
      { year: "c. 1008", author: "Murasaki Shikibu", title: "Tale of Genji", native: "源氏物語", language: "Heian Japanese", discipline: "Novel" },
      { year: "1645", author: "Miyamoto Musashi", title: "Book of Five Rings", native: "五輪書", language: "Japanese", discipline: "Strategy" }
    ]
  },
  {
    id: "african",
    label: "African",
    span: "c. 1200 – 1958",
    note: "Oral epic, chronicle, and the modern African novel.",
    entries: [
      { year: "c. 1235", author: "Anonymous", title: "Epic of Sundiata", language: "Mandinka", discipline: "Epic" },
      { year: "c. 1321", author: "Anonymous", title: "Kebra Nagast", native: "ክብረ ነገሥት", language: "Ge'ez", discipline: "Chronicle" },
      { year: "1958", author: "Chinua Achebe", title: "Things Fall Apart", language: "English", discipline: "Novel" }
    ]
  },
  {
    id: "americas",
    label: "Indigenous Americas",
    span: "c. 1550 – 1888",
    note: "The surviving record of pre-Columbian cosmology and voice.",
    entries: [
      { year: "c. 1554", author: "Anonymous (K'iche')", title: "Popol Vuh", language: "K'iche' Maya", discipline: "Cosmology" },
      { year: "1569", author: "Bernardino de Sahagún", title: "Florentine Codex", native: "Historia General", language: "Nahuatl / Spanish", discipline: "Ethnography" },
      { year: "1855", author: "Walt Whitman", title: "Leaves of Grass", language: "English", discipline: "Poetry" }
    ]
  },
  {
    id: "modern-global",
    label: "Modern & Global",
    span: "1543 – present",
    note: "The shared texts of the scientific and rights-bearing era.",
    entries: [
      { year: "1543", author: "Copernicus", title: "De revolutionibus", language: "Latin", discipline: "Astronomy" },
      { year: "1687", author: "Newton", title: "Principia Mathematica", language: "Latin", discipline: "Physics" },
      { year: "1859", author: "Darwin", title: "On the Origin of Species", language: "English", discipline: "Biology" },
      { year: "1905", author: "Einstein", title: "Annus Mirabilis Papers", language: "German", discipline: "Physics" },
      { year: "1948", author: "United Nations", title: "Universal Declaration of Human Rights", language: "Multilingual", discipline: "Law" }
    ]
  }
];

type Source = {
  name: string;
  scope: string;
  url: string;
  license: string;
};

const sources: Source[] = [
  { name: "Project Gutenberg", scope: "70,000+ public-domain works, primarily European.", url: "https://www.gutenberg.org", license: "Public domain" },
  { name: "Chinese Text Project (ctext)", scope: "Pre-modern Chinese canon with parallel translation.", url: "https://ctext.org", license: "Public / CC" },
  { name: "Perseus Digital Library", scope: "Classical Greek and Latin texts with apparatus.", url: "https://www.perseus.tufts.edu", license: "CC BY-SA" },
  { name: "Wikisource", scope: "Multilingual community-verified editions.", url: "https://wikisource.org", license: "CC BY-SA" },
  { name: "Internet Archive", scope: "Scanned editions and preservation copies.", url: "https://archive.org", license: "Varies" },
  { name: "HathiTrust", scope: "Research-library scholarly archive.", url: "https://www.hathitrust.org", license: "Varies" },
  { name: "Sacred-Texts", scope: "Comparative religion and mythology.", url: "https://sacred-texts.com", license: "Public domain" },
  { name: "Digital Library of India", scope: "Sanskrit, Tamil, Bengali, and other Indic languages.", url: "https://dli.sanskritdictionary.com", license: "Varies" },
  { name: "Al-Maktaba al-Shamela", scope: "Classical Arabic and Islamic texts.", url: "https://shamela.ws", license: "Varies" },
  { name: "Bibliotheca Alexandrina", scope: "Arabic manuscripts and digital heritage.", url: "https://www.bibalex.org", license: "Varies" },
  { name: "World Digital Library (UNESCO)", scope: "Primary sources across world cultures.", url: "https://www.wdl.org", license: "Varies" },
  { name: "Europeana", scope: "European manuscripts, prints, and artworks.", url: "https://www.europeana.eu", license: "CC / PDM" }
];

const principles = [
  {
    id: "provenance",
    kicker: "I.",
    title: "Provenance",
    body: "Every text enters with a verified edition, translator, language, and rights basis. Upstream sources are named, not obscured."
  },
  {
    id: "plurality",
    kicker: "II.",
    title: "Plurality",
    body: "The canon is not one tradition. The library admits Greek and Sanskrit, Akkadian and K'iche', Arabic and Nahuatl."
  },
  {
    id: "longevity",
    kicker: "III.",
    title: "Longevity",
    body: "Static-first, open-format, mirrorable. The library should outlive its tools, its platforms, and its editors."
  },
  {
    id: "austerity",
    kicker: "IV.",
    title: "Austerity",
    body: "Typography carries the hierarchy. Surfaces stay quiet. Motion orients, never entertains."
  }
];

const totalTexts = traditions.reduce((sum, t) => sum + t.entries.length, 0);
const languageSet = new Set(
  traditions.flatMap((t) => t.entries.map((e) => e.language.split(" / ")[0]))
);

export default function HomePage() {
  return (
    <main>
      <SiteFrame>
        <section className="hero" aria-label="Introduction">
          <p className="cv-meta">Launch foundation · Editio Princeps · Across every civilisation</p>
          <h1 className="hero__title cv-display" aria-label="The Library of Civilisation">
            <span className="hero__title-line">The Library</span>
            <span className="hero__title-line hero__title-em">of Civilisation</span>
          </h1>
          <p className="hero__lede">
            Every civilisation&rsquo;s foundational texts, indexed in one place,
            held in public trust &mdash; from the Epic of Gilgamesh to the
            Universal Declaration, in the languages they were written.
          </p>
          <div className="hero__meta">
            <span className="cv-meta"><strong className="hero__metric">{totalTexts}</strong> texts</span>
            <span className="cv-meta"><strong className="hero__metric">{traditions.length}</strong> traditions</span>
            <span className="cv-meta"><strong className="hero__metric">{languageSet.size}+</strong> languages</span>
            <span className="cv-meta"><strong className="hero__metric">{sources.length}</strong> upstream sources</span>
            <span className="cv-meta">
              <a href="#index" className="hero__cta">Enter the archive</a>
            </span>
          </div>
        </section>
      </SiteFrame>

      <hr className="cv-rule" />

      <section id="manifesto" className="manifesto">
        <SiteFrame>
          <div className="manifesto__grid">
            <div>
              <p className="cv-meta cv-meta-ink">Editorial statement</p>
              <h2 className="manifesto__heading">
                A library is a promise that what was thought can be thought again &mdash;
                in every language it was thought in.
              </h2>
            </div>
            <div className="manifesto__body">
              <p className="manifesto__lead">
                <span className="dropcap">T</span>he written record of humanity
                is not a single canon. It is the braid of many &mdash; Sumerian
                tablet and Sanskrit sūtra, Greek elenchus and Chinese analect,
                Arabic commentary and K&rsquo;iche&rsquo; cosmology &mdash; each
                the infrastructure of a civilisation, each held unequally by the
                digital libraries that survived the twentieth century.
              </p>
              <p>
                Project Gutenberg gave the Western canon a public-domain home.
                ctext did the same for classical Chinese. Perseus for the
                Greco-Roman. Wikisource for the polyglot middle. Our task is
                the next one: to gather these traditions into a single,
                provenance-bearing archive that treats every civilisation as a
                first-class tradition &mdash; not an appendix.
              </p>
              <p>
                We ingest from verified upstream libraries, we credit them
                plainly, and we keep the sources open for mirroring. The
                ambition is scale. The discipline is provenance.
              </p>
              <p className="manifesto__sign">
                &mdash; The Editors, Ninth Heaven Library
              </p>
            </div>
          </div>
        </SiteFrame>
      </section>

      <hr className="cv-rule-double" />

      <section id="index" className="index" aria-labelledby="index-heading">
        <SiteFrame>
          <header className="index__head">
            <div>
              <p className="cv-meta">Section I</p>
              <h2 id="index-heading" className="index__heading">The Index</h2>
            </div>
            <p className="index__blurb">
              A standing catalog of foundational works, arranged by tradition.
              Each entry carries its year, author, title in the original, language,
              and discipline. Accessions are reviewed quarterly.
            </p>
          </header>

          <div className="index__epochs" id="epochs">
            {traditions.map((tradition) => (
              <article key={tradition.id} id={tradition.id} className="epoch">
                <header className="epoch__head">
                  <div className="epoch__label">
                    <p className="cv-meta cv-meta-ink">{tradition.label}</p>
                    <p className="cv-meta cv-mono">{tradition.span}</p>
                  </div>
                  <p
                    className="epoch__note"
                    dangerouslySetInnerHTML={{ __html: tradition.note }}
                  />
                </header>
                <hr className="cv-rule-strong" />
                <ol className="entries" aria-label={`Entries from ${tradition.label}`}>
                  {tradition.entries.map((entry, i) => (
                    <li key={`${tradition.id}-${i}`} className="entry">
                      <span className="entry__year cv-mono">{entry.year}</span>
                      <span className="entry__author">{entry.author}</span>
                      <span className="entry__title">
                        <em>{entry.title}</em>
                        {entry.native ? (
                          <span className="entry__native" lang="auto">
                            {" "}&nbsp;·&nbsp; {entry.native}
                          </span>
                        ) : null}
                      </span>
                      <span className="entry__discipline cv-meta">
                        {entry.discipline}
                      </span>
                      <span className="entry__origin cv-meta cv-mono">
                        {entry.language}
                      </span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </SiteFrame>
      </section>

      <hr className="cv-rule" />

      <section id="sources" className="sources" aria-labelledby="sources-heading">
        <SiteFrame>
          <header className="sources__head">
            <div>
              <p className="cv-meta">Section II</p>
              <h2 id="sources-heading" className="sources__heading">Upstream Sources</h2>
            </div>
            <p className="sources__blurb">
              We ingest, verify, and rehouse. Every text in the archive carries
              its upstream attribution. These are the libraries we stand on.
            </p>
          </header>

          <ul className="sources__list">
            {sources.map((source) => (
              <li key={source.name} className="source">
                <div className="source__head">
                  <a
                    className="source__name"
                    href={source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {source.name}
                  </a>
                  <span className="cv-meta cv-mono">{source.license}</span>
                </div>
                <p className="source__scope">{source.scope}</p>
              </li>
            ))}
          </ul>

          <p className="sources__note">
            Proposing a source or contesting an attribution? Editorial review
            is public. See <a href="#colophon">the colophon</a>.
          </p>
        </SiteFrame>
      </section>

      <section id="principles" className="principles">
        <SiteFrame>
          <header className="principles__head">
            <p className="cv-meta">Section III</p>
            <h2 className="principles__heading">Principles</h2>
            <p className="principles__blurb">
              Four rules govern what enters the library and how it is held.
            </p>
          </header>
          <ol className="principles__grid">
            {principles.map((p) => (
              <li key={p.id} className="principle">
                <span className="principle__kicker cv-mono">{p.kicker}</span>
                <h3 className="principle__title">{p.title}</h3>
                <p className="principle__body">{p.body}</p>
              </li>
            ))}
          </ol>
        </SiteFrame>
      </section>

      <section className="promise">
        <SiteFrame>
          <div className="promise__card">
            <p className="cv-meta cv-meta-ink">What follows</p>
            <h2 className="promise__heading">Editorial foundation first.</h2>
            <p className="promise__copy">
              The catalog, reading surfaces, and ingestion pipelines from
              Gutenberg, ctext, Perseus, Wikisource, and the rest arrive in
              subsequent plans. This foundation is the shell that will carry
              them &mdash; the masthead, the index, the principles, and the
              quiet paper they rest on.
            </p>
            <p className="cv-meta cv-mono promise__meta">
              Brand system in <code>packages/brand</code> &middot; Shell in{" "}
              <code>apps/web</code>
            </p>
          </div>
        </SiteFrame>
      </section>
    </main>
  );
}
