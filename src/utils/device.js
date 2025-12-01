export const getDevice = () => {
  if (window.tizen) {
    return 'tizen'
  } else if (window.webos) {
    return 'webos'
  } else if (window.Hisense) {
    return 'hisense'
  }

  return 'web'
}
