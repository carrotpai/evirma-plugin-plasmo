import logo64 from "data-base64:~assets/logo.jpeg"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { Fragment, useEffect } from "react"

import { bailOutInlineAnchor } from "~util"

import { useData } from "./dataStore"

//где запускать скрипт (контент скрипт)
export const config: PlasmoCSConfig = {
  matches: ["https://www.wildberries.ru/*"],
  all_frames: true,
  run_at: "document_idle"
}

const timer = bailOutInlineAnchor("Stock block not found")

const sideBarSelector =
  "div.product-page__aside-sticky > div.product-page__seller-wrap"

let selector = sideBarSelector

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

/* export const getShadowHostId: PlasmoGetShadowHostId = () => `STOCK-BLOCK` */
const PlasmoOverlay = () => {
  const data = useData()
  useEffect(() => {
    console.log("changed stock")
  }, [data])
  const nearestWareHouse = data?.stocks?.sort(
    (a, b) => a.time1 + a.time2 - (b.time1 + b.time2)
  )[0]
  return (
    <div className="rounded-[20px] p-5 bg-white shadow-none max-w-full lg:shadow-base w-full lg:max-w-[340px] mb-4">
      <div className="flex items-center gap-2">
        <img
          src={logo64}
          width={36}
          height={36}
          alt="market papa logo"
          className="w-9 h-9 hidden lg:block"
        />
        <p className="text-gray-600 font-bold text-base">
          Раскладка по складам
        </p>
      </div>
      <div className="text-sm lg:ml-11 my-2 font-bold">{`${nearestWareHouse?.wh_name}: ${
        (nearestWareHouse?.time1 ?? 0) + (nearestWareHouse?.time2 ?? 0)
      } час.`}</div>
      <div className="pt-2 border-t-gray-300 border-t grid-cols-2 grid gap-2 lg:ml-11">
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
