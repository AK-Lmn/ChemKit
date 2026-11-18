const baseProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.75',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
}

export function ChemKitMark({ className = '' }) {
  return (
    <svg viewBox="0 0 256 256" className={className} fill="none" aria-hidden="true">
      <rect width="256" height="256" rx="56" fill="var(--surface, #1E1E1E)" />
      <g transform="translate(18 16) scale(0.86)">
        {/* Molecular Reaction Node on upper-k arm (Catalyst Emerald) */}
        <circle cx="200" cy="74" r="16" fill="var(--accent, #00C853)" />
        {/* Stem of lowercase k / Test Tube Neck */}
        <line x1="140" y1="46" x2="140" y2="206" stroke="var(--ink, #111111)" strokeWidth="22" strokeLinecap="round" />
        {/* Upper Branch of k (Reaction Bond) */}
        <line x1="140" y1="134" x2="196" y2="78" stroke="var(--accent, #00C853)" strokeWidth="20" strokeLinecap="round" />
        {/* Lower Branch of k (Ground Leg) */}
        <line x1="140" y1="146" x2="200" y2="206" stroke="var(--ink, #111111)" strokeWidth="20" strokeLinecap="round" />
        {/* Lowercase c (Orbital Meniscus Bowl) */}
        <path
          d="M 116 104 A 46 46 0 1 0 116 176"
          stroke="var(--ink, #111111)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* Chemistry Droplet / Catalyst Core inside c */}
        <circle cx="80" cy="140" r="14" fill="var(--accent, #00C853)" />
        {/* Bond Connector between c and k */}
        <line x1="120" y1="140" x2="140" y2="140" stroke="var(--ink, #111111)" strokeWidth="14" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export const AtomMark = ChemKitMark


export function IconMoon({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  )
}

export function IconSun({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

export function IconLayoutGrid({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}

export function IconTable({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 3v18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    </svg>
  )
}

export function IconAtom({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="12" r="1.5" />
      <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
      <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
    </svg>
  )
}

export function IconGauge({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  )
}

export function IconScale({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  )
}

export function IconArrowLeftRight({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M8 3 4 7l4 4" />
      <path d="M4 7h16" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H4" />
    </svg>
  )
}

export function IconDroplet({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  )
}

export function IconFlaskConical({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </svg>
  )
}

export function IconSearch({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function IconStar({ className = '', filled = false }) {
  return (
    <svg {...baseProps} fill={filled ? 'currentColor' : 'none'} className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export function IconChevronDown({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function IconCheck({ className = '', ...props }) {
  return (
    <svg {...baseProps} {...props} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function IconCopy({ className = '', ...props }) {
  return (
    <svg {...baseProps} {...props} className={className}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

export function IconTrash({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

export function IconRotateCcw({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

export function IconArrowRight({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export function IconX({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export function IconAlertCircle({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}

export function IconHistory({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}

export function IconSparkles({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
}

export function IconGithub({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.08.78 2.17v3.22c0 .31.21.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

export function IconGraduationCap({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

export function IconListOrdered({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  )
}

export function IconExternalLink({ className = '' }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  )
}

/* ==========================================================================
   ChemKit Domain-Specific Tool Logo Marks (Geometric Vector Identity System)
   ========================================================================== */

export function LogoElementExplorer({ className = '', ...props }) {
  return (
    <svg {...baseProps} {...props} className={`ck-icon-explorer ${className}`}>
      {/* 18-column periodic lattice outer frame */}
      <path
        d="M3 6h3v4h12V6h3v14H3V6z"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Stepped interior column guides */}
      <path
        d="M6 10v10 M18 10v10 M3 14h18"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="1.25"
        strokeOpacity="0.45"
      />
      {/* Central highlighted element tile with active nucleus */}
      <rect
        className="ck-anim-tile"
        x="9"
        y="11"
        width="6"
        height="6"
        rx="1.2"
        fill="var(--tool-accent, var(--accent))"
        fillOpacity="0.25"
        stroke="var(--tool-accent, var(--accent))"
        strokeWidth="1.5"
      />
      <circle
        className="ck-anim-nucleus"
        cx="12"
        cy="14"
        r="1.25"
        fill="var(--tool-sec, #00E5FF)"
      />
      {/* Electron valence emission ring */}
      <circle
        cx="12"
        cy="14"
        r="2.25"
        fill="none"
        stroke="var(--tool-sec, #00E5FF)"
        strokeWidth="0.8"
        strokeDasharray="1 1.2"
      />
    </svg>
  )
}

export function LogoMoleMate({ className = '', ...props }) {
  return (
    <svg {...baseProps} {...props} className={`ck-icon-molemate ${className}`}>
      {/* Covalent bonds connecting central nucleus to perimeter atoms */}
      <line
        className="ck-anim-bond ck-anim-bond-1"
        x1="12"
        y1="12"
        x2="12"
        y2="4.5"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="2"
      />
      <line
        className="ck-anim-bond ck-anim-bond-2"
        x1="12"
        y1="12"
        x2="4.5"
        y2="17.5"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="2"
      />
      <line
        className="ck-anim-bond ck-anim-bond-3"
        x1="12"
        y1="12"
        x2="19.5"
        y2="17.5"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="2"
      />
      {/* Double bond resonance accent on upper stem */}
      <line
        x1="10.2"
        y1="10.5"
        x2="10.2"
        y2="5.5"
        stroke="var(--tool-sec, #7C4DFF)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Orbital valence electron cloud arc */}
      <path
        className="ck-anim-orbital"
        d="M7 6.5a8 8 0 0 1 10 0"
        fill="none"
        stroke="var(--tool-sec, #7C4DFF)"
        strokeWidth="1.5"
        strokeDasharray="1.5 2"
      />
      {/* Perimeter molecular atoms */}
      <circle
        className="ck-anim-atom ck-anim-atom-1"
        cx="12"
        cy="4.5"
        r="2.5"
        fill="var(--tool-sec, #7C4DFF)"
        fillOpacity="0.35"
        stroke="var(--tool-sec, #7C4DFF)"
        strokeWidth="1.5"
      />
      <circle
        className="ck-anim-atom ck-anim-atom-2"
        cx="4.5"
        cy="17.5"
        r="2.5"
        fill="var(--tool-accent, var(--accent))"
        fillOpacity="0.35"
        stroke="var(--tool-accent, var(--accent))"
        strokeWidth="1.5"
      />
      <circle
        className="ck-anim-atom ck-anim-atom-3"
        cx="19.5"
        cy="17.5"
        r="2.5"
        fill="var(--tool-accent, var(--accent))"
        fillOpacity="0.35"
        stroke="var(--tool-accent, var(--accent))"
        strokeWidth="1.5"
      />
      {/* Central carbon nucleus */}
      <circle
        className="ck-anim-core"
        cx="12"
        cy="12"
        r="3"
        fill="var(--tool-accent, var(--accent))"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function LogoGasLab({ className = '', ...props }) {
  return (
    <svg {...baseProps} {...props} className={`ck-icon-gaslab ${className}`}>
      {/* Gas compression cylinder casing */}
      <path
        d="M5 4v14a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V4"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Calibration pressure ticks */}
      <path
        d="M3.5 8h1.5 M3.5 12h1.5 M3.5 16h1.5"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="1.25"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      {/* Piston rod and compression seal */}
      <g className="ck-anim-piston">
        <line
          x1="12"
          y1="2"
          x2="12"
          y2="7"
          stroke="var(--tool-base, currentColor)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="7"
          y="7"
          width="10"
          height="2.75"
          rx="1"
          fill="var(--tool-sec, #FF5252)"
          fillOpacity="0.35"
          stroke="var(--tool-sec, #FF5252)"
          strokeWidth="1.5"
        />
      </g>
      {/* Kinetic gas particle trajectories */}
      <circle
        className="ck-anim-particle ck-anim-p1"
        cx="9"
        cy="13"
        r="1.4"
        fill="var(--tool-accent, #FF9100)"
      />
      <path
        className="ck-anim-vector ck-anim-v1"
        d="m9 13 2.2 2.2"
        stroke="var(--tool-accent, #FF9100)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle
        className="ck-anim-particle ck-anim-p2"
        cx="15"
        cy="14"
        r="1.4"
        fill="var(--tool-sec, #FF5252)"
      />
      <path
        className="ck-anim-vector ck-anim-v2"
        d="m15 14-2.5 1.5"
        stroke="var(--tool-sec, #FF5252)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle
        className="ck-anim-particle ck-anim-p3"
        cx="11"
        cy="18"
        r="1.4"
        fill="var(--tool-accent, #FF9100)"
      />
    </svg>
  )
}

export function LogoChemBalancer({ className = '', ...props }) {
  return (
    <svg {...baseProps} {...props} className={`ck-icon-balancer ${className}`}>
      {/* Central laboratory stand column & stable footing */}
      <line
        x1="12"
        y1="3"
        x2="12"
        y2="21"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 21h8"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Tilting balance assembly */}
      <g className="ck-anim-beam">
        {/* Horizontal balance beam */}
        <line
          x1="3"
          y1="7"
          x2="21"
          y2="7"
          stroke="var(--tool-accent, #2979FF)"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
        {/* Fulcrum indicator knife pointer */}
        <polygon
          points="12,4 10.2,7 13.8,7"
          fill="var(--tool-sec, #00E5FF)"
        />
        {/* Reactant balance pan (left) */}
        <g className="ck-anim-pan-left">
          <path
            d="m3 7 2 6h4l2-6"
            stroke="var(--tool-accent, #2979FF)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 13a2.5 2.5 0 0 0 5 0"
            fill="var(--tool-accent, #2979FF)"
            fillOpacity="0.3"
            stroke="var(--tool-accent, #2979FF)"
            strokeWidth="1.5"
          />
          {/* Reactant mass cube */}
          <rect
            x="6"
            y="10.5"
            width="2.5"
            height="2.5"
            rx="0.5"
            fill="var(--tool-sec, #00E5FF)"
          />
        </g>
        {/* Product balance pan (right) */}
        <g className="ck-anim-pan-right">
          <path
            d="m13 7 2 6h4l2-6"
            stroke="var(--tool-sec, #00E5FF)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 13a2.5 2.5 0 0 0 5 0"
            fill="var(--tool-sec, #00E5FF)"
            fillOpacity="0.3"
            stroke="var(--tool-sec, #00E5FF)"
            strokeWidth="1.5"
          />
          {/* Product mass sphere */}
          <circle
            cx="17"
            cy="11.75"
            r="1.4"
            fill="var(--tool-accent, #2979FF)"
          />
        </g>
      </g>
    </svg>
  )
}

export function LogoStoichiometry({ className = '', ...props }) {
  return (
    <svg {...baseProps} {...props} className={`ck-icon-stoich ${className}`}>
      {/* Reactant compound block [A] */}
      <rect
        className="ck-anim-compound-left"
        x="3"
        y="7.5"
        width="6.5"
        height="9"
        rx="1.75"
        fill="var(--tool-sec, #FF6D00)"
        fillOpacity="0.25"
        stroke="var(--tool-sec, #FF6D00)"
        strokeWidth="1.75"
      />
      <path
        d="M5.2 12h2.1"
        stroke="var(--tool-sec, #FF6D00)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Product compound block [B] */}
      <rect
        className="ck-anim-compound-right"
        x="14.5"
        y="7.5"
        width="6.5"
        height="9"
        rx="1.75"
        fill="var(--tool-accent, #FFD600)"
        fillOpacity="0.25"
        stroke="var(--tool-accent, #FFD600)"
        strokeWidth="1.75"
      />
      <path
        d="M16.7 12h2.1"
        stroke="var(--tool-accent, #FFD600)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Forward molar conversion path */}
      <path
        className="ck-anim-path-top"
        d="M7 5.5c1.5-2 3.5-3 5-3s3.5 1 5 3"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <polyline
        className="ck-anim-arrow-top"
        points="15.5 5.5 17 5.5 17 4"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Reverse stoichiometric ratio path */}
      <path
        className="ck-anim-path-bottom"
        d="M17 18.5c-1.5 2-3.5 3-5 3s-3.5-1-5-3"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <polyline
        className="ck-anim-arrow-bottom"
        points="8.5 18.5 7 18.5 7 20"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center mole ratio catalyst fulcrum */}
      <circle
        className="ck-anim-node"
        cx="12"
        cy="12"
        r="1.8"
        fill="var(--tool-accent, #FFD600)"
        stroke="var(--tool-sec, #FF6D00)"
        strokeWidth="1.2"
      />
    </svg>
  )
}

export function LogoPhCalculator({ className = '', ...props }) {
  return (
    <svg {...baseProps} {...props} className={`ck-icon-ph ${className}`}>
      {/* Aqueous hydronium teardrop flask */}
      <path
        className="ck-anim-droplet"
        d="M12 2.5C12 2.5 5 11 5 15.5a7 7 0 0 0 14 0C19 11 12 2.5 12 2.5Z"
        fill="var(--tool-accent, #FF4081)"
        fillOpacity="0.22"
        stroke="var(--tool-accent, #FF4081)"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Concentric logarithmic pH graduation rings */}
      <path
        className="ck-anim-ring-1"
        d="M8 14.5c1-1.5 2.5-2.5 4-2.5s3 1 4 2.5"
        fill="none"
        stroke="var(--tool-sec, #7C4DFF)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        className="ck-anim-ring-2"
        d="M9.5 17c.7-.7 1.6-1 2.5-1s1.8.3 2.5 1"
        fill="none"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Core proton hydronium nucleus */}
      <circle
        className="ck-anim-proton"
        cx="12"
        cy="15.5"
        r="1.5"
        fill="var(--tool-sec, #7C4DFF)"
      />
    </svg>
  )
}

export function LogoSolutionLab({ className = '', ...props }) {
  return (
    <svg {...baseProps} {...props} className={`ck-icon-solution ${className}`}>
      {/* Volumetric Erlenmeyer flask rim and conical body */}
      <path
        d="M9 2h6"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 2v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 8V2"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Solution liquid volumetric fill */}
      <path
        d="M7 14.5 C 9 13.8, 11 15.2, 13 14.5 C 15 13.8, 16 14.2, 17 14.8 L 17.8 18.5 A 2 2 0 0 1 16.2 21.5 H 6.2 A 2 2 0 0 1 4.5 18.5 Z"
        fill="var(--tool-accent, #00E5FF)"
        fillOpacity="0.25"
      />
      {/* Solution liquid meniscus wave */}
      <path
        className="ck-anim-meniscus"
        d="M6.5 14.5c1.5.8 3.5.8 5.5 0s3.5-.8 5 0"
        fill="none"
        stroke="var(--tool-accent, #00E5FF)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Calibration graduation marks */}
      <line
        x1="12"
        y1="5"
        x2="14"
        y2="5"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      <line
        x1="12"
        y1="7.5"
        x2="14"
        y2="7.5"
        stroke="var(--tool-base, currentColor)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      {/* Dissolved solute effervescent bubbles */}
      <circle
        className="ck-anim-bubble ck-anim-b1"
        cx="8.5"
        cy="18"
        r="1.2"
        fill="var(--tool-sec, #00E676)"
      />
      <circle
        className="ck-anim-bubble ck-anim-b2"
        cx="14"
        cy="18.5"
        r="1.2"
        fill="var(--tool-sec, #00E676)"
      />
      <circle
        className="ck-anim-bubble ck-anim-b3"
        cx="11.5"
        cy="16.5"
        r="1.2"
        fill="var(--tool-sec, #00E676)"
      />
    </svg>
  )
}
