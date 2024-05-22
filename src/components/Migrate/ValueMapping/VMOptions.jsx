import { Autocomplete, TextField } from "@mui/material";

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    title: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  {
    title: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
];

const VMOptions = () => {
  return (
    <div className="w-full">
      <label className="block mb-1 text-sm">Select Value Mapping</label>
      <Autocomplete
        multiple
        limitTags={2}
        fullWidth
        size="small"
        options={top100Films}
        getOptionLabel={(option) => option?.title}
        renderInput={(params) => (
          <TextField {...params} placeholder="Add Options" />
        )}
        sx={{
          "& .MuiInputBase-input": {
            height: "1.8em",
            padding: "6px 12px",
            fontSize: 14,
            maxWidth: 'calc(100% - 40px)', // Adjusting the max width of the input
          },
        }}
      />
    </div>

    
  );
};

export default VMOptions;
