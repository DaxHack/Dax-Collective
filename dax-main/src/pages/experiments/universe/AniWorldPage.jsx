import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, AudioLines, Bookmark, ChevronRight, Clapperboard, Focus, Layers3, ScanLine, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './AniWorldPage.css';

const concepts = [
  {
    id: 'return',
    number: '01',
    lens: 'Psychology',
    title: 'A power that makes survival feel like a sentence.',
    source: 'Re:Zero · working theory',
    image: '/images/experiments/ani/return-memory-model.svg',
    imageAlt: 'Original concept diagram mapping memory, consequence, and a repeating story timeline',
    thesis: 'Return by Death is not a reset button. It is a mechanism that asks one person to carry the emotional residue of every failed world.',
    reading: 'The ability’s real cost is not the death itself; it is the isolation of remembering. Each return leaves Subaru with evidence of a future nobody else can verify. That makes every success morally unstable: he may save people, but he cannot ask them to share the price.',
    question: 'Does the story treat memory as power—or as damage?',
  },
  {
    id: 'silence',
    number: '02',
    lens: 'Character',
    title: 'Silence can be the argument, not the mood.',
    source: 'Frieren · working reading',
    image: '/images/experiments/ani/silence-dialogue-model.svg',
    imageAlt: 'Original concept diagram visualizing the relationship between silence, response, and understanding',
    thesis: 'A character may understand what mattered only after the moment to respond has passed.',
    reading: 'The most revealing scenes do not announce a transformation. They let a pause acquire meaning after the fact. Read the distance between what Frieren knows now and what she could notice then: the gap becomes the story’s measure of time, intimacy, and regret.',
    question: 'When does understanding arrive too late to be useful?',
  },
  {
    id: 'world',
    number: '03',
    lens: 'Worldbuilding',
    title: 'A world feels lived in when the camera arrives late.',
    source: 'Dungeon Meshi · working observation',
    image: '/images/experiments/ani/lived-time-model.svg',
    imageAlt: 'Original concept diagram layering ecology, routine, and plot in a lived-in story world',
    thesis: 'Texture is not decoration. It is proof that a world has needs beyond the plot.',
    reading: 'Meals, routines, ecology, and the consequences of ordinary decisions make a setting feel older than its heroes. The world does not pause to explain itself; it keeps functioning. That is why practical detail can carry more narrative weight than another layer of lore.',
    question: 'What keeps happening here when the protagonists leave?',
  },
];

const lenses = ['All lenses', 'Psychology', 'Character', 'Worldbuilding'];

const principles = [
  ['01 / Observe', 'Start with the frame: blocking, silence, repetition, and what the scene refuses to underline.'],
  ['02 / Connect', 'Trace the choice through the character’s history and the arc’s emotional architecture.'],
  ['03 / Question', 'Keep the reading open to friction. A theory is a lens, not a verdict on the work.'],
];

