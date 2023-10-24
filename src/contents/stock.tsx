import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { Fragment, useEffect } from "react"

import { bailOutInlineAnchor } from "~util"

import { useData } from "./dataStore"

//где запускать скрипт (контент скрипт)
export const config: PlasmoCSConfig = {
  matches: ["https://www.wildberries.ru/catalog/*"],
  all_frames: true,
  run_at: "document_idle"
}

const timer = bailOutInlineAnchor("Stock block not found")
const selector =
  "div.__evirma_inject_block > div.seller-info__content > div.seller-info__header"

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

const PlasmoOverlay = () => {
  const { data } = useData()
  const nearestWareHouse = data?.stocks?.sort(
    (a, b) => a.time1 + a.time2 - (b.time1 + b.time2)
  )[0]
  return (
    <div className="rounded-xl p-5 bg-white shadow-[0 0 20px rgba(0, 0, 0, 0.1)] max-w-[340px]">
      <div className="text-gray-600 font-bold text-base">
        Раскладка по складам
      </div>
      <div className="text-sm ml-6 my-2 font-bold">{`${nearestWareHouse?.wh_name}: ${
        (nearestWareHouse?.time1 ?? 0) + (nearestWareHouse?.time2 ?? 0)
      } час.`}</div>
      <div className="pt-2 border-t-gray-300 border-t grid-cols-2 grid gap-2 ml-6">
        {data?.stocks?.map((wh) => (
          <Fragment key={wh.wh_name}>
            <span className="text-gray-600 text-sm">{wh.wh_name}</span>
            <span className="grid grid-cols-2 text-sm">
              <b className="text-gray-700">{`${wh.time1 + wh.time2} ч.`}</b>
              <span className="text-gray-600">{`${wh.qty} шт.`}</span>
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default PlasmoOverlay
