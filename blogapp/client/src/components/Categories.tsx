import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Category } from "../definitions";
import { useSearchParams } from "react-router-dom";

const categories = Object.values(Category);

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category")?.toLowerCase() || Category.All.toLowerCase();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ category: newValue.toLowerCase() });
  };

  return (
    <div className="sticky top-16 md:top-[4.7rem] bg-white z-10 shadow-sm">
      <Tabs
        value={category}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
        variant="scrollable"
        scrollButtons="auto"
        className="bg-white"
      >
        {categories.map((cat) => (
          <Tab
            value={cat.toLowerCase()}
            label={cat === Category.All ? "For You" : cat}
            key={cat}
            disableRipple
            className="!text-xs md:!text-[0.9rem] !capitalize"
            onClick={() => {
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 500);
            }}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default Categories;