export default function AniWorldPage() {
  const [lens, setLens] = useState('All lenses');
  const [activeId, setActiveId] = useState('return');
  const [detailOpen, setDetailOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const visibleConcepts = useMemo(
    () => lens === 'All lenses' ? concepts : concepts.filter((concept) => concept.lens === lens),
    [lens],
  );
  const activeConcept = visibleConcepts.find((concept) => concept.id === activeId) || visibleConcepts[0];

  const selectLens = (value) => {
    setLens(value);
    const firstMatch = value === 'All lenses' ? concepts[0] : concepts.find((concept) => concept.lens === value);
    if (firstMatch) {
      setActiveId(firstMatch.id);
      setDetailOpen(false);
    }
  };

  const jumpTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <main className="ani-world" data-testid="page-ani-world">
      <Helmet>
        <title>Ani-Dax — The Theory Chamber | Dax Collective V2</title>
        <meta name="description" content="Ani-Dax's experimental story-analysis environment, with clearly labeled unpublished premises and original concept diagrams." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="ani-world-grain" aria-hidden="true" />
      <div className="ani-world-shell">
        <header className="ani-world-masthead">
          <a className="ani-world-mark" href="#ani-home" aria-label="Ani-Dax home">
            <span className="ani-world-monogram">A<span>—</span>D</span>
            <span className="ani-world-brand">ANI—DAX <small>STORY STUDIES</small></span>
          </a>
          <div className="ani-world-edition"><span className="ani-live-dot" /> INDEPENDENT ANIME ANALYSIS <i> / </i> NOTES IN PROGRESS</div>
          <button className="ani-world-menu-button" type="button" onClick={() => jumpTo('idea-files')} data-testid="button-open-index">
            OPEN INDEX <ScanLine size={15} />
          </button>
        </header>

        <section className="ani-world-hero" id="ani-home" aria-labelledby="ani-world-title">
          <div className="ani-hero-copy">
            <motion.div
              className="ani-hero-kicker"
              initial={reduceMotion ? false : { opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="ani-crosshair"><Focus size={15} /></span>
              <span>FIELD NOTES / FRAME 001</span>
            </motion.div>
            <motion.h1
              id="ani-world-title"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.08 }}
            >
              Stories don’t<br />end at <em>the frame.</em>
            </motion.h1>
            <motion.div
              className="ani-hero-baseline"
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.28 }}
            />
            <p className="ani-hero-deck">A close-reading lab for character writing, arc construction, and the details that keep unfolding after the cut.</p>
            <div className="ani-hero-actions">
              <button type="button" className="ani-primary-action" onClick={() => jumpTo('idea-files')} data-testid="button-enter-files">
                ENTER THE THEORY CHAMBER <ArrowDown size={15} />
              </button>
              <span className="ani-status-stamp"><i /> UNPUBLISHED WORKING NOTES</span>
            </div>
          </div>
          <div className="ani-hero-scene">
            <div className="ani-scene-photo" style={{ backgroundImage: "url('/images/experiments/ani/analysis-chamber.svg')" }} role="img" aria-label="Original abstract diagnostic chamber concept diagram for close reading" />
            <div className="ani-scene-vignette" />
            <div className="ani-scene-crosshair ani-scene-crosshair-a" aria-hidden="true" />
            <div className="ani-scene-crosshair ani-scene-crosshair-b" aria-hidden="true" />
            <span className="ani-scene-vertical">AUDIO / IMAGE / STORY</span>
            <div className="ani-scene-meta">
              <span><AudioLines size={14} /> THE READING ROOM</span>
              <b>Look again.<br />Then ask why.</b>
              <small>ORIGINAL CONCEPT DIAGRAM / NOT SOURCE FOOTAGE</small>
            </div>
            <div className="ani-scene-float">
              <span className="ani-float-number">01</span>
              <span>OBSERVE<br />THE CHOICE</span>
              <ArrowUpRight size={17} />
            </div>
            <span className="ani-scene-coordinate">35° 41′ / STORY SYSTEMS</span>
          </div>
          <div className="ani-hero-side-note"><span>ANIME / CHARACTER / STRUCTURE</span><i /></div>
        </section>

        <div className="ani-scroll-cue" aria-hidden="true"><span>SCROLL TO READ THE CUT</span><div><i /></div></div>

        <section className="ani-chamber" id="idea-files" aria-labelledby="idea-files-title">
          <aside className="ani-chamber-rail">
            <span className="ani-rail-label">INDEX / 01—03</span>
            <div className="ani-rail-line"><i /></div>
            <span className="ani-rail-caption">OPEN<br />QUESTIONS</span>
          </aside>
          <div className="ani-chamber-main">
            <div className="ani-section-intro">
              <div>
                <span className="ani-section-label"><span>01</span> / WORKING IDEAS</span>
                <h2 id="idea-files-title">The <em>unfinished</em><br />argument.</h2>
              </div>
              <p>Not reviews. Not recaps. These are three questions under active consideration—premises, not published essays.</p>
            </div>

            <div className="ani-console">
              <div className="ani-console-top">
                <span><span className="ani-console-light" /> IDEA CONSOLE <i> / </i> {String(visibleConcepts.length).padStart(2, '0')} SIGNALS</span>
                <span className="ani-console-state">STATUS: DEVELOPING</span>
              </div>
              <div className="ani-console-body">
                <nav className="ani-lens-menu" aria-label="Filter working ideas by lens">
                  <span className="ani-menu-title">SELECT A LENS</span>
                  {lenses.map((item, index) => (
                    <button
                      key={item}
                      type="button"
                      className={`ani-lens-option${lens === item ? ' is-active' : ''}`}
                      onClick={() => selectLens(item)}
                      aria-pressed={lens === item}
                      data-testid={`button-lens-${index}`}
                    >
                      <span className="ani-lens-number">0{index + 1}</span>
                      <span>{item}</span>
                      {lens === item && <ChevronRight size={15} />}
                    </button>
                  ))}
                  <div className="ani-menu-foot">SELECT TO REFRAME<br />THE CURRENT QUESTION</div>
                </nav>

                {activeConcept && (
                  <motion.article
                    key={activeConcept.id}
                    className="ani-active-file"
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32 }}
                  >
                    <div className="ani-file-image" style={{ backgroundImage: `linear-gradient(180deg, rgba(10,15,22,.04), rgba(10,15,22,.48)), url("${activeConcept.image}")` }}>
                      <span className="ani-image-caption"><Clapperboard size={13} /> ORIGINAL CONCEPT DIAGRAM / {activeConcept.number}</span>
                    </div>
                    <div className="ani-file-content">
                      <div className="ani-file-kicker"><span>PREMISE · UNPUBLISHED</span><span>{activeConcept.source}</span></div>
                      <h3>{activeConcept.title}</h3>
                      <p className="ani-file-thesis">{activeConcept.thesis}</p>
                      <div className="ani-file-question"><span>THE QUESTION</span><p>{activeConcept.question}</p></div>
                      <button
                        type="button"
                        className="ani-reveal-button"
                        onClick={() => setDetailOpen((open) => !open)}
                        aria-expanded={detailOpen}
                        aria-controls="ani-file-reading"
                        data-testid="button-reveal-reading"
                      >
                        {detailOpen ? 'CLOSE THE READING' : 'REVEAL THE WORKING READING'}
                        <span>{detailOpen ? <X size={14} /> : <ArrowUpRight size={14} />}</span>
                      </button>
                      {detailOpen && (
                        <div className="ani-reading" id="ani-file-reading" data-testid="text-working-reading">
                          <span>DEVELOPING THOUGHT / NOT A FINISHED ESSAY</span>
                          <p>{activeConcept.reading}</p>
                        </div>
                      )}
                    </div>
                  </motion.article>
                )}
              </div>
              <div className="ani-console-bottom"><span>INTERNAL INDEX / NO PUBLICATION CLAIM</span><span>SELECTED LENS: {lens.toUpperCase()}</span></div>
            </div>
          </div>
        </section>

        <section className="ani-interlude" aria-label="A note on close reading">
          <div className="ani-interlude-ghost">AFTER</div>
          <div className="ani-interlude-copy">
            <span className="ani-section-label"><span>02</span> / AFTER THE CUT</span>
            <p>“What changed in the character?” is only the beginning.</p>
            <p className="ani-interlude-emphasis">Ask what the scene<br />made possible.</p>
          </div>
          <div className="ani-interlude-mark"><Layers3 size={27} strokeWidth={1} /><span>STORY<br />IN LAYERS</span></div>
        </section>

        <section className="ani-method" id="method" aria-labelledby="method-title">
          <div className="ani-method-heading">
            <div><span className="ani-section-label"><span>03</span> / HOW A READING FORMS</span><h2 id="method-title">A method, not a verdict.</h2></div>
            <button
              className="ani-method-toggle"
              type="button"
              onClick={() => setMethodOpen((open) => !open)}
              aria-expanded={methodOpen}
              aria-controls="ani-method-steps"
              data-testid="button-method"
            >
              {methodOpen ? 'COLLAPSE METHOD' : 'OPEN METHOD'} <ChevronRight size={15} />
            </button>
          </div>
          <div className={`ani-method-track${methodOpen ? ' is-open' : ''}`} id="ani-method-steps">
            {principles.map(([title, description]) => (
              <div className="ani-method-step" key={title}>
                <span>{title}</span><p>{description}</p><i />
              </div>
            ))}
          </div>
          {!methodOpen && <p className="ani-method-collapsed">Three moves. One idea at a time. Open the method to see how the notes take shape.</p>}
        </section>

        <section className="ani-boundary" aria-labelledby="boundary-title">
          <div className="ani-boundary-symbol" aria-hidden="true"><span /><span /><span /></div>
          <div className="ani-boundary-copy">
            <span className="ani-section-label"><span>04</span> / EDITORIAL BOUNDARY</span>
            <h2 id="boundary-title">The work is a reading.<br /><em>The work is not the footage.</em></h2>
            <p>Ani-Dax commentary is independent analysis. Anime titles are referenced for discussion; original series, characters, and artwork remain the property of their respective creators. This page uses no anime screenshots, character art, or unofficial franchise marks.</p>
          </div>
          <div className="ani-boundary-seal"><Bookmark size={18} /><span>READ<br />CLOSELY</span></div>
        </section>

        <footer className="ani-world-footer">
          <a className="ani-footer-brand" href="#ani-home">ANI—DAX <span>/ DAX COLLECTIVE</span></a>
          <div><span>WORKING NOTES, NOT PUBLICATION</span><span>ANALYSIS / STRUCTURE / CHARACTER</span></div>
          <Link to="/experiments/dax-universe/traveler" className="ani-world-exit" data-testid="link-world-traveler">
            NEXT WORLD <span>TRAVELER</span> <ArrowUpRight size={14} />
          </Link>
        </footer>
      </div>
    </main>
  );
}