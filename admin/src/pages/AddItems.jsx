import React, { useState } from "react";
import { baseUri } from "../config/config.js";
const AddItems = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    ingredients: [],
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [newIngredient, setNewIngredient] = useState("");

  // Add ingredient to the list
  const handleAddIngredient = () => {
    if (newIngredient.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()],
      }));
      setNewIngredient("");
    }
  };
  // Remove ingredient
  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!formData.image) {
      setError("Please select an image");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category.toLowerCase());
      formDataToSend.append("image", formData.image);

      // Append ingredients as separate fields
      formData.ingredients.forEach((ingredient) => {
        formDataToSend.append("ingredients[]", ingredient);
      });
      const response = await baseUri.post("/api/menu", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          ingredients: [],
          image: null,
        });
      }
      document.getElementById("imageInput").value = "";
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  return (
    <div className="animate-fadeIn rounded-lg max-w-2xl ms-6 mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-[#340036]">
        Add New Item
      </h2>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Item added successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            placeholder="Enter item name"
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            rows="3"
            placeholder="Item description"
            required
          />
        </div>

        {/* Price and Category Inputs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              placeholder="$0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select category</option>
              <option value="pizza">Pizza</option>
              <option value="pasta">Pasta</option>
              <option value="burger">Burger</option>
              <option value="drinks">Drinks</option>
            </select>
          </div>
        </div>

        {/* Image Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            accept="image/*"
            id="imageInput"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingredients
          </label>
          <input
            type="text"
            name="ingredients"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            placeholder="Add ingredient"
            required
          />
          <button type="button" onClick={handleAddIngredient}>
            Add
          </button>
          {/* Display Ingredients */}
          <ul>
            {formData.ingredients.map((ingredient, index) => (
              <li key={index} className="flex justify-between">
                {ingredient}{" "}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 transform disabled:opacity-50"
        >
          {loading ? "Adding Item..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItems;
