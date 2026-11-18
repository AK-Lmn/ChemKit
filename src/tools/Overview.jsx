import { IconArrowRight } from '../components/Icons.jsx'

export function Overview({ tools, onOpenTool }) {
  return (
    <div className="ck-stack">
      <section className="ck-overview-hero">
        <h1>Seven chemistry tools in one workspace.</h1>
        <p>
          Browse atomic data, compute molar mass and particle counts, solve gas laws, balance chemical equations,
          run stoichiometry conversions, calculate pH and weak dissociation, and prepare lab solutions without
          switching sites.
        </p>
        <div className="ck-overview-actions">
          <button
            type="button"
            className="ck-btn ck-btn--primary"
            onClick={() => onOpenTool('elements')}
          >
            Open Element Explorer
            <IconArrowRight />
          </button>
          <button
            type="button"
            className="ck-btn ck-btn--secondary"
            onClick={() => onOpenTool('balancer')}
          >
            Balance an Equation
          </button>
        </div>
      </section>

      <section aria-label="Chemistry tools directory">
        <div className="ck-suite-list">
          {tools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                type="button"
                className="ck-suite-row ck-stagger-row"
                style={{ '--stagger': Math.min(index, 7) }}
                onClick={() => onOpenTool(tool.id)}
              >
                <div className="ck-suite-row-head">
                  <div className="ck-suite-row-left">
                    <span className="ck-tool-glyph">
                      <Icon />
                    </span>
                    <div>
                      <h2>{tool.name}</h2>
                      <p className="ck-suite-desc">{tool.description}</p>
                    </div>
                  </div>
                </div>
                <div className="ck-suite-cta">
                  <span className="ck-suite-tag">{tool.path}</span>
                  <span>Open</span>
                  <IconArrowRight />
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
