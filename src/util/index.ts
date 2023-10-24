export const bailOutInlineAnchor = (message: string) =>
  setTimeout(() => {
    throw new Error(message)
  }, 30000)
