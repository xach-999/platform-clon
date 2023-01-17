export default function formatDate(dateString: string) {
  const options = {year: "numeric", month: "numeric", day: "numeric"}

  return new Date(dateString).toLocaleDateString(undefined, options as any)
}
