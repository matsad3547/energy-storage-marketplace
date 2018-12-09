import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import GradientBackground from './GradientBackground'
import Header3 from './Header3'
import ProjectMenu from './ProjectMenu'

import {
  colors,
  boxShadow,
} from '../config/styles'

const ProjectPageHeader = ({
  title,
  baseUrl,
  id,
}) => {

  const [isCompact, setIsCompact] = useState(false)
  const [position, setPosition] = useState(null)

  const header = useRef(null)

  const checkScroll = e => {
    if (header.current) {
      const pos = header.current.getBoundingClientRect().top
      setPosition(pos)
      if(position < 0) {
        setIsCompact(true)
      }
      else if (position > 2) {
        setIsCompact(false)
      }
    }
  }

  const setFontSize = () => {
    if( position >= - 40 && position < 0) {
      return `${1 + (position * .005)}em`
    }
    else if (position < - 40) {
      return '.8em'
    }
    else {
      return '1em'
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', checkScroll)
    return () => document.removeEventListener('scroll', checkScroll)
  })

  const switchStyles = isCompact ? {
    height: 120,
  } : {
    height: 2,
  }

  const rootStyles = isCompact ? styles.compactRoot : styles.root

  const gradientStyles = isCompact ? {
    display: 'none',
  } : {
    ...styles.background,
    ...styles.placement,
  }

  const itemStyles = isCompact ? styles.compactItems : {
    ...styles.placement,
    ...styles.items,
  }

  const textStyles = isCompact ? {
    fontSize: setFontSize(),
    ...styles.compactText
  } : styles.text

  return (
    <div>
      <div ref={header} style={switchStyles}></div>
      <div
        style={rootStyles}
        >
        <GradientBackground
          addlStyles={gradientStyles}
          />
        <div style={itemStyles}>
          <ProjectMenu
            baseUrl={baseUrl}
            id={id}
            />
          <div style={textStyles}>
            <Header3 content={title} />
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  root: {
    display: 'grid',
    gridTemplateColumns: '[leftCol] auto [centerMargin] 6% [rightCol] 45% [end]',
    gridTemplateRows: '[row1] minmax(4em, max-content) [ws1] 2em',
  },
  compactRoot: {
    display: 'block',
    width: '100%',
    position: 'fixed',
    zIndex: 2,
    top: 0,
    background: 'white',
    boxShadow,
    transition: 'all 1s'
  },
  placement: {
    gridColumn: 'leftCol / centerMargin',
    gridRowStart: 'row1',
  },
  background: {
    clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0 100%)'
  },
  items: {
    display: 'inline-flex',
    justifyContent: 'space-between',
    color: colors.white,
    zIndex: 1,
  },
  compactItems: {
    display: 'inline-flex',
    justifyContent: 'space-between',
    width: '100%',
    color: colors.gray,
    alignItems: 'baseline',
  },
  text: {
    padding: '.5em 2em',
    alignSelf: 'flex-end',
    background: 'transparent',
  },
  compactText: {
    padding: '.5em 2em',
  },
}

ProjectPageHeader.propTypes = {
  title: PropTypes.string.isRequired,
}

export default ProjectPageHeader