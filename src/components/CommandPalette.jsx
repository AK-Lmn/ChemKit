import { useEffect, useRef, useState } from 'react'
import { IconSearch, IconX } from './Icons.jsx'

export function CommandPalette({ isOpen, onClose, onSelect, navItems, activeId }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const filteredItems = navItems.filter((item) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      item.name.toLowerCase().includes(q) ||
      item.shortLabel.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    )
  })

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = filteredItems[selectedIndex]
      if (item) {
        onSelect(item.id)
        onClose()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="ck-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="ck-palette-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette Quick Switcher"
      >
        <div className="ck-palette-header">
          <IconSearch className="ck-palette-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="ck-palette-input"
            placeholder="Jump to a chemistry tool, formula, or calculator..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              type="button"
              className="ck-palette-clear"
              onClick={() => setQuery('')}
              aria-label="Clear query"
            >
              <IconX />
            </button>
          )}
          <kbd className="ck-palette-esc" onClick={onClose}>
            ESC
          </kbd>
        </div>

        <div className="ck-palette-body">
          {filteredItems.length === 0 ? (
            <div className="ck-palette-empty">No tools found for "{query}".</div>
          ) : (
            <ul className="ck-palette-list" role="listbox">
              {filteredItems.map((item, index) => {
                const IconComponent = item.icon
                const isSelected = index === selectedIndex
                const isCurrent = item.id === activeId

                return (
                  <li
                    key={item.id}
                    role="option"
                    aria-selected={isSelected}
                    className={`ck-palette-item ${isSelected ? 'is-selected' : ''} ${isCurrent ? 'is-current' : ''}`}
                    onClick={() => {
                      onSelect(item.id)
                      onClose()
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="ck-palette-item-icon">
                      {IconComponent && <IconComponent />}
                    </div>
                    <div className="ck-palette-item-text">
                      <div className="ck-palette-item-title">
                        <span>{item.name}</span>
                        {isCurrent && <span className="ck-badge-current">Active</span>}
                      </div>
                      {item.description && (
                        <p className="ck-palette-item-desc">{item.description}</p>
                      )}
                    </div>
                    <kbd className="ck-palette-shortcut">{index + 1}</kbd>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="ck-palette-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to select</span>
          <span><kbd>Esc</kbd> to dismiss</span>
        </div>
      </div>
    </div>
  )
}
