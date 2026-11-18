import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { IconCheck, IconChevronDown } from './Icons.jsx'

const EXIT_MS = 160

/**
 * Accessible custom select built on ARIA listbox pattern.
 * Popover enters from trigger at 0.95 scale (200ms ease-out) and exits 20% faster (160ms).
 * Supports ArrowUp, ArrowDown, Home, End, Enter, Space, and Escape.
 */
export function Combobox({
  id,
  value,
  options,
  onChange,
  disabled = false,
  ariaLabel,
  ariaLabelledBy,
  placeholder = 'Select an option',
  compact = false,
  className = '',
}) {
  const generatedId = useId()
  const triggerId = id || `select-${generatedId}`
  const listboxId = `${triggerId}-listbox`
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const closeTimerRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const selectedIndex = options.findIndex((option) => option.value === value)
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null

  const clearTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const closeMenu = useCallback(() => {
    setOpen(false)
    clearTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setMounted(false)
      closeTimerRef.current = null
    }, EXIT_MS)
  }, [])

  const openMenu = useCallback(
    (startIndex) => {
      if (disabled || options.length === 0) return
      clearTimer()
      const fallback = selectedIndex >= 0 ? selectedIndex : 0
      setActiveIndex(startIndex !== undefined ? startIndex : fallback)
      setMounted(true)
      setOpen(true)
    },
    [disabled, options.length, selectedIndex],
  )

  useEffect(() => () => clearTimer(), [])

  useEffect(() => {
    if (!open) return undefined
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeMenu()
      }
    }
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeMenu()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, closeMenu])

  const commitIndex = (index) => {
    const chosen = options[index]
    if (!chosen) return
    onChange(chosen.value)
    closeMenu()
    triggerRef.current?.focus()
  }

  const handleKeyDown = (event) => {
    if (disabled || options.length === 0) return
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openMenu()
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        openMenu(selectedIndex >= 0 ? selectedIndex : options.length - 1)
      }
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % options.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + options.length) % options.length)
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(options.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      commitIndex(activeIndex)
    } else if (event.key === 'Tab') {
      closeMenu()
    }
  }

  return (
    <div ref={containerRef} className={`ck-select ${compact ? 'ck-select--compact' : ''} ${className}`}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={mounted ? listboxId : undefined}
        aria-activedescendant={open ? `${listboxId}-opt-${activeIndex}` : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        disabled={disabled}
        className={`ck-select-trigger ${open ? 'is-open' : ''}`}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
      >
        <span className="ck-select-value">{selectedOption ? selectedOption.label : placeholder}</span>
        <IconChevronDown className={`ck-select-chevron ${open ? 'is-rotated' : ''}`} />
      </button>

      {mounted && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          aria-hidden={!open}
          data-state={open ? 'open' : 'closed'}
          className="ck-select-menu"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isActive = index === activeIndex
            return (
              <li
                key={option.value}
                id={`${listboxId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`ck-select-option ${isSelected ? 'is-selected' : ''} ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault()
                  commitIndex(index)
                }}
              >
                <span className="ck-select-option-label">{option.label}</span>
                {option.detail && <span className="ck-select-option-detail">{option.detail}</span>}
                {isSelected && <IconCheck className="ck-select-check" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export const Select = Combobox
