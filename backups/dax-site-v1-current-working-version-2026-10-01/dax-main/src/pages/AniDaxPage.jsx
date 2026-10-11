import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowDownRight, ArrowUpRight, ChevronDown, Film, Layers3, ScanLine } from 'lucide-react';
import ApprovedMediaGallery from '../components/ApprovedMediaGallery';

const topics = [
  { id: 'all', label: 'All notes' },
  { id: 'character', label: 'Character studies' },
  { id: 'arc', label: 'Arc readings' },
  { id: 'seasonal', label: 'Seasonal notes' },
  { id: 'theory', label: 'Theory board' },
];

const concepts = [
  {
    id: 'rezero',
    topic: 'theory',
    topicLabel: 'Theory board',
    format: 'Essay premise',
    title: 'Return by Death Isn’t a Power — It’s a Psychological Sentence',
    summary: 'The ability selects for high emotional capacity and low self-preservation. Subaru survives because he is built to absorb consequences others can’t.',
    image: '/assets/approved-media/anidax/rezero-theory-research-notes.png',
    imageAlt: 'Research notes and working materials for an anime theory',
    number: '01',
  },
  {
    id: 'frieren',
    topic: 'arc',
    topicLabel: 'Arc reading',
    format: 'Video essay premise',
    title: 'Frieren’s Silence Is the Argument, Not the Mood',
    summary: 'The show is not about learning to care. It is about the gap between caring and being present. That distinction is what every arc is actually about.',
    image: '/assets/approved-media/anidax/character-files-editorial-workspace.png',
    imageAlt: 'An editorial workspace with character notes',
    number: '02',
  },
  {
    id: 'dungeon-meshi',
    topic: 'seasonal',
    topicLabel: 'Seasonal note',
    format: 'Short-form premise',
    title: 'Dungeon Meshi Did What Isekai Forgot: Make the World Feel Lived-In',
    summary: 'Studio Trigger didn’t add flash. They added texture. Every background, every meal, every monster death communicates a world that existed before the camera arrived.',
    image: '/assets/approved-media/anidax/anime-collection-shelf-display.png',
    imageAlt: 'A collection of anime volumes and objects on a shelf',
    number: '03',
  },
];

const conceptTopicStyle = {
  theory: { color: '#ee7356', label: 'Theory board' },
  arc: { color: '#a5bdff', label: 'Arc reading' },
  seasonal: { color: '#d5d880', label: 'Seasonal note' },
};

