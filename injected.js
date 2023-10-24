

const { fetch: origFetch } = window
window.fetch = async (...args) => {
  const [url, ...other] = args;
  const response = await origFetch(url, ...other)
  response
    .clone()
    .json()
    .then((data) => {
      //все нужные данные содержатся в api вызове на detail и data/stores 
      if (url.includes("detail") || url.includes("data/stores")) {
        const stringifiedData = JSON.stringify(data)
        window.postMessage({ type: "fetch", url: url, data: stringifiedData }, "*")
      }
    })
    .catch((err) => console.log(''))
  return response
}
