import React from 'react'

// Placeholder UI mock-ups so every case file looks finished before real screenshots exist.
// Replace by dropping a real <img> into the tile / gallery (see README).
const GRID = Array.from({ length: 48 }, (_, i) => i)
const SOLID = new Set([6, 7, 8, 9, 20, 21, 30, 31, 32, 38, 39, 40, 41])

export function ProjectArt({ id, large = false }) {
  return (
    <div className={`mock mock-${id}${large ? ' large' : ''}`} aria-hidden="true">
      {id === 'python' && (
        <div className="m-win">
          <div className="m-bar"><i /><i /><i /><span>helpdesk.py</span></div>
          <div className="m-body">
            <p className="bub in">Where can I find my timetable?</p>
            <p className="bub out">Check the notice board or the school portal.</p>
            <p className="bub in">Thank you!</p>
          </div>
          <div className="m-input"><span>Ask a question…</span><i /></div>
        </div>
      )}
      {id === 'c' && (
        <div className="m-win dark">
          <div className="m-bar"><i /><i /><i /><span>terminal</span></div>
          <div className="m-body code">
            <p><b>$</b> ./logic</p>
            <p>Enter a number: <u>7</u></p>
            <p>7 is odd.</p>
            <p><b>$</b> <span className="caret" /></p>
          </div>
        </div>
      )}
      {id === 'motion' && (
        <div className="m-win">
          <div className="m-preview"><span className="m-play" /></div>
          <div className="m-tracks">
            <div><i style={{ left: '4%', width: '30%' }} /><i style={{ left: '38%', width: '22%' }} /><i style={{ left: '64%', width: '28%' }} /></div>
            <div><i style={{ left: '12%', width: '24%' }} /><i style={{ left: '42%', width: '40%' }} /></div>
            <div><i style={{ left: '2%', width: '70%' }} /></div>
            <span className="playhead" />
          </div>
        </div>
      )}
      {id === 'game' && (
        <div className="m-win">
          <div className="m-grid">
            {GRID.map((n) => <i key={n} className={SOLID.has(n) ? 'solid' : ''} />)}
            <span className="player" />
            <span className="coin" />
          </div>
          <div className="m-hud"><span>LEVEL 01</span><span>● ● ○</span></div>
        </div>
      )}
    </div>
  )
}
