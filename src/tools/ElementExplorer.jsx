import { useEffect, useMemo, useRef, useState } from 'react'
import { ELEMENTS, ELEMENT_CATEGORIES } from '../lib/elements.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { IconArrowRight, IconSearch, IconStar, IconX, LogoElementExplorer } from '../components/Icons.jsx'

const CATEGORY_CLASS = Object.freeze({
  'Alkali metal': 'ck-cat-alkali',
  'Alkaline earth metal': 'ck-cat-alkaline',
  'Transition metal': 'ck-cat-transition',
  'Post-transition metal': 'ck-cat-post',
  Metalloid: 'ck-cat-metalloid',
  'Reactive nonmetal': 'ck-cat-nonmetal',
  'Noble gas': 'ck-cat-noble',
  Lanthanide: 'ck-cat-lanthanide',
  Actinide: 'ck-cat-actinide',
  Unknown: 'ck-cat-unknown',
})

export function ElementExplorer({ onSendToMoleMate }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [selectedElement, setSelectedElement] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [favorites, setFavorites] = useLocalStorage('chemistry-hub-favorites', [])
  const closeBtnRef = useRef(null)
  const dialogTimerRef = useRef(null)

  const openDialog = (element) => {
    if (dialogTimerRef.current) {
      window.clearTimeout(dialogTimerRef.current)
      dialogTimerRef.current = null
    }
    setSelectedElement(element)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    if (dialogTimerRef.current) window.clearTimeout(dialogTimerRef.current)
    dialogTimerRef.current = window.setTimeout(() => {
      setSelectedElement(null)
      dialogTimerRef.current = null
    }, 160)
  }

  useEffect(() => () => {
    if (dialogTimerRef.current) window.clearTimeout(dialogTimerRef.current)
  }, [])

  const favoriteSet = useMemo(
    () => new Set(Array.isArray(favorites) ? favorites.filter((v) => Number.isInteger(v)) : []),
    [favorites],
  )

  const favoritesOnly = categoryFilter === 'Favorites'

  const matchingSet = useMemo(() => {
    const query = search.trim().toLowerCase()
    const ids = new Set()
    for (const element of ELEMENTS) {
      const matchesSearch =
        !query ||
        element.name.toLowerCase().includes(query) ||
        element.symbol.toLowerCase().includes(query) ||
        String(element.atomicNumber) === query
      const matchesCategory = favoritesOnly
        ? favoriteSet.has(element.atomicNumber)
        : categoryFilter === 'All' || element.category === categoryFilter
      if (matchesSearch && matchesCategory) {
        ids.add(element.atomicNumber)
      }
    }
    return ids
  }, [search, categoryFilter, favoritesOnly, favoriteSet])

  const hasFilter = search.trim().length > 0 || categoryFilter !== 'All'

  useEffect(() => {
    if (!dialogOpen) return undefined
    closeBtnRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeDialog()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [dialogOpen])

  const toggleFavorite = (atomicNumber) => {
    setFavorites((current) => {
      const list = Array.isArray(current) ? current : []
      return list.includes(atomicNumber)
        ? list.filter((value) => value !== atomicNumber)
        : [...list, atomicNumber]
    })
  }

  return (
    <div className="ck-stack">
      <div className="ck-tool-header">
        <div className="ck-tool-header-row">
          <div className="ck-tool-header-identity">
            <span className="ck-tool-header-mark" style={{ '--accent': '#4dd8e8' }} aria-hidden="true">
              <LogoElementExplorer />
            </span>
            <div>
              <div className="ck-tool-badge-row">
                <span className="ck-tool-badge-num">06</span>
                <span className="ck-tool-badge-cat">Elements</span>
              </div>
              <h1 className="ck-tool-title">Element Explorer</h1>
              <p className="ck-tool-subtitle">
                Search all 118 elements by name, symbol, or atomic number. Star elements to keep a quick study list.
              </p>
            </div>
          </div>
          <div style={{ minWidth: '240px', flex: '0 1 300px' }}>
            <label htmlFor="element-search" className="ck-label" style={{ display: 'block', marginBottom: '6px' }}>
              Search elements
            </label>
            <div className="ck-search-wrap">
              <IconSearch className="ck-search-icon" />
              <input
                id="element-search"
                type="text"
                className="ck-input ck-search-input"
                placeholder="Name, symbol, or atomic #"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ck-chip-row" role="group" aria-label="Filter elements by category">
        <button
          type="button"
          className="ck-chip"
          aria-pressed={favoritesOnly}
          onClick={() => setCategoryFilter((current) => (current === 'Favorites' ? 'All' : 'Favorites'))}
        >
          <IconStar filled={favoritesOnly} />
          Favorites ({favoriteSet.size})
        </button>
        {ELEMENT_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className="ck-chip"
            aria-pressed={!favoritesOnly && categoryFilter === category}
            onClick={() => setCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <section className="ck-panel" aria-label="Interactive periodic table">
        <div className="ck-panel-head">
          <div>
            <h2 className="ck-panel-title">Periodic Table (IUPAC 18-Column)</h2>
            <p className="ck-panel-note">
              Showing {matchingSet.size} of 118 elements. Select any tile for atomic properties and electron configuration.
            </p>
          </div>
          {hasFilter && (
            <button
              type="button"
              className="ck-btn ck-btn--secondary ck-btn--sm"
              onClick={() => {
                setSearch('')
                setCategoryFilter('All')
              }}
            >
              Reset filters
            </button>
          )}
        </div>

        {matchingSet.size === 0 ? (
          <p className="ck-empty" role="status" aria-live="polite">
            {favoritesOnly
              ? 'No favorite elements saved yet. Click the star on any element tile to bookmark it.'
              : 'No elements match the current search and category filter.'}
          </p>
        ) : (
          <div className="ck-ptable-scroll">
            <div className="ck-ptable">
              {ELEMENTS.map((element) => {
                const isMatched = matchingSet.has(element.atomicNumber)
                const isFav = favoriteSet.has(element.atomicNumber)
                const gridRow = element.row >= 8 ? element.row + 1 : element.row
                const categoryClass = CATEGORY_CLASS[element.category] || 'ck-cat-unknown'
                return (
                  <div
                    key={element.atomicNumber}
                    role="button"
                    tabIndex={0}
                    className={`ck-el-tile ${categoryClass} ${!isMatched ? 'is-dimmed' : ''} ${
                      selectedElement?.atomicNumber === element.atomicNumber ? 'is-selected' : ''
                    }`}
                    style={{ gridColumn: element.column, gridRow }}
                    aria-label={`${element.name}, symbol ${element.symbol}, atomic number ${element.atomicNumber}`}
                    onClick={() => openDialog(element)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openDialog(element)
                      }
                    }}
                  >
                    <div className="ck-el-top">
                      <span className="ck-el-num">{element.atomicNumber}</span>
                      <button
                        type="button"
                        className={`ck-el-star ${isFav ? 'is-fav' : ''}`}
                        aria-label={`${isFav ? 'Remove' : 'Add'} ${element.name} ${isFav ? 'from' : 'to'} favorites`}
                        aria-pressed={isFav}
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleFavorite(element.atomicNumber)
                        }}
                      >
                        <IconStar filled={isFav} />
                      </button>
                    </div>
                    <span className="ck-el-sym">{element.symbol}</span>
                    <span className="ck-el-name">{element.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {selectedElement && (
        <div
          className="ck-backdrop"
          data-state={dialogOpen ? 'open' : 'closed'}
          role="dialog"
          aria-modal="true"
          aria-labelledby="element-dialog-title"
          onClick={closeDialog}
        >
          <div
            className="ck-dialog ck-stack"
            data-state={dialogOpen ? 'open' : 'closed'}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ck-panel-head" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  className={CATEGORY_CLASS[selectedElement.category] || 'ck-cat-unknown'}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-canvas)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {selectedElement.atomicNumber}
                  </span>
                  <strong
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      lineHeight: 1.05,
                      color: 'var(--el-color)',
                    }}
                  >
                    {selectedElement.symbol}
                  </strong>
                </div>
                <div>
                  <h2 id="element-dialog-title" className="ck-panel-title" style={{ fontSize: '1.375rem' }}>
                    {selectedElement.name}
                  </h2>
                  <p className="ck-panel-note">{selectedElement.category}</p>
                </div>
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                className="ck-btn ck-btn--secondary ck-btn--sm"
                aria-label="Close element details"
                onClick={closeDialog}
              >
                <IconX />
              </button>
            </div>

            <div className="ck-stat-grid">
              {[
                ['Atomic weight', `${selectedElement.atomicWeight} u`],
                ['Standard weight', selectedElement.atomicWeightFull],
                ['Group / Period', `${selectedElement.group ?? 'f-block'} / ${selectedElement.period}`],
                ['Block', `${selectedElement.block}-block`],
                ['Phase (STP)', selectedElement.occurrence],
                ['Origin', selectedElement.stateOfMatter],
                ['Valence electrons', selectedElement.valenceElectrons],
                ['Electron config', selectedElement.electronConfiguration],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className="ck-stat ck-detail-settle"
                  style={{ '--stagger': Math.min(index, 6) }}
                >
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="ck-btn-row" style={{ justifyContent: 'space-between' }}>
              <button
                type="button"
                className="ck-btn ck-btn--secondary"
                onClick={() => toggleFavorite(selectedElement.atomicNumber)}
              >
                <IconStar filled={favoriteSet.has(selectedElement.atomicNumber)} />
                {favoriteSet.has(selectedElement.atomicNumber) ? 'Remove favorite' : 'Add to favorites'}
              </button>

              <button
                type="button"
                className="ck-btn ck-btn--primary"
                onClick={() => {
                  const target = selectedElement
                  closeDialog()
                  onSendToMoleMate(target.symbol, target.atomicMass)
                }}
              >
                Use in MoleMate
                <IconArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
