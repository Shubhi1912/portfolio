// ─────────────────────────────────────────────────────────────
//  EDIT ME — everything you will want to personalise lives here.
// ─────────────────────────────────────────────────────────────
export const EMAIL = 'YOUR.EMAIL@example.com'

// Add an href to show a social link in the contact card. Empty ones stay hidden.
export const SOCIALS = [
  { label: 'GitHub', href: '' },
  { label: 'LinkedIn', href: '' },
  { label: 'Instagram', href: '' },
]

export const BASE_TITLE = 'Shubhnit — Creative Technologist'
export const SECTIONS = ['about', 'work', 'projects', 'toolkit', 'contact']

// Terminal `theme` command colours (the default theme is `sage`).
export const ACCENTS = { sage: '#82978a', clay: '#c88767', slate: '#7f98aa', lilac: '#a28fb8' }

// `links.source` / `links.demo`: paste a URL and the buttons on the case page switch on.
// `notes`: optional — fill Brief / Process / Build / Reflection and they replace the prompts.
export const projects = [
  { id: 'python', no: '01', group: 'CODE', category: 'SOFTWARE / PYTHON', title: 'School helpdesk', subtitle: 'A small tool with a practical purpose.', description: 'A Python-based school helpdesk chatbot experiment. This case-study space is ready for the problem, approach, interface, code decisions and lessons learned to be documented as the project develops.', stack: ['Python', 'NLTK', 'CustomTkinter'], accent: 'mint', color: '#a9b9ae', mark: 'Py', status: 'EXPERIMENT', links: { source: '', demo: '' }, notes: {} },
  { id: 'c', no: '02', group: 'CODE', category: 'PROGRAMMING / C', title: 'Logic in motion', subtitle: 'Learning to think close to the machine.', description: 'A collection of C programming exercises and small console experiments focused on fundamentals: input, control flow, arrays, functions and problem-solving. Add a specific finished program and its source link here when ready.', stack: ['C', 'Problem solving', 'Terminal'], accent: 'blue', color: '#9eafbd', mark: 'C', status: 'LEARNING LOG', links: { source: '', demo: '' }, notes: {} },
  { id: 'motion', no: '03', group: 'VISUAL', category: 'MOTION / VIDEO', title: 'Frames & feeling', subtitle: 'Editing ideas into a visual rhythm.', description: 'A home for selected video edits. Document the creative brief, pacing, transitions, sound choices and editing process here. Replace this preview with a still or embedded video when you have a final piece to share.', stack: ['DaVinci Resolve', 'Editing', 'Storytelling'], accent: 'orange', color: '#c88767', mark: '▶', status: 'SHOWREEL SLOT', links: { source: '', demo: '' }, notes: {} },
  { id: 'game', no: '04', group: 'INTERACTIVE', category: 'INTERACTIVE / GAME DESIGN', title: 'Playful systems', subtitle: 'Mechanics, rules and little worlds.', description: 'An evolving space for game concepts and interactive prototypes. Add the core loop, rules, player choices, visual direction and a playable build when a project is ready to be presented.', stack: ['Game design', 'Prototyping', 'Systems'], accent: 'violet', color: '#b3a6c6', mark: 'PLAY', status: 'IN DEVELOPMENT', links: { source: '', demo: '' }, notes: {} },
  { id: 'harry-potter-book-one', no: '05', group: 'VISUAL', category: '3D / PROP DESIGN', title: 'Harry Potter — Book One', subtitle: 'A detailed 3D study of the first completed book.', description: 'An interactive, textured 3D model of the completed first volume. Rotate the book to inspect its cover and form.', stack: ['Blender', '3D modeling', 'Texturing'], accent: 'violet', color: '#b3a6c6', mark: '01', status: '3D MODEL', modelUrl: 'models/harry-potter-books.glb', links: { source: '', demo: '' }, notes: {} },
  { id: 'cosmic-punk', no: '06', group: 'VISUAL', category: '3D / CHARACTER DESIGN', title: 'Cosmic Punk', subtitle: 'A character study built for close inspection.', description: 'An interactive, textured 3D presentation of a Cosmic Punk character study.', stack: ['Blender', 'Character design', 'Texturing'], accent: 'blue', color: '#9eafbd', mark: 'CP', status: '3D MODEL', modelUrl: 'models/cosmic-punk.glb', links: { source: '', demo: '' }, notes: {} },
]

export const processSteps = [
  { k: 'Brief', q: 'What was the idea, and who or what was it for?' },
  { k: 'Process', q: 'How did you approach it — sketches, research, decisions along the way?' },
  { k: 'Build', q: 'Which tools, code and techniques did you use, and why?' },
  { k: 'Reflection', q: 'What worked, what would you change, what did you learn?' },
]

export const models = [
  { label: 'Harry Potter — Book One', note: 'The first completed volume, with its cover and book form preserved.', url: 'models/harry-potter-books.glb', projectId: 'harry-potter-book-one' },
  { label: 'Cosmic Punk', note: 'A textured character study, ready to explore from every angle.', url: 'models/cosmic-punk.glb', projectId: 'cosmic-punk' },
]

export const toolkit = [
  { icon: 'Terminal', name: 'PYTHON', tag: 'PROGRAMMING' },
  { icon: 'Cpu', name: 'C', tag: 'PROGRAMMING' },
  { icon: 'Box', name: 'BLENDER', tag: '3D / SPATIAL DESIGN' },
  { icon: 'Clapperboard', name: 'VIDEO', tag: 'EDITING / STORY' },
  { icon: 'Gamepad2', name: 'GAME DESIGN', tag: 'INTERACTION / SYSTEMS' },
  { icon: 'Globe', name: 'WEB', tag: 'HTML / CSS / JAVASCRIPT' },
]
