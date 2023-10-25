import { useSyncExternalStore } from "react"

import type {
  DetailResponseType,
  ProductDataType,
  ResponseProductDataType,
  WareHousesResponseType
} from "~types"

type Listener = (onStoreChange?: () => void) => void

export const config = {
  matches: ["https://www.wildberries.ru/*"],
  all_frames: true,
  run_at: "document_start"
}

let listeners: Listener[] = []
let productData: ProductDataType | null = null
let productsList: ResponseProductDataType[] = []
let wareHousesData: WareHousesResponseType | null = null

function emitChange() {
  for (let listener of listeners) {
    listener()
  }
}

//функция для парсинга данных перехваченных запросов в нормализованный вид
function setProductData() {
  productsList.sort((a, b) => {
    //сортировка по минимальному времени доставки
    let minTimeA = a.sizes[0].stocks.reduce(
      (min, curr) =>
        min.time1 + min.time2 > curr.time1 + curr.time2 ? curr : min,
      a.sizes[0].stocks[0]
    )
    let minTimeB = b.sizes[0].stocks.reduce(
      (min, curr) =>
        min.time1 + min.time2 > curr.time1 + curr.time2 ? curr : min,
      b.sizes[0].stocks[0]
    )
    return minTimeA.time1 + minTimeA.time2 - minTimeB.time1 - minTimeB.time2
  })
  const currentProduct = productsList[0]
  //если есть продукт и данные о складах создать полноценные данные
  if (productsList[0] && wareHousesData) {
    productData = {
      extended: productsList[0].extended,
      stocks: currentProduct.sizes[0].stocks.map((wh) => {
        const whName = wareHousesData?.find((item) => item.id === wh.wh)
        return { ...wh, wh_name: whName?.name }
      })
    }
    //иначе только данные о СПП
  } else {
    if (productsList[0]) {
      productData = {
        extended: productsList[0].extended
      }
    }
  }
}

const onMessageCallback = async (e: MessageEvent) => {
  const respInfo = e.data as
    | {
        type: string
        url: string
        data: DetailResponseType | WareHousesResponseType
      }
    | undefined
  if (respInfo && respInfo.url) {
    //запрос на detail о продукте
    if (respInfo.url.includes("detail")) {
      const incomDetailData = respInfo.data as DetailResponseType
      //пройтись по всем продуктам в запросе и выбрать те которые есть на складе
      incomDetailData.data.products.forEach((product) => {
        if (product.sizes[0].stocks.length) {
          productsList.push(product)
        }
      })

      if (!wareHousesData) {
        wareHousesData = await (
          await fetch(
            "https://static-basket-01.wb.ru/vol0/data/stores-data.json"
          )
        ).json()
      }
      setProductData()
    }
  }
  //оповестить компоненты о изменении
  emitChange()
}

//следить за url -> если меняется, обнулить некоторые поля хранилища
const observeUrlChange = () => {
  let oldHref = document.location.href
  const body = document.querySelector("body") as Node
  const observer = new MutationObserver((mutations) => {
    if (oldHref !== document.location.href) {
      console.log(`old: ${oldHref} new: ${document.location.href}`)
      productData = null
      productsList = []
      oldHref = document.location.href
    }
  })
  observer.observe(body, { childList: true, subtree: true })
}

window.addEventListener("message", onMessageCallback)
window.onload = observeUrlChange
window.onbeforeunload = function () {
  productData = null
  productsList = []
}

export function useData() {
  const data = useSyncExternalStore<ProductDataType | null>(
    subscribe,
    getSnapshot
  )
  return data
}

function subscribe(listener: Listener) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function getSnapshot() {
  return productData
}
