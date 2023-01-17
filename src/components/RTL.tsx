import React, {useEffect} from "react"
import createCache from "@emotion/cache"
import {CacheProvider} from "@emotion/react"
import stylisRTLPlugin from "stylis-plugin-rtl"

const styleCache = () =>
  createCache({
    key: "rtl",
    prepend: true,
    // We have to temporarily ignore this due to incorrect definitions
    // in the stylis-plugin-rtl module
    // @see https://github.com/styled-components/stylis-plugin-rtl/issues/23
    // @ts-ignore
    stylisPlugins: [stylisRTLPlugin]
  })

interface Props {
  direction: "ltr" | "rtl"
}

export default function RTL(props: React.PropsWithChildren<Props>) {
  const {children, direction} = props

  useEffect(() => {
    document.dir = direction
  }, [direction])

  if (direction === "rtl") {
    return <CacheProvider value={styleCache()}>{children}</CacheProvider>
  }

  return <>{children}</>
}
