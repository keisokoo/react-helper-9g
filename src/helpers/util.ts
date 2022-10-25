/** 클립보드 복사 */
export async function copyToClipboard(text: string): Promise<string> {
  if (window.navigator?.clipboard && window.isSecureContext) {
    return new Promise((res, rej) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          res(text)
        })
        .catch((err) => {
          rej('error')
        })
    })
  } else {
    let El = document.createElement('textarea')
    El.style.position = 'absolute'
    El.style.opacity = '0'
    document.body.appendChild(El)
    El.value = text
    El.focus()
    El.select()
    return new Promise((res, rej) => {
      document.execCommand('copy') ? res(text) : rej('error')
      El.remove()
    })
  }
}
