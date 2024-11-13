import { Box, useColorMode } from '@chakra-ui/react'
import { Sun, Moon } from 'phosphor-react'
import { css } from '@emotion/react'

const styles = css`
  .theme-toggle {
    position: relative;
    width: 140px;
    height: 32px;
    background: #f0f0f0;
    border-radius: 20px;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 2px;
    overflow: hidden;
    user-select: none;
  }

  .theme-toggle.dark {
    background: #2D3748;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider {
    position: absolute;
    width: calc(50% - 4px);
    height: calc(100% - 4px);
    border-radius: 18px;
    background: white;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    z-index: 1;
  }

  .theme-toggle.dark .slider {
    transform: translateX(calc(100% + 2px));
    background: #4A5568;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .options-container {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
  }

  .option {
    position: relative;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
    z-index: 2;
  }

  .theme-toggle:not(.dark) .option:first-of-type,
  .theme-toggle.dark .option:last-of-type {
    color: #1A1A1A;
  }

  .theme-toggle:not(.dark) .option:last-of-type {
    color: #718096;
  }

  .theme-toggle.dark .option:first-of-type {
    color: #A0AEC0;
  }

  .icon {
    font-size: 14px;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .theme-toggle:not(.dark) .option:first-of-type .icon {
    transform: scale(1.1);
    color: #FE7028;
  }

  .theme-toggle.dark .option:last-of-type .icon {
    transform: scale(1.1);
    color: #90CDF4;
  }

  .theme-toggle:hover .slider {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`

export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <Box css={styles}>
      <div 
        className={`theme-toggle ${isDark ? 'dark' : ''}`}
        onClick={toggleColorMode}
        role="button"
        aria-label="Toggle theme"
      >
        <div className="slider" />
        <div className="options-container">
          <div className="option">
            <Sun weight={!isDark ? "fill" : "regular"} className="icon" />
            <span>DAY</span>
          </div>
          <div className="option">
            <Moon weight={isDark ? "fill" : "regular"} className="icon" />
            <span>NIGHT</span>
          </div>
        </div>
      </div>
    </Box>
  )
} 