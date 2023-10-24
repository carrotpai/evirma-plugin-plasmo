export type SPPDataType = {
  basicPriceU: number
  basicSale: number
  clientPriceU: number
  clientSale: number
}

export type StockDataType = {
  wh: number
  qty: number
  time1: number
  time2: number
  wh_name?: string
}

export type WareHousesResponseType = Array<{ id: number; name: string }>

export type DetailResponseType = {
  data: {
    products: Array<ResponseProductDataType>
  }
}

export type ResponseProductDataType = {
  extended: SPPDataType
  sizes: Array<{
    stocks: Array<Omit<StockDataType, "wh_name">>
  }>
}

export type ProductDataType = {
  extended?: SPPDataType
  stocks?: Array<StockDataType>
}
