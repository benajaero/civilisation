import { loadRooms } from "@civilisation/content";
import { SiteFrame } from "../components/site-frame";
import { LobbyDoors } from "../components/lobby-doors";

export const dynamic = "force-static";

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
  { name: "Europeana", scope: "European manuscripts, prints, and artworks.", url: "https://www.europeana.eu", license: "CC / PDM" },
];

const principles = [
  { id: "provenance", kicker: "I.", title: "Provenance", body: "Every text enters with a verified edition, translator, language, and rights basis. Upstream sources are named, not obscured." },
  { id: "plurality", kicker: "II.", title: "Plurality", body: "The canon is not one tradition. The library admits Greek and Sanskrit, Akkadian and K'iche', Arabic and Nahuatl." },
  { id: "longevity", kicker: "III.", title: "Longevity", body: "Static-first, open-format, mirrorable. The library should outlive its tools, its platforms, and its editors." },
  { id: "austerity", kicker: "IV.", title: "Austerity", body: "Typography carries the hierarchy. Surfaces stay quiet. Motion orients, never entertains." },
];

export default async function HomePage() {
  const rooms = await loadRooms();
  const totalTexts = rooms.reduce((sum, r) => sum + r.entries.length, 0);
  const languageSet = new Set(
    rooms.flatMap((r) => r.entries.map((e) => e.language.split(" / ")[0])),
  );

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
            <span className="cv-meta"><strong className="hero__metric">{rooms.length}</strong> rooms</span>
            <span className="cv-meta"><strong className="hero__metric">{languageSet.size}+</strong> languages</span>
            <span className="cv-meta"><strong className="hero__metric">{sources.length}</strong> upstream sources</span>
            <span className="cv-meta">
              <a href="#lobby" className="hero__cta">Enter the archive</a>
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

      <section id="lobby" className="index" aria-labelledby="lobby-heading">
        <SiteFrame>
          <header className="index__head">
            <div>
              <p className="cv-meta">Section I</p>
              <h2 id="lobby-heading" className="index__heading">The Rooms</h2>
            </div>
            <p className="index__blurb">
              Nine rooms hold the library. Each is a tradition; each a door.
              Enter a room to see its index and to pick up its texts where they
              have been accessioned.
            </p>
          </header>

          <LobbyDoors rooms={rooms} />
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
                  <a className="source__name" href={source.url} target="_blank" rel="noreferrer noopener">
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
