import logo64 from "data-base64:~assets/logo.jpeg"
import cssText from "data-text:~style.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId
} from "plasmo"

import { bailOutInlineAnchor } from "~util"

import { useData } from "./dataStore"

//где запускать скрипт (контент скрипт)
export const config: PlasmoCSConfig = {
  matches: ["https://www.wildberries.ru/*"],
  all_frames: true,
  run_at: "document_idle"
}

const sideBarSelector =
  "div.product-page__aside-container.j-price-block > div.product-page__price-block"
const priceSelector = "div.price-block"

let selector = sideBarSelector
let mql = window.matchMedia("(max-width: 1366px)")
if (mql.matches) {
  selector = priceSelector
}
mql.addEventListener("change", (ev) => {
  if (ev.matches) {
    selector = priceSelector
  } else {
    selector = sideBarSelector
  }
})

const timer = bailOutInlineAnchor("SPP block not found")

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  const elem = document.querySelector(selector)
  if (elem) clearTimeout(timer)
  return elem as Element
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

/* export const getShadowHostId: PlasmoGetShadowHostId = () => `SPP-BLOCK` */
const PlasmoOverlay = () => {
  const data = useData()
  const getSpp = () => {
    if (data) {
      return data.extended?.clientSale ?? data.extended?.basicSale
    } else {
      return undefined
    }
  }

  return (
    <div className="flex items-center gap-2 w-full max-w-[300px] mb-2 xl:mb-0">
      <img
        src={logo64}
        width={36}
        height={36}
        alt="market papa logo"
        className="w-9 h-9"
      />
      <div className="rounded-md bg-gray-100 flex items-center justify-between px-4 py-2 w-full">
        <div>
          <span className="text-gray-500 font-medium">СПП: </span>
          <b>{`${getSpp()}%`}</b>
        </div>
        <div>
          <span className="text-gray-500 font-medium">До СПП: </span>
          <p className="inline">{`${
            data ? (data.extended?.basicPriceU ?? 0) / 100 : undefined
          }₽`}</p>
        </div>
      </div>
    </div>
  )
}

export default PlasmoOverlay
