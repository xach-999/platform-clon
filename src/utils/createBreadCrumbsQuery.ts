const pathToText = {
  "/dashboard": "Dashboard",
  "/practice-tests": "My Practice Tests",
  "/select-exam-mode": "Select Practice Mode",
  "/practice-tests/select-exam-mode": "Select Practice Mode"
}

export type PathQueryType = {
  path: string
  prepend: string
}

const createBreadCrumbsQuery = (
  query: Array<string | PathQueryType>,
  currentPageText: string,
  examName?: string
): Array<{ path: string, text: string }> => {
  const qResult = query.reduce((acc, path) => {
    if (typeof path === "string") {
      const text = pathToText[path]
      if (text) {
        acc.push({
          path,
          text
        })
      }
    }

    if (typeof path !== "string") {
      const text = pathToText[path.path] ? `${pathToText[path.path]}` : null
      if (text) {
        acc.push({
          path: `${path.path}/${path.prepend}`,
          text
        })
      }
    }
    return acc
  }, [])

  if (examName) qResult.push({path: null, text: examName})

  qResult.push({path: null, text: currentPageText})

  return qResult
}

export default createBreadCrumbsQuery
