import React from "react";
import { TextField } from "@mui/material";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBarComponent: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return <TextField label="Search" variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ marginBottom: 2 }} />;
};

export default SearchBarComponent;
