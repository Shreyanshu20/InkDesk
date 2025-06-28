import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContent } from "./AppContent.jsx";

export const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const { backendUrl } = useContext(AppContent);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/categories/with-subcategories`
        );
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        setError("Failed to load categories");
        setCategories([
          {
            _id: "1",
            category_name: "Stationery",
            subcategories: [
              {
                _id: "1-1",
                subcategory_name: "Pens",
                link: "/shop/category/stationery/pens",
              },
              {
                _id: "1-2",
                subcategory_name: "Pencils",
                link: "/shop/category/stationery/pencils",
              },
              {
                _id: "1-3",
                subcategory_name: "Notebooks",
                link: "/shop/category/stationery/notebooks",
              },
              {
                _id: "1-4",
                subcategory_name: "Highlighters",
                link: "/shop/category/stationery/highlighters",
              },
              {
                _id: "1-5",
                subcategory_name: "Journals",
                link: "/shop/category/stationery/journals",
              },
              {
                _id: "1-6",
                subcategory_name: "To-Do Lists",
                link: "/shop/category/stationery/to-do-lists",
              },
              {
                _id: "1-7",
                subcategory_name: "Sticky Notes",
                link: "/shop/category/stationery/sticky-notes",
              },
              {
                _id: "1-8",
                subcategory_name: "Erasers",
                link: "/shop/category/stationery/erasers",
              },
              {
                _id: "1-9",
                subcategory_name: "Sharpeners",
                link: "/shop/category/stationery/sharpeners",
              },
            ],
          },
          {
            _id: "2",
            category_name: "Office Supplies",
            subcategories: [
              {
                _id: "2-1",
                subcategory_name: "Staplers and Pins",
                link: "/shop/category/office-supplies/staplers",
              },
              {
                _id: "2-2",
                subcategory_name: "Scissors and Paper Trimmers",
                link: "/shop/category/office-supplies/scissors",
              },
              {
                _id: "2-3",
                subcategory_name: "Calculators",
                link: "/shop/category/office-supplies/calculators",
              },
              {
                _id: "2-4",
                subcategory_name: "Folders and Filing",
                link: "/shop/category/office-supplies/folders",
              },
              {
                _id: "2-5",
                subcategory_name: "Organizers",
                link: "/shop/category/office-supplies/organizers",
              },
              {
                _id: "2-6",
                subcategory_name: "Magnifiers",
                link: "/shop/category/office-supplies/magnifiers",
              },
              {
                _id: "2-7",
                subcategory_name: "Cutters",
                link: "/shop/category/office-supplies/cutters",
              },
              {
                _id: "2-8",
                subcategory_name: "Paperclips and Rubber Bands",
                link: "/shop/category/office-supplies/paperclips",
              },
              {
                _id: "2-9",
                subcategory_name: "Whiteboards and Markers",
                link: "/shop/category/office-supplies/whiteboards",
              },
              {
                _id: "2-10",
                subcategory_name: "Punches",
                link: "/shop/category/office-supplies/punches",
              },
              {
                _id: "2-11",
                subcategory_name: "Glue and Adhesives",
                link: "/shop/category/office-supplies/glue",
              },
            ],
          },
          {
            _id: "3",
            category_name: "Art Supplies",
            subcategories: [
              {
                _id: "3-1",
                subcategory_name: "Paints",
                link: "/shop/category/art-supplies/paints",
              },
              {
                _id: "3-2",
                subcategory_name: "Art Pencils",
                link: "/shop/category/art-supplies/art-pencils",
              },
              {
                _id: "3-3",
                subcategory_name: "Crayons and Oil Pastels",
                link: "/shop/category/art-supplies/crayons",
              },
              {
                _id: "3-4",
                subcategory_name: "Markers and Pens",
                link: "/shop/category/art-supplies/markers",
              },
              {
                _id: "3-5",
                subcategory_name: "Paint Brushes and Palette Knives",
                link: "/shop/category/art-supplies/brushes",
              },
              {
                _id: "3-6",
                subcategory_name: "Artist Sketch Pads and Sheets",
                link: "/shop/category/art-supplies/sketch-pads",
              },
              {
                _id: "3-7",
                subcategory_name: "Drawing Books",
                link: "/shop/category/art-supplies/drawing-books",
              },
            ],
          },
          {
            _id: "4",
            category_name: "Craft Materials",
            subcategories: [
              {
                _id: "4-1",
                subcategory_name: "Masking and Decoration Tapes",
                link: "/shop/category/craft-materials/tapes",
              },
              {
                _id: "4-2",
                subcategory_name: "Craft Glue and Adhesives",
                link: "/shop/category/craft-materials/glue",
              },
              {
                _id: "4-3",
                subcategory_name: "Stickers",
                link: "/shop/category/craft-materials/stickers",
              },
              {
                _id: "4-4",
                subcategory_name: "Stamps and Pads",
                link: "/shop/category/craft-materials/stamps",
              },
              {
                _id: "4-5",
                subcategory_name: "Craft Paper",
                link: "/shop/category/craft-materials/paper",
              },
              {
                _id: "4-6",
                subcategory_name: "Beads and Jewelry Making",
                link: "/shop/category/craft-materials/beads",
              },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [backendUrl]);

  return (
    <CategoryContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoryContext);
}