function ConceptCard({ concept, index, expanded, onToggle, reduceMotion }) {
  const topicStyle = conceptTopicStyle[concept.topic];
  return (
    <motion.article
      id={`concept-${concept.id}`}
      data-testid={`card-concept-${concept.id}`}
      className={`ani-concept ani-concept-${index + 1}`}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-45px' }}
      transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.07 }}
    >
      <div className="ani-card-image" style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(7,13,25,.92)), url("${concept.image}")` }}>
        <span className="ani-index">{concept.number} / 03</span>
        <span className="ani-card-mark" aria-hidden="true">A—D</span>
      </div>
      <div className="ani-card-body">
        <div className="ani-card-kickers">
          <span className="ani-topic-tag" style={{ color: topicStyle.color }}>{concept.topicLabel}</span>
          <span className="ani-format">{concept.format}</span>
        </div>
        <h3>{concept.title}</h3>
        <p>{concept.summary}</p>
        <div className="ani-card-foot">
          <span className="ani-status"><i /> Premise · unpublished</span>
          <button
            type="button"
            className="ani-expand"
            aria-expanded={expanded}
            aria-controls={`premise-${concept.id}`}
            data-testid={`button-premise-${concept.id}`}
            onClick={onToggle}
          >
            {expanded ? 'Close note' : 'About this premise'}
            <ChevronDown size={14} className={expanded ? 'ani-chevron-open' : ''} />
          </button>
        </div>
        {expanded && (
          <div className="ani-premise-note" id={`premise-${concept.id}`} data-testid={`text-premise-status-${concept.id}`}>
            <span>Editorial status</span>
            <p>This is a working idea, not a published essay or finished video. The title and note describe the question under consideration.</p>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function AniDaxPage() {
  const [activeTopic, setActiveTopic] = useState('all');
  const [openConcept, setOpenConcept] = useState(null);
  const reduceMotion = useReducedMotion();
  const visibleConcepts = useMemo(
    () => activeTopic === 'all' ? concepts : concepts.filter((concept) => concept.topic === activeTopic),
    [activeTopic],
  );

  const goToTheory = () => {
    setActiveTopic('theory');
    document.getElementById('latest-notes')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <>
      <Helmet>
        <title>Ani-Dax — Anime, read closely | Dax Collective</title>
        <meta name="description" content="Anime analysis, character writing, and story structure from Ani-Dax. Working premises are clearly marked; no unfinished essay is presented as published." />
      </Helmet>
      <main className="ani-page" data-testid="page-anidax">
        <style>{`
          .ani-page {
            --ink: #070d19; --ink-soft: #0b1524; --panel: #101b2c; --line: rgba(191,211,242,.14);
            --paper: #eceddf; --muted: #a7b2c1; --quiet: #718094; --signal: #ee7356; --blue: #a5bdff;
            min-height: 100dvh; overflow: clip; color: var(--paper); background: var(--ink);
            font-family: 'Avenir Next', Avenir, 'Segoe UI', sans-serif; selection-background-color: var(--signal);
          }
          .ani-page * { box-sizing: border-box; }
          .ani-page ::selection { color: var(--ink); background: var(--signal); }
          .ani-wrap { width: min(1220px, calc(100% - 56px)); margin: 0 auto; }
          .ani-topline { display:flex; justify-content:space-between; align-items:center; padding:24px 0; border-bottom:1px solid var(--line); }
          .ani-wordmark { display:flex; align-items:center; gap:11px; color:var(--paper); text-decoration:none; font-weight:800; letter-spacing:-.055em; font-size:17px; }
          .ani-wordmark-mark { display:grid; place-items:center; width:27px; height:27px; border:1px solid var(--signal); color:var(--signal); font-size:10px; letter-spacing:-.08em; }
          .ani-edition { display:flex; gap:10px; align-items:center; color:var(--muted); font:10px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; text-transform:uppercase; letter-spacing:.15em; }
          .ani-edition b { color:var(--signal); font-weight:500; }
          .ani-hero { min-height: min(790px, 86vh); padding:52px 0 72px; display:grid; grid-template-columns: 1fr .92fr; gap:7%; align-items:center; position:relative; }
          .ani-hero-copy { position:relative; z-index:2; padding:15px 0; }
          .ani-eyebrow { display:flex; align-items:center; gap:12px; color:var(--signal); text-transform:uppercase; letter-spacing:.19em; font:10px ui-monospace, SFMono-Regular, Menlo, monospace; }
          .ani-eyebrow:before { content:''; width:28px; height:1px; background:currentColor; }
          .ani-hero h1 { max-width:720px; margin:26px 0 22px; font:500 clamp(62px,8.2vw,116px)/.91 Georgia, 'Times New Roman', serif; letter-spacing:-.075em; }
          .ani-hero h1 em { color:var(--signal); font-weight:400; }
          .ani-intro { max-width:485px; color:#b5c0cf; font-size:16px; line-height:1.75; }
          .ani-hero-cta { display:inline-flex; align-items:center; gap:22px; margin-top:29px; padding:13px 0; border-bottom:1px solid var(--signal); color:var(--paper); text-decoration:none; font:11px ui-monospace, SFMono-Regular, Menlo, monospace; text-transform:uppercase; letter-spacing:.13em; transition:color .2s ease, gap .2s ease; }
          .ani-hero-cta:hover { color:var(--signal); gap:30px; }
          .ani-hero-art { height: min(560px, 64vw); min-height:390px; position:relative; isolation:isolate; background:#0a1628; border:1px solid var(--line); }
          .ani-hero-art:before { content:''; position:absolute; z-index:1; inset:0; background:linear-gradient(90deg, rgba(7,13,25,.22), transparent 60%), linear-gradient(0deg, rgba(7,13,25,.35), transparent 50%); pointer-events:none; }
          .ani-hero-photo { position:absolute; inset:0; background-image:url('/assets/approved-media/anidax/setup-anidax-recording-space.png'); background-size:cover; background-position:center; filter:saturate(.62) contrast(1.08); opacity:.72; }
          .ani-hero-serial { position:absolute; z-index:2; top:18px; left:18px; color:#d8dfeb; font:9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.16em; text-transform:uppercase; writing-mode:vertical-rl; }
          .ani-art-caption { position:absolute; z-index:2; left:20px; right:20px; bottom:18px; display:flex; justify-content:space-between; gap:15px; align-items:end; color:#d5dae4; font:10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.09em; text-transform:uppercase; }
          .ani-art-caption strong { font:italic 20px Georgia, serif; text-transform:none; letter-spacing:-.03em; }
          .ani-art-frame { position:absolute; z-index:2; width:30%; aspect-ratio:1; right:-13px; top:24%; border-top:1px solid var(--signal); border-right:1px solid var(--signal); }
          .ani-index-line { position:absolute; z-index:2; right:17px; top:18px; color:var(--signal); font:10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.12em; }
          .ani-topics { position:sticky; top:0; z-index:20; border-top:1px solid var(--line); border-bottom:1px solid var(--line); background:rgba(7,13,25,.93); backdrop-filter:blur(16px); }
          .ani-topic-inner { min-height:70px; display:flex; align-items:center; gap:10px; overflow:auto; scrollbar-width:none; }
          .ani-topic-inner::-webkit-scrollbar { display:none; }
          .ani-topic-label { flex:none; margin-right:13px; color:var(--quiet); font:9px ui-monospace, SFMono-Regular, Menlo, monospace; text-transform:uppercase; letter-spacing:.16em; }
          .ani-topic-button { flex:none; padding:10px 13px; color:#9aa8bc; background:transparent; border:1px solid transparent; font:10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.06em; text-transform:uppercase; cursor:pointer; transition:color .18s ease, border-color .18s ease, background .18s ease; }
          .ani-topic-button:hover { color:var(--paper); border-color:var(--line); }
          .ani-topic-button[aria-pressed="true"] { border-color:rgba(238,115,86,.55); background:rgba(238,115,86,.08); color:var(--signal); }
          .ani-section { padding:116px 0 92px; scroll-margin-top:83px; }
          .ani-section-heading { display:grid; grid-template-columns:1fr auto; gap:20px; align-items:end; margin-bottom:33px; }
          .ani-section-kicker { color:var(--signal); font:10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.18em; text-transform:uppercase; }
          .ani-section-heading h2 { margin:13px 0 0; font:500 clamp(38px,5vw,64px)/1 Georgia, 'Times New Roman', serif; letter-spacing:-.06em; }
          .ani-section-heading h2 em { color:var(--blue); font-weight:400; }
          .ani-section-count { color:var(--quiet); font:10px ui-monospace, SFMono-Regular, Menlo, monospace; text-transform:uppercase; letter-spacing:.1em; }
          .ani-card-grid { display:grid; grid-template-columns:repeat(12,1fr); gap:18px; align-items:start; }
          .ani-concept { grid-column:span 4; border:1px solid var(--line); background:var(--ink-soft); min-width:0; }
          .ani-concept-2 { margin-top:42px; }
          .ani-concept-3 { margin-top:84px; }
          .ani-card-image { height:236px; background-size:cover; background-position:center; position:relative; background-color:#17263a; }
          .ani-index { position:absolute; top:14px; left:14px; padding:6px 8px; background:var(--ink); color:var(--paper); font:9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.1em; }
          .ani-card-mark { position:absolute; right:14px; bottom:9px; color:rgba(236,237,223,.73); font:italic 30px Georgia,serif; letter-spacing:-.1em; }
          .ani-card-body { padding:22px 20px 18px; }
          .ani-card-kickers { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:17px; }
          .ani-topic-tag { font:9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.12em; text-transform:uppercase; }
          .ani-format { color:var(--quiet); font:9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.05em; text-transform:uppercase; }
          .ani-format:before { content:'/'; margin-right:9px; color:#526075; }
          .ani-card-body h3 { min-height:95px; margin:0 0 12px; font:500 clamp(23px,2.4vw,30px)/1.12 Georgia, 'Times New Roman', serif; letter-spacing:-.045em; }
          .ani-card-body>p { min-height:105px; margin:0; color:var(--muted); font-size:13px; line-height:1.72; }
          .ani-card-foot { display:flex; justify-content:space-between; gap:10px; align-items:center; margin-top:24px; padding-top:15px; border-top:1px solid var(--line); }
          .ani-status { display:flex; gap:7px; align-items:center; color:var(--quiet); font:9px ui-monospace, SFMono-Regular, Menlo, monospace; }
          .ani-status i { display:block; width:5px; height:5px; background:var(--signal); border-radius:50%; }
          .ani-expand { display:flex; gap:7px; align-items:center; padding:6px 0 6px 6px; border:0; color:#c4ccda; background:none; cursor:pointer; font:9px ui-monospace, SFMono-Regular, Menlo, monospace; text-transform:uppercase; letter-spacing:.05em; }
          .ani-expand:hover { color:var(--signal); }
          .ani-expand svg { transition:transform .2s ease; }
          .ani-chevron-open { transform:rotate(180deg); }
          .ani-premise-note { margin-top:15px; padding:14px; background:#121f31; border-left:2px solid var(--signal); }
          .ani-premise-note>span { color:var(--signal); font:9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.12em; text-transform:uppercase; }
          .ani-premise-note p { margin:8px 0 0; color:#b2bece; font-size:12px; line-height:1.65; }
          .ani-empty { grid-column:1/-1; padding:34px; border:1px dashed var(--line); color:var(--muted); font:13px/1.6 Georgia,serif; }
          .ani-empty b { display:block; margin-bottom:7px; color:var(--paper); font-size:22px; font-weight:400; }
          .ani-feature { padding:77px 0 94px; border-top:1px solid var(--line); border-bottom:1px solid var(--line); background:linear-gradient(105deg,#0b1828 0%,#0b1422 58%,#0a1220 100%); }
          .ani-feature-grid { display:grid; grid-template-columns:.7fr 1.3fr; gap:9%; align-items:center; }
          .ani-feature-index { color:var(--signal); font:10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.17em; text-transform:uppercase; }
          .ani-feature-index span { display:block; margin:19px 0 0; color:rgba(165,189,255,.68); font:clamp(80px,14vw,168px)/.85 Georgia,serif; letter-spacing:-.1em; }
          .ani-feature h2 { max-width:790px; margin:15px 0 20px; font:500 clamp(38px,5.8vw,76px)/1 Georgia, 'Times New Roman', serif; letter-spacing:-.063em; }
          .ani-feature h2 em { color:var(--signal); font-weight:400; }
          .ani-feature p { max-width:580px; color:var(--muted); font-size:15px; line-height:1.8; }
          .ani-text-link { display:inline-flex; align-items:center; gap:12px; margin-top:17px; padding:12px 0; color:var(--paper); border-bottom:1px solid var(--signal); background:none; cursor:pointer; font:10px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.13em; text-transform:uppercase; }
          .ani-text-link:hover { color:var(--signal); }
          .ani-archive { padding:100px 0 108px; }
          .ani-archive-head { display:flex; justify-content:space-between; align-items:end; gap:20px; margin-bottom:29px; }
          .ani-archive-head h2 { margin:11px 0 0; font:500 clamp(34px,4.5vw,55px)/1 Georgia,serif; letter-spacing:-.055em; }
          .ani-archive-head p { max-width:290px; margin:0; color:var(--muted); font:12px/1.65 ui-monospace, SFMono-Regular, Menlo, monospace; }
          .ani-dev { padding:0 0 104px; }
          .ani-dev-panel { display:grid; grid-template-columns:.8fr 1.2fr; gap:50px; padding:34px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
          .ani-dev-title { display:flex; align-items:start; gap:12px; color:var(--signal); }
          .ani-dev-title h2 { margin:0; color:var(--paper); font:500 32px/1 Georgia,serif; letter-spacing:-.05em; }
          .ani-dev-copy p { max-width:610px; margin:0 0 20px; color:var(--muted); font-size:13px; line-height:1.75; }
          .ani-dev-list { display:flex; flex-wrap:wrap; gap:8px; }
          .ani-dev-list span { padding:9px 11px; border:1px solid var(--line); color:#aeb9c8; font:9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.06em; text-transform:uppercase; }
          .ani-footer { padding:19px 0 27px; border-top:1px solid var(--line); display:flex; justify-content:space-between; gap:18px; color:var(--quiet); font:9px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing:.1em; text-transform:uppercase; }
          @media (max-width:850px) {
            .ani-wrap { width:min(100% - 40px, 700px); }
            .ani-hero { min-height:unset; padding:67px 0 59px; grid-template-columns:1fr; gap:35px; }
            .ani-hero h1 { max-width:650px; }
            .ani-hero-art { height:430px; min-height:unset; }
            .ani-concept { grid-column:span 6; }
            .ani-concept-3 { margin-top:0; }
            .ani-concept-2 { margin-top:30px; }
            .ani-card-body h3,.ani-card-body>p { min-height:unset; }
            .ani-feature-grid { grid-template-columns:.45fr 1.55fr; gap:6%; }
            .ani-dev-panel { grid-template-columns:1fr 1.4fr; gap:25px; }
          }
          @media (max-width:560px) {
            .ani-wrap { width:calc(100% - 34px); }
            .ani-topline { padding:17px 0; }
            .ani-edition { font-size:8px; letter-spacing:.07em; }
            .ani-hero { padding:54px 0 42px; gap:28px; }
            .ani-hero h1 { margin:20px 0 17px; font-size:clamp(58px,16vw,87px); }
            .ani-intro { font-size:14px; }
            .ani-hero-art { height:340px; }
            .ani-topic-inner { min-height:62px; gap:4px; }
            .ani-topic-label { display:none; }
            .ani-topic-button { padding:9px 10px; font-size:9px; }
            .ani-section { padding:75px 0 63px; }
            .ani-section-heading { grid-template-columns:1fr; gap:12px; }
            .ani-section-count { justify-self:start; }
            .ani-card-grid { display:flex; flex-direction:column; gap:13px; }
            .ani-concept,.ani-concept-2,.ani-concept-3 { width:100%; margin:0; }
            .ani-card-image { height:220px; }
            .ani-card-body { padding:19px 17px 16px; }
            .ani-card-body h3 { font-size:28px; }
            .ani-card-foot { align-items:flex-start; }
            .ani-status { max-width:130px; line-height:1.5; }
            .ani-feature { padding:57px 0 61px; }
            .ani-feature-grid { display:block; }
            .ani-feature-index span { margin:14px 0 20px; font-size:90px; }
            .ani-feature h2 { font-size:clamp(42px,11vw,58px); }
            .ani-archive { padding:72px 0; }
            .ani-archive-head { align-items:start; flex-direction:column; }
            .ani-archive-head p { max-width:400px; }
            .ani-dev { padding-bottom:70px; }
            .ani-dev-panel { display:block; padding:25px 0; }
            .ani-dev-copy { margin-top:20px; }
            .ani-footer { font-size:8px; letter-spacing:.04em; }
          }
          @media (prefers-reduced-motion: reduce) {
            .ani-page *, .ani-page *::before, .ani-page *::after { scroll-behavior:auto !important; transition-duration:.01ms !important; animation-duration:.01ms !important; animation-iteration-count:1 !important; }
          }
        `}</style>

        <div className="ani-wrap">
          <header className="ani-topline">
            <a className="ani-wordmark" href="#top" aria-label="Ani-Dax home">
              <span className="ani-wordmark-mark">A·D</span><span>ANI—DAX</span>
            </a>
            <div className="ani-edition"><b>Independent anime analysis</b><span> / </span><span>Notes in progress</span></div>
          </header>

          <section className="ani-hero" id="top" aria-labelledby="ani-title">
            <motion.div
              className="ani-hero-copy"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="ani-eyebrow">A closer reading of anime</div>
              <h1 id="ani-title">Stories don’t<br />end at <em>the frame.</em></h1>
              <p className="ani-intro">Opinionated commentary on character writing, arc construction, and storytelling. These are working ideas, clearly marked—not finished pieces dressed up as publication.</p>
              <a className="ani-hero-cta" href="#latest-notes">Enter the reading room <ArrowDownRight size={15} /></a>
            </motion.div>
            <motion.div
              className="ani-hero-art"
              initial={reduceMotion ? false : { opacity: 0, scale: .985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: .7, delay: .08 }}
              aria-label="Approved image of the Ani-Dax recording workspace"
              role="img"
            >
              <div className="ani-hero-photo" />
              <span className="ani-hero-serial">Visual notes / archive no. 001</span>
              <span className="ani-index-line">A—D / 01</span>
              <span className="ani-art-frame" />
              <div className="ani-art-caption"><strong>Read what the scene leaves unsaid.</strong><span>Commentary, not recap</span></div>
            </motion.div>
          </section>
        </div>

        <nav className="ani-topics" aria-label="Filter editorial concepts">
          <div className="ani-wrap ani-topic-inner">
            <span className="ani-topic-label">Browse by lens</span>
            {topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                aria-pressed={activeTopic === topic.id}
                data-testid={`button-topic-${topic.id}`}
                className="ani-topic-button"
                onClick={() => setActiveTopic(topic.id)}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </nav>

        <section className="ani-section ani-wrap" id="latest-notes" aria-labelledby="notes-title">
          <div className="ani-section-heading">
            <div>
              <span className="ani-section-kicker">Index / working concepts</span>
              <h2 id="notes-title">The <em>idea</em> files.</h2>
            </div>
            <span className="ani-section-count" data-testid="text-concept-count">{visibleConcepts.length} {visibleConcepts.length === 1 ? 'concept' : 'concepts'} shown · none published</span>
          </div>
          <div className="ani-card-grid" aria-live="polite">
            {visibleConcepts.length ? visibleConcepts.map((concept, index) => (
              <ConceptCard
                key={concept.id}
                concept={concept}
                index={index}
                expanded={openConcept === concept.id}
                onToggle={() => setOpenConcept(openConcept === concept.id ? null : concept.id)}
                reduceMotion={reduceMotion}
              />
            )) : (
              <div className="ani-empty" data-testid="text-empty-topic">
                <b>No character study in this index yet.</b>
                This shelf is intentionally empty for now. The available concepts remain visible under their own topics.
              </div>
            )}
          </div>
        </section>

        <section className="ani-feature" aria-labelledby="feature-title">
          <div className="ani-wrap ani-feature-grid">
            <div className="ani-feature-index">In focus <span>01</span></div>
            <div>
              <span className="ani-section-kicker">Theory board / Re:Zero</span>
              <h2 id="feature-title">Why Return by Death Is the Most Psychologically Complex Ability in Contemporary Anime</h2>
              <p>Return by Death doesn’t grant power—it sentences the bearer to live every consequence twice. This is the central question behind a developing Re:Zero theory, not a published editorial.</p>
              <button className="ani-text-link" type="button" onClick={goToTheory} data-testid="button-featured-premise">
                Find the working premise <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </section>

        <section className="ani-archive ani-wrap" aria-labelledby="archive-title">
          <div className="ani-archive-head">
            <div><span className="ani-section-kicker">Visual context / local archive</span><h2 id="archive-title">Behind the commentary.</h2></div>
            <p>Approved material from the Ani-Dax workspace and collection. A view into the references behind the notes.</p>
          </div>
          <ApprovedMediaGallery brand="Ani-Dax" section="Behind the Commentary" />
        </section>

        <section className="ani-dev ani-wrap" aria-labelledby="next-phase-title">
          <div className="ani-dev-panel">
            <div className="ani-dev-title"><Layers3 size={17} strokeWidth={1.5} /><h2 id="next-phase-title">Still taking shape.</h2></div>
            <div className="ani-dev-copy">
              <p>Co-host integration, community architecture, and long-form video essays are in development. The format can wait until the thinking is ready.</p>
              <div className="ani-dev-list">
                <span><Film size={12} /> Video editorial infrastructure</span>
                <span><ScanLine size={12} /> Community protocols</span>
                <span>Co-host audio setup</span>
              </div>
            </div>
          </div>
        </section>
        <footer className="ani-wrap ani-footer"><span>Ani-Dax / Dax Collective</span><span>Working notes, not publication</span></footer>
      </main>
    </>
  );
}