export const abbrToExamType = {
  PCS: "python",
  PCA: "python",
  WCE: "wordpress",
  HCCS: "hccs",
  CSS: "hccs",
  JCS: "jscs",
  NCS: "dncs",
  TSCS: "tscs",
  WORDPRESS: "wordpress",
  CCA: "cca"
  // HCCS: "htmlCss",
  // CSS: "htmlCss",
  // JCS: "javascript",
  // NCS: "aspnet",
}

export const findExamType = (voucher?: string) => {
  if (!voucher) return ""

  let type = ""

  Object.entries(abbrToExamType).forEach(([abbr, value]) => {
    if (voucher.includes(abbr)) type = value
  })

  return type
}
