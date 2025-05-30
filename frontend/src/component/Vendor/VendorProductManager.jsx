// VendorProductManager.js
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUserFriends,
  FaHamburger,
  FaPizzaSlice,
  FaHome,
  FaStar,
} from "react-icons/fa";
import { useVendor } from "../../store/vendorContext";
import toast from "react-hot-toast";
import { VendorProductCard } from "../ComponentsUtils/ProductCard";
import { motion } from "framer-motion";
import VendorOrderManager from "./VendorOrderManager";
import { MoveLeft, MoveRight } from "lucide-react";

// Header Component
const Header = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="dark:bg-zinc-800 bg-zinc-100 text-gray-600 dark:text-white shadow-md p-4 rounded-lg mb-4 font-['Gilroy'] ">
      <div className="flex items-center space-x-2">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-lg dark:bg-zinc-700 bg-zinc-200 text-gray-600 dark:text-white outline-none w-full"
        />
      </div>
    </header>
  );
};

// ProductForm Component
const ProductForm = ({ editingProduct, onCancel, currentvendor }) => {
  const { addProduct, updateProduct } = useVendor();
  const [IsImageALink, setIsImageALink] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    available: true,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleIsImageALink = () => setIsImageALink(!IsImageALink);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.productName,
        price: editingProduct.productPrice,
        description: editingProduct.productDescription,
        available: editingProduct.available,
        image: null,
      });
      setImagePreview(editingProduct.productImage || "");
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        available: true,
        image: null,
      });
      setImagePreview("");
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      if (IsImageALink) {
        setFormData((prev) => ({
          ...prev,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          image: files[0],
        }));
      }
      // Create preview URL
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!formData.price || isNaN(formData.price)) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!editingProduct && !formData.image) {
      toast.error("Product image is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Function to get file metadata and base64
    const processFile = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = {
            base64: reader.result,
            type: file.type,
            name: file.name,
            size: file.size,
            lastModified: file.lastModified,
          };
          resolve(fileData);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    };

    try {
      // If editing product
      if (editingProduct) {
        const updateData = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          available: formData.available,
        };

        if (IsImageALink) {
          if (formData.image) {
            updateData.image = formData.image;
          }
        } else {
          if (formData.image) {
            const fileData = await processFile(formData.image);
            updateData.image = {
              data: fileData.base64,
              metadata: {
                filename: fileData.name,
                contentType: fileData.type,
                size: fileData.size,
                lastModified: fileData.lastModified,
              },
            };
          }
        }

        await updateProduct(currentvendor, editingProduct._id, updateData);
      } else {
        // For new product
        if (!formData.image) {
          toast.error("Please select an image");
          return;
        }

        const fileData = "";
        if (!IsImageALink) {
          fileData = await processFile(formData.image);
        }
        const productData = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          available: formData.available,
          image: IsImageALink
            ? formData.image
            : {
                data: fileData.base64,
                metadata: {
                  filename: fileData.name,
                  contentType: fileData.type,
                  size: fileData.size,
                  lastModified: fileData.lastModified,
                },
              },
        };

        await addProduct(currentvendor, productData);
        setFormData({
          name: "",
          price: "",
          description: "",
          available: true,
          image: null,
        });
        setImagePreview("");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Failed to process product");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-zinc-800 shadow-md rounded-lg p-4 mb-6"
    >
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h2>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border dark:border-zinc-700 dark:bg-zinc-700 bg-zinc-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 resize-none rounded-lg border dark:border-zinc-700 dark:bg-zinc-700 bg-zinc-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Price
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border dark:border-zinc-700 dark:bg-zinc-700 bg-zinc-100"
            required
          />
        </div>

        <div className="overflow-hidden">
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Price
          </label>
          <div
            className={`rounded overflow-hidden dark:bg-zinc-800 text-gray-600 bg-zinc-200 dark:text-white flex items-center h=max ${
              IsImageALink ? "" : "p-[.4px]"
            }`}
          >
            <input
              type="text"
              name="image"
              value={formData.image}
              placeholder="https://example.com/image.png"
              onChange={handleChange}
              className={`rounded h-full dark:bg-zinc-700 text-gray-600 bg-zinc-200 dark:text-white outline-none transition-all duration-300 ease-linear ${
                IsImageALink ? "w-full  p-2" : "w-0 opacity-0 p-0"
              }`}
            />

            <div
              className="h-full px-3 py-2 flex items-center justify-center bg-blue-500 whitespace-nowrap cursor-pointer rounded-md"
              onClick={toggleIsImageALink}
            >
              <span className="flex items-center gap-2 ">
                {IsImageALink ? <MoveLeft /> : <MoveRight />}{" "}
                <span className="-mb-[5px]">{IsImageALink ? " Upload file" : "Upload Link "}</span>
              </span>
            </div>

            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className={`rounded dark:bg-zinc-700 text-gray-600 bg-zinc-200 dark:text-white outline-none ${
                IsImageALink ? "w-0" : "w-full p-2"
              }`}
            />
          </div>
        </div>

        {imagePreview && (
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Image Preview
            </label>
            <img
              src={imagePreview}
              alt="Preview"
              className="h-32 object-contain rounded-lg border dark:border-zinc-700"
            />
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label className="ml-2 text-sm dark:text-gray-300">Available</label>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
          >
            {isSubmitting
              ? "Processing..."
              : editingProduct
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

// ProductList Component
const ProductList = ({
  products,
  onEdit,
  onDelete,
  searchTerm,
  currentPage,
  itemsPerPage,
  onPageChange,
}) => {
  const filteredProducts =
    products?.filter((p) =>
      p.productName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-8 dark:text-gray-400">
        <p>No products found.</p>
        {searchTerm && <p>Try adjusting your search term.</p>}
      </div>
    );
  }

  return (
    <div className="my-6">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Your Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map((product) => (
          <VendorProductCard
            key={product._id}
            Edit={() => onEdit(product)}
            destroy={() => onDelete(product._id)}
            title={product.productName}
            price={product.productPrice}
            description={product.productDescription}
            imageUrl={product.productImage}
            available={product.available}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-zinc-700 dark:text-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Component
const VendorProductManager = ({ currentvendor, vendorProducts }) => {
  const { deleteProduct } = useVendor();
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Tab state
  const [activeTab, setActiveTab] = useState("shop");

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(currentvendor, id);
      toast.success("Product deleted successfully");
    }
  };

  const tabs = [
    { id: "shop", label: "Shop", icon: <FaHome className="mr-2" /> },
    { id: "orders", label: "Orders", icon: <FaHamburger className="mr-2" /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 ">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-t-lg mr-2 transition ${
                activeTab === tab.id
                  ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
              }`}
            >
              {tab.icon}
              <span className="-mb-2">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className=" rounded-lg ">
          {/* Shop Tab */}
          {activeTab === "shop" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ProductForm
                editingProduct={editingProduct}
                onCancel={() => setEditingProduct(null)}
                currentvendor={currentvendor}
              />
              <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <ProductList
                products={vendorProducts}
                onEdit={setEditingProduct}
                onDelete={handleDeleteProduct}
                searchTerm={searchTerm}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <VendorOrderManager vendorId={currentvendor} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProductManager;
