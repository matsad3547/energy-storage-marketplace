const checkStatus = res => {
  if (res.status >= 200 && res.status < 300) {
    return res
  }
  const error = new Error(`HTTP Error: ${res.status} ${res.statusText}`)
  error.status = res.statusText
  error.response = res
  throw error
}

const catchErrorsWithMessage = (msg, fn) => (...args) =>
  fn(...args)
  .catch(err => {
      console.error(`${msg}:`, err)
      throw error
    })

module.exports = {
  checkStatus,
  catchErrorsWithMessage,
}
