export const pendingCase = (state) => {
  state.loading = true
}

export const errorCase = (state, action) => {
  state.loading = false
  state.hasErrors = true
  if (action?.error?.message) state.errorMessage = action?.error?.message
  console.warn(action?.error)
}
