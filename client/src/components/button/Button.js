import React from 'react'
import PropTypes from 'prop-types'

import { buttons } from '../../config/'

const Button = ({
  value,
  type,
  onClick,
  disabled = false,
  width = '6em'
}) => {

  const getStyles = type => ({
    ...styles.root,
    ...buttons[type],
    width,
  })

  return (
    <input
      type="button"
      value={value}
      style={getStyles(type)}
      disabled={disabled}
      onClick={onClick}
      />
  )
}

const styles = {
  root: {
  	MozBorderRadius: 10,
  	WebkitBorderRadius: 10,
  	borderRadius: 10,
  	display: 'inline-block',
  	cursor: 'pointer',
  	fontSize: '1.3em',
    textAlign: 'center',
  	padding: '1em',
  },
}

Button.propTypes = {
  value: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.keys(buttons)).isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
}

export default Button