import React from "react";
import { Category } from "../definitions";
import { BiSolidCategoryAlt } from "react-icons/bi";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

type MultiSelectProps = {
  value: string[];
  onChange: (selectedOptions: string[]) => void;
  placeholder: string;
};

const MultiSelect: React.FC<MultiSelectProps> = ({ value, onChange, placeholder }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Create a new array of capitalized options
  const options = Object.values(Category)
    .map((option) => option.charAt(0).toUpperCase() + option.slice(1))
    .filter((option) => option !== Category.All);

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: string[]) => {
    onChange(newValue);
  };

  return (
    <div>
      {/* Button to open the modal */}
      <button
        className="w-full font-medium text-highlight text-sm border border-highlight py-2 rounded-lg flex items-center justify-center gap-2"
        onClick={() => setIsModalOpen(true)}
      >
        Add Categories Tags
        <BiSolidCategoryAlt className="inline text-highlight" />
      </button>

      {/* Modal for selecting categories */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="outline-none"
      >
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
          }}
          className="w-3/5 flex flex-col gap-2 rounded-lg"
        >
          <h2 className="text-lg text-gray-600 italic">
            Search / Add Category Tags
          </h2>
          <Autocomplete
            multiple
            freeSolo
            options={options}
            value={value}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder={placeholder}
                className="capitalize"
                color="secondary"
                inputProps={{
                  ...params.inputProps,
                  maxLength: 30,
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  variant="outlined"
                  {...getTagProps({ index })}
                  className="capitalize !m-1"
                />
              ))
            }
          />
          {/* Button to close the modal */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 font-medium text-highlight text-sm border border-highlight rounded-lg hover:bg-highlight hover:text-white transition duration-150"
          >
            Done
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default MultiSelect;
