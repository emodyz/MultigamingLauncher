
export const isRenderer = process && process.type === 'renderer'

export const isMain = !isRenderer
