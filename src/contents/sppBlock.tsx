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
  matches: ["https://www.wildberries.ru/catalog/*"],
  all_frames: true,
  run_at: "document_idle"
}

let selector =
  "div.product-page__aside-container > div.__evirma_inject_block > div"
let mql = window.matchMedia("(max-width: 1366px)")
if (mql.matches) {
  selector =
    "div.product-page__price-block > div > div.__evirma_inject_block > div"
}
mql.addEventListener("change", (ev) => {
  if (ev.matches) {
    selector =
      "div.product-page__price-block > div > div.__evirma_inject_block > div"
  } else {
    selector =
      "div.product-page__aside-container > div.__evirma_inject_block > div"
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

export const getShadowHostId: PlasmoGetShadowHostId = () => `SPP-BLOCK`

const PlasmoOverlay = () => {
  const { data } = useData()
  return (
    <div className="z-50 flex">
      <img src={logo64} width={36} height={36} alt="market papa logo" />
      <div>
        <span>СПП: </span>
        <b>{`${data && data.extended?.clientSale}%`}</b>
      </div>
      <div>
        <span>До СПП: </span>
        <p className="inline">{`${
          data ? (data.extended?.basicPriceU ?? 0) / 100 : undefined
        }₽`}</p>
      </div>
    </div>
  )
}

export default PlasmoOverlay
