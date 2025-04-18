import { Dialog } from "@headlessui/react";
import axios from "axios";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function OrderModal({
  isOpen,
  closeModal,
  totalPrice,
  cartItems,
  onOrderSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    city: "",
    zipCode: "",
    customizations: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        phoneNumber: "",
        street: "",
        city: "",
        zipCode: "",
        customizations: "",
      });
      setFormErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^(?:\+39)?\s?(?:0\d{1,4}|3\d{2})\s?\d{5,8}$/;
    const zipRegex = [
      40122, 40123, 40124, 40125, 40126, 40127, 40128, 40129, 40132, 40133,
      40134, 40135, 40136, 40137,
    ];

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number";
    }
    if (!formData.street.trim()) errors.street = "Street address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!zipRegex.includes(Number(formData.zipCode)))
      errors.zipCode = "Invalid ZIP code";
    console.log(zipRegex.includes(Number(formData.zipCode)));
    console.log(formData.zipCode);

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!cartItems?.length) {
      toast.error("Your cart is empty!", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedItems = cartItems.map((item) => ({
        menuItem: item._id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
        selectedIngredients: item.selectedIngredients?.map((ing) => ing) || [],
      }));

      const orderData = {
        items: formattedItems,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        customizations: formData.customizations || "",
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        total: totalPrice,
      };

      const response = await axios.post(
        "https://pizzeria-backend-production.up.railway.app/api/payments/pay-for-order",
        orderData
      );

      if (response.status === 200) {
        window.open(response.data.approvalUrl, "_self");
      }

      // Call the success handler from parent
      onOrderSuccess(response.data);
      closeModal();
    } catch (error) {
      console.error("Order error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to process order", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCashSubmit = async () => {
    if (!validateForm()) return;
    if (!cartItems?.length) {
      toast.error("Your cart is empty!", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedItems = cartItems.map((item) => ({
        menuItem: item._id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
        selectedIngredients: item.selectedIngredients?.map((ing) => ing) || [],
      }));

      const orderData = {
        items: formattedItems,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        customizations: formData.customizations || "",
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        total: totalPrice,
      };

      const response = await axios.post(
        "https://pizzeria-backend-production.up.railway.app/api/orders",
        orderData
      );

      setIsSubmitting(false);
      toast.success("🎉 Ordine effettuato! Lo stiamo preparando per te.", {
        position: "top-center",
      });

      // Call the success handler from parent
      onOrderSuccess(response.data);
      closeModal();
    } catch (error) {
      console.error("Order error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to process order", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative mx-4">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 p-2 text-gray-600 hover:text-gray-900 cursor-pointer"
          disabled={isSubmitting}
        >
          <X size={22} />
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
          Place Your Order
        </h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-1/2">
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-400`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number *"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-400`}
              />
              {formErrors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          <div>
            <input
              type="text"
              name="street"
              placeholder="Street Address *"
              value={formData.street}
              onChange={handleChange}
              className={`w-full p-3 border ${
                formErrors.street ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-400`}
            />
            {formErrors.street && (
              <p className="text-red-500 text-sm mt-1">{formErrors.street}</p>
            )}
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <input
                type="text"
                name="city"
                placeholder="City *"
                value={formData.city}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  formErrors.city ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-400`}
              />
              {formErrors.city && (
                <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code *"
                value={formData.zipCode}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  formErrors.zipCode ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-400`}
              />
              {formErrors.zipCode && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.zipCode}
                </p>
              )}
            </div>
          </div>

          <textarea
            name="customizations"
            placeholder="Special Instructions (optional)"
            value={formData.customizations}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            rows="3"
          />
        </div>
        <div className="mt-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Total:{" "}
            <span className="text-green-600">€{totalPrice.toFixed(2)}</span>
          </h3>
        </div>{" "}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={closeModal}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCashSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {isSubmitting ? "Processing..." : "Paga in contanti"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {isSubmitting ? "Processing..." : "Paga con la carta"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default OrderModal;
