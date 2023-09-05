export default (endpoint) => {
  const root = "http://localhost:8000"
  const url = `${root}${endpoint}`

  return url
}
