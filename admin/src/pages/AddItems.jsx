import React, { useState, useRef } from "react";
import { baseUri } from "../config/config.js";
import { PlusCircle, X, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AddItems = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    ingredients: [],
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
  const [newIngredientPrice, setNewIngredientPrice] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Add ingredient to the list
  const handleAddIngredient = () => {
    if (newIngredient.trim() !== "" && newIngredientPrice.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        ingredients: [
          ...prev.ingredients,
          {
            name: newIngredient.trim(),
            price: parseFloat(newIngredientPrice) || 0,
          },
        ],
      }));
      setNewIngredient("");
      setNewIngredientPrice("");
    }
  };

  // Remove ingredient
  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const imageInputRef = useRef(null);

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
      formDataToSend.append("discount", formData.discount);
      formDataToSend.append("category", formData.category.toLowerCase());
      formDataToSend.append("image", formData.image);

      formDataToSend.append(
        "ingredients",
        JSON.stringify(formData.ingredients)
      );

      const response = await baseUri.post("/api/menu", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          name: "",
          description: "",
          price: "",
          discount: "",
          category: "",
          ingredients: [],
          image: null,
        });
        setImagePreview(null);
      }
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
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
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add Menu Item</h1>
          <p className="text-gray-500 mt-1">
            Create a new item for your restaurant menu
          </p>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Item has been added successfully to your menu.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>
                Fill in the information about the new menu item
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="name"
                  >
                    Item Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter item name"
                    required
                  />
                </div>
                <div className="space-y-2 flex justify-between gap-2">
                  <div className="w-full">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="price"
                    >
                      Price (€)
                    </label>
                    <Input
                      id="price"
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="discount"
                    >
                      Discount (%)
                    </label>
                    <Input
                      id="discount"
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                {formData.price && formData.discount && (
                  <p className="text-sm text-green-600">
                    Discounted Price: €
                    {(
                      formData.price -
                      (formData.price * formData.discount) / 100
                    ).toFixed(2)}{" "}
                    ({formData.discount}% OFF)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="category"
                >
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pizze rosse">Pizze rosse</SelectItem>
                    <SelectItem value="pizze bianche">Pizze bianche</SelectItem>
                    <SelectItem value="fritti">Fritti</SelectItem>
                    <SelectItem value="dolci">Dolci</SelectItem>
                    <SelectItem value="bibite">Bibite</SelectItem>
                    <SelectItem value="birre">Birre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="description"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the menu item"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Ingredients
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Ingredient name"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={newIngredientPrice}
                    onChange={(e) => setNewIngredientPrice(e.target.value)}
                    placeholder="Price"
                    min="0"
                    step="0.01"
                    className="flex-1 border-s-0"
                  />
                  <Button
                    type="button"
                    onClick={handleAddIngredient}
                    variant="outline"
                    size="icon"
                    disabled={!newIngredient || !newIngredientPrice}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>

                {formData.ingredients.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm"
                      >
                        <div className="flex-1">{ingredient.name}</div>
                        <div className="flex-1 text-right">
                          ${ingredient.price.toFixed(2)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Item Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="mx-auto h-40 object-contain"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, image: null }));
                          document.getElementById("imageInput").value = "";
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <Upload className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="text-gray-600">
                        <p className="font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs">
                          SVG, PNG, JPG or GIF (max. 2MB)
                        </p>
                      </div>
                      <Input
                        id="imageInput"
                        type="file"
                        ref={imageInputRef} // Attach the ref
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("imageInput").click()
                        }
                      >
                        Select Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    name: "",
                    description: "",
                    price: "",
                    discount: "",
                    category: "",
                    ingredients: [],
                    image: null,
                  });
                  setImagePreview(null);
                  document.getElementById("imageInput").value = "";
                }}
              >
                Reset
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding Item..." : "Add Item"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddItems;
