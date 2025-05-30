// VendorProductManager.js
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaHamburger,
  FaHome,
} from "react-icons/fa";
import { useVendor } from "../../store/vendorContext";
import toast from "react-hot-toast";
import { VendorProductCard } from "../ComponentsUtils/ProductCard";
import { motion } from "framer-motion";
import VendorOrderManager from "./VendorOrderManager";
import { SquarePen } from "lucide-react";

// Header Component for product manager
const Header = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="dark:bg-zinc-700 text-gray-600 bg-zinc-100 dark:text-white shadow-md p-4 rounded-lg flex items-center justify-between font-['Gilroy']">
      <div className="flex items-center space-x-2 flex-1">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded dark:bg-zinc-700 text-gray-600 bg-zinc-200 dark:text-white outline-none w-full"
        />
      </div>
    </header>
  );
};

// ProductForm Component for adding/editing products including image URL
const ProductForm = ({ editingProduct, onCancel, currentvendor }) => {
  const { addProduct, updateProduct } = useVendor();
  const [IsImageALink, setIsImageALink] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    available: true,
    image: null, // Changed from imageUrl to image
  });
  const [imagePreview, setImagePreview] = useState("");

  const toggleIsImageALink = () => setIsImageALink(!IsImageALink)

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.productName,
        price: editingProduct.productPrice,
        description: editingProduct.productDescription,
        available: editingProduct.available,
        image: editingProduct.productImage
          ? new File([], editingProduct.productImage)
          : null,
      });
      setImagePreview(editingProduct.productImage || "");
    } else {
      setFormData({ name: "", price: "", available: true, image: null });
      setImagePreview("");
    }
  }, [editingProduct]);

  // Handle text, checkbox changes
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
            updateData.image = formData.image
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

        const fileData = ''
        if (!IsImageALink) {
          fileData = await processFile(formData.image);
        }
        const productData = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          available: formData.available,
          image: IsImageALink ? formData.image : {
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

const [formOpen, setFormOpen] = useState(false)

const handleFormOpen = ()=>{
  setFormOpen(!formOpen)
}

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-zinc-800 shadow-md rounded-lg p-4 mb-6"
    >
      <h2 className="text-xl font-bold mb-4 dark:text-white cursor-pointer" onClick={handleFormOpen}>
        {editingProduct ? "Edit Product" : "Add New Product"}
        <SquarePen className="" />
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
            className="w-full p-2 rounded-lg border dark:border-zinc-700 dark:bg-zinc-700 bg-zinc-100"
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

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            {editingProduct ? "Update Image (optional)" : "Product Image"}
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="w-full p-2 rounded-lg border dark:border-zinc-700 dark:bg-zinc-700 bg-zinc-100"
            required={!editingProduct}
          />
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

// ProductItem Component for each product in the list with image preview
const ProductItem = ({ product, onEdit, onDelete }) => {
  const starRating = Math.floor(product?.averageRating) || 0;

  const starRatingArrayRender = () => {
    return Array(starRating)
      .fill(null)
      .map((_, index) => <FaStar key={index} className="text-yellow-400" />);
  };

  // console.log(product._id)

  const EditProduct = () => {
    onEdit(product);
  };

  const DeleteProduct = () => {
    onDelete(product._id);
  };

  return (
    <VendorProductCard
      Edit={EditProduct}
      destroy={DeleteProduct}
      title={product.productName}
      price={product.productPrice}
      description={product.productDescription}
      imageUrl={product.productImage}
      available={product.available}
    />
  );
};

// ProductList Component with basic pagination
const ProductList = ({
  products,
  onEdit,
  onDelete,
  searchTerm,
  currentPage,
  itemsPerPage,
  onPageChange,
}) => {
  // console.log(products)

  const filteredProducts = products?.filter((p) =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);
  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (filteredProducts?.length === 0) {
    return <p className="dark:text-gray-400 mt-4">No products found.</p>;
  }

  return (
    <>
      <div
        className={`grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 place-items-center mt-4 z-0`}
      >
        {paginatedProducts?.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Page Num */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`mx-1 mt-5 px-3 py-1 rounded ${currentPage === pageNum
              ? "bg-blue-500 dark:bg-blue-600 text-white"
              : "bg-gray-600"
              }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </>
  );
};

// Main VendorProductManager Component for CRUD operations
const VendorProductManager = ({ currentvendor, vendorProducts }) => {
  const { deleteProduct } = useVendor();
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // console.log(currentvendor)

  const handleDeleteProduct = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      deleteProduct(currentvendor, id);
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const [shop, setShop] = useState(true);
  const [manageOrder, setManageOrder] = useState(false);
  const [colaborators, setColaborators] = useState(false);

  const handleShop = () => {
    setShop(true);
    setManageOrder(false);
    setColaborators(false);
  };

  const handleManageOrder = () => {
    setShop(false);
    setManageOrder(true);
    setColaborators(false);
  };

  const handleColaborators = () => {
    setColaborators(true);
    setShop(false);
    setManageOrder(false);
  }

  return (
    <div className="flex  min-h-screen dark:text-white rounded-lg">
      {/* <Sidebar /> */}
      <main className="w-full overflow-y-auto">
        <div className="relative flex items-center gap-1 py- bg-transparent rounded-lg max-sm:mt-8 mb-3 font-['Gilroy'] font-bold ">
          {/* Shop Button  */}
          <button
            className={`relative px-4 py-2 rounded-md ${shop
              ? "text-white bg-blue-500 shadow-md"
              : "text-gray-500 dark:text-gray-400 bg-transparent"
              } transition-all duration-300`}
            onClick={handleShop}
          >
            {shop ? (
              <motion.span
                className="absolute inset-0 bg-blue-500 rounded-md z-0"
                layoutId="activeTab"
                initial={false}
                transition={{ stiffness: 500, damping: 30 }}
              />
            ) : null}
            <span className="relative "> Shop</span>
          </button>

          {/* Manage Orders Button */}
          <button
            className={`relative px-4 py-2 rounded-md ${manageOrder
              ? "text-white bg-blue-500 shadow-md"
              : "text-gray-500 dark:text-gray-400 bg-transparent"
              } transition-all duration-300`}
            onClick={handleManageOrder}
          >
            {manageOrder ? (
              <motion.span
                className="absolute inset-0 bg-blue-500 rounded-md z-0"
                layoutId="activeTab"
                initial={false}
                transition={{ stiffness: 500, damping: 30 }}
              />
            ) : null}
            <span className="relative ">Manage Orders</span>
          </button>
        </div>

        {notification && (
          <div className="bg-green-500 dark:text-white p-2 rounded mt-4">
            {notification}
          </div>
        )}

        {/* Header with Search */}
        <span className={`${manageOrder ? "hidden" : ""}`}>
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </span>

        {/* Product Form and List */}
        {shop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full h-fit"
          >
            <div className="h-full max-md:flex-col-reverse items-center justify-between gap-5 md:px-0 px-0 pb-10 font-['Gilroy']">
              <ProductForm
                currentvendor={currentvendor}
                editingProduct={editingProduct}
                onCancel={handleCancelEdit}
              />
              <h2 className="text-2xl font-bold mt-6">Product List</h2>
              <ProductList
                products={vendorProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                searchTerm={searchTerm}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </motion.div>
        )}

        {/* Order Management Section */}
        {manageOrder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="dark:bg-zinc-800 bg-white shadow-md p-4 rounded-lg mt-4 font-['Gilroy']"
          >
            <VendorOrderManager vendorId={currentvendor} />
          </motion.div>
        )}

        {/* Colaborators Section */}
        {colaborators && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="dark:bg-zinc-800 bg-white shadow-md p-4 rounded-lg mt-4 font-['Gilroy']"
          >
            <VendorColaborator />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default VendorProductManager;
