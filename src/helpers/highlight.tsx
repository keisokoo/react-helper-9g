import React from 'react'
import { v4 as uuidV4 } from 'uuid'

export const termsMatchSplit = (terms: string, target: string) => {
  let result = terms.split('+').map((str) => {
    return str
      .toLowerCase()
      .normalize('NFC')
      .replace(/(-[^\s]+)/g, '')
      .split(/\s/g)
      .filter((ii) => ii)
      .flat()
  })
  const resultArray = result.reduce((acc, val) => acc.concat(val), [])
  const matches = target.split(
    new RegExp(
      `(${escapeRegExp(resultArray.join('|').normalize('NFC'))})`,
      'gi'
    )
  )
  const resultWords = matches.map<React.ReactNode>((resultTerm) => {
    return (
      <React.Fragment key={uuidV4()}>
        {resultArray.includes(resultTerm.toLowerCase()) ? (
          <span className="highlight">{resultTerm}</span>
        ) : (
          <>{resultTerm}</>
        )}
      </React.Fragment>
    )
  })
  return resultWords
}

function escapeRegExp(text: string) {
  // return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  return text.replace(/[-[\]{}()*+?.,\\^$#\s]/g, '\\$&')
}
const highlight = (
  itemTarget: string | null,
  term?: string | null
): string | JSX.Element => {
  if (!itemTarget) return ''
  if (!term) return itemTarget
  if (term.length < 1) return itemTarget
  const terms = termsMatchSplit(term, itemTarget)
  return <>{terms}</>
}
export default highlight
