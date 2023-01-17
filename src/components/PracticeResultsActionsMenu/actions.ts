import axios from "lib/axios"

export default function importCertificatesApi(credential_ids) {
  const body = {
    credential_ids: credential_ids
  }

  axios.post("https://api.accredible.com/v1/credentials/generate_pdf", body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token token=2646d04f77ef3978f2cdbd096d87aff4"
    }
  }).then(a => window.open(a.data.file, "_self"))
}
