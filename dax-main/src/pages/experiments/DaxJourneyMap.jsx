import React from 'react';

const project = ([longitude, latitude]) => ({
  x: ((longitude + 180) / 360) * 1000,
  y: ((90 - latitude) / 180) * 500,
});

// Simplified coastlines use the same geographic projection as the chapter
// anchors. These are illustrative outlines, not borders or itinerary evidence.
const landOutlines = [
  [[-168,72],[-140,69],[-125,59],[-124,49],[-124,42],[-117,32],[-106,23],[-97,16],[-88,18],[-86,15],[-83,9],[-78,8],[-80,20],[-82,25],[-80,30],[-75,35],[-67,45],[-60,50],[-54,58],[-70,60],[-60,70],[-90,80],[-130,73],[-150,72]],
  [[-80,9],[-71,12],[-60,8],[-50,0],[-35,-6],[-40,-20],[-48,-28],[-54,-38],[-67,-55],[-75,-42],[-70,-20],[-81,-5]],
  [[-52,82],[-20,70],[-42,59],[-61,67]],
  [[-10,36],[-9,43],[-1,51],[5,54],[9,60],[20,71],[40,69],[60,68],[90,73],[140,72],[170,65],[180,55],[160,45],[140,45],[135,35],[130,31],[120,20],[105,10],[110,-7],[95,5],[80,8],[76,22],[66,25],[56,16],[47,12],[40,30],[25,40],[15,38],[6,43]],
  [[-17,15],[-17,28],[-9,35],[10,37],[25,32],[32,31],[40,16],[51,11],[43,-11],[35,-25],[20,-35],[12,-17],[8,4],[-5,5]],
  [[114,-22],[115,-34],[136,-35],[151,-38],[153,-25],[142,-11],[130,-12]],
  [[172,-34],[178,-39],[169,-47],[166,-43]],
  [[-6,58],[1,51],[-5,50],[-7,55]],
  [[-9,55],[-6,55],[-6,51],[-10,52]],
  [[-85,23],[-80,23],[-74,20],[-77,20],[-83,22]],
  [[-74.5,20],[-68.5,18.5],[-72,18]],
  [[-67.2,18.5],[-65.6,18.5],[-65.6,18],[-67.2,18]],
  [[130,31],[135,35],[142,43],[145,44],[141,35],[133,30]],
  [[48,-13],[51,-17],[48,-25],[44,-23],[44,-17]],
];
const outlinePath = vertices => vertices.map((coordinate, index) => {
  const point = project(coordinate);
  return `${index ? 'L' : 'M'}${point.x.toFixed(1)},${point.y.toFixed(1)}`;
}).join(' ') + ' Z';

export default function DaxJourneyMap({ chapters, activeYear, onSelect, selectedId }) {
  return (
    <div className="dax-v2-map-wrap">
      <svg className="dax-v2-map" viewBox="0 0 1000 500" role="group" aria-label="Illustrative world map with selectable chapter anchors">
        <defs>
          <pattern id="dax-v2-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" className="dax-v2-grid-line" fill="none" />
          </pattern>
        </defs>
        <rect width="1000" height="500" fill="url(#dax-v2-grid)" />
        <g className="dax-v2-land" aria-hidden="true">
          {landOutlines.map((outline, index) => <path key={index} d={outlinePath(outline)} />)}
        </g>
        <g className="dax-v2-equator" aria-hidden="true">
          <path d="M0 250H1000" />
          <path d="M500 0V500" />
        </g>
        {chapters.map(chapter => {
          const point = project(chapter.coordinates);
          const samePoint = chapters.filter(item => item.coordinates[0] === chapter.coordinates[0] && item.coordinates[1] === chapter.coordinates[1]);
          const duplicateIndex = samePoint.findIndex(item => item.id === chapter.id);
          const offset = samePoint.length > 1 ? (duplicateIndex - (samePoint.length - 1) / 2) * 13 : 0;
          const isLit = chapter.year <= activeYear;
          return (
            <g
              className={`dax-v2-pin ${isLit ? 'is-lit' : ''} ${chapter.year === activeYear ? 'is-current-year' : ''} ${selectedId === chapter.id ? 'is-selected' : ''}`}
              key={chapter.id}
              transform={`translate(${point.x + offset} ${point.y})`}
              role="button"
              tabIndex="0"
              aria-label={`${chapter.destination}, ${chapter.year}. ${isLit ? 'Illuminated' : 'Ahead in the record'}. Open chapter.`}
              aria-pressed={selectedId === chapter.id}
              onClick={() => onSelect(chapter)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(chapter);
                }
              }}
              data-testid={`map-chapter-${chapter.id}`}
            >
              <circle className="dax-v2-pin-pulse" r="11" />
              <circle className="dax-v2-pin-dot" r={chapter.chapterType === 'transit' ? 4 : 5.2} />
              <title>{chapter.destination} · {chapter.year}</title>
            </g>
          );
        })}
      </svg>
      <div className="dax-v2-map-topline"><span>THE RECORD, IN PLACE</span><span>26 CHAPTERS · 2019—2026</span></div>
      <div className="dax-v2-map-disclaimer"><span className="dax-v2-map-key" /> Approximate public anchors · illustrative, not navigational</div>
      <div className="dax-v2-map-caption" aria-live="polite"><small>YEAR IN VIEW</small><b>{activeYear}</b></div>
    </div>
  );
}