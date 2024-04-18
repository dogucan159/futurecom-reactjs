import React from "react"
import LoadPanel from "devextreme-react/load-panel"

export const withLoadPanel = WrappedComponent => {
  return ({ panelProps, loading = false, hasData, ...props }) => {
    if (!hasData) {
      return <LoadPanel showPane={false} visible {...panelProps} />
    } else {
      return (
        <>
          {loading && <LoadPanel showPane={false} visible {...panelProps} />}
          <WrappedComponent {...props} />
        </>
      )
    }
  }
}
