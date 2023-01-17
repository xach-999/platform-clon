import React, {useState} from "react"
import {Box, InputAdornment, TextField} from "@mui/material"
import SearchIcon from "assets/icons/Search"

const useSearchInput = (placeholder) => {
  const [searchInput, setSearchInput] = useState<string>("")

  const SearchInputJSX: JSX.Element = (
    <Box sx={{maxWidth: "100%", width: 400}}>
      <TextField
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          )
        }}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder={placeholder}
        value={searchInput || ""}
        variant="outlined"
      />
    </Box>
  )

  return {
    SearchInputJSX,
    searchInput,
    setSearchInput
  }
}

export default useSearchInput
