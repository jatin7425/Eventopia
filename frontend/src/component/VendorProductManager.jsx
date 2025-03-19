// VendorProductManager.js
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaHamburger,
  FaPizzaSlice,
  FaHome,
  FaStar,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useVendor } from "../store/vendorContext";
import toast from "react-hot-toast";
import { VendorProductCard } from "./ProductCard";
import LocomotiveScroll from 'locomotive-scroll';
import gsap from "gsap";

// Sidebar Component (reused)
const Sidebar = () => {
  return (
    <aside className="w-1/5 bg-[#222] text-white p-5 flex flex-col min-h-screen">
      <div className="text-center text-3xl font-bold text-red-500">🍜</div>
      <nav className="mt-10 space-y-4">
        <a href="#" className="flex items-center space-x-2 text-red-500 text-lg">
          <FaHamburger />
          <span>Dashboard</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-lg">
          <FaPizzaSlice />
          <span>Orders</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-lg">
          <FaHome />
          <span>Restaurants</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-lg mt-auto">
          <FiLogOut />
          <span>Logout</span>
        </a>
      </nav>
    </aside>
  );
};

// Header Component for product manager
const Header = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="dark:bg-zinc-700 text-gray-600 bg-zinc-100 dark:text-white shadow-md p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center space-x-2 flex-1">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent flex-1 outline-none pl-2 text-white"
        />
      </div>
    </header>
  );
};

// ProductForm Component for adding/editing products including image URL
const ProductForm = ({ editingProduct, onCancel, currentvendor }) => {
  const { addProduct, updateProduct } = useVendor();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    available: true,
    image: null, // Changed from imageUrl to image
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.productName,
        price: editingProduct.productPrice,
        description: editingProduct.productDescription,
        available: editingProduct.available,
        image: editingProduct.productImage ? new File([], editingProduct.productImage) : null,
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
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
      // Create preview URL
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({
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
            lastModified: file.lastModified
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
          available: formData.available
        };

        // If there's a new image, process it with metadata
        if (formData.image) {
          const fileData = await processFile(formData.image);
          updateData.image = {
            data: fileData.base64,
            metadata: {
              filename: fileData.name,
              contentType: fileData.type,
              size: fileData.size,
              lastModified: fileData.lastModified
            }
          };
        }

        console.log("Update data being sent:", {
          ...updateData,
          image: updateData.image ? "base64_data_exists" : "no_image"
        }); // Debug log without flooding console
        
        await updateProduct(currentvendor, editingProduct._id, updateData);
      } else {
        // For new product
        if (!formData.image) {
          toast.error("Please select an image");
          return;
        }

        const fileData = await processFile(formData.image);
        const productData = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          available: formData.available,
          image: {
            data: fileData.base64,
            metadata: {
              filename: fileData.name,
              contentType: fileData.type,
              size: fileData.size,
              lastModified: fileData.lastModified
            }
          }
        };

        console.log("New product data being sent:", {
          ...productData,
          image: "base64_data_exists"
        }); // Debug log without flooding console
        
        await addProduct(currentvendor, productData);
        setFormData({ name: "", price: "", description: "", available: true, image: null });
        setImagePreview("");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Failed to process product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="dark:bg-zinc-800 bg-white shadow-md p-4 rounded-lg mt-4">
      <h2 className="text-lg font-semibold mb-2 dark:text-white">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h2>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 rounded dark:bg-zinc-700 text-gray-600 bg-zinc-200 dark:text-white outline-none"
        />
        <textarea
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          cols={30}
          className="p-2 rounded resize-none dark:bg-zinc-700 text-gray-600 bg-zinc-200 dark:text-white outline-none"
        />
        <input
          type="text"
          name="price"
          placeholder="Price (e.g., ₹19.99)"
          value={formData.price}
          onChange={handleChange}
          className="p-2 rounded dark:bg-zinc-700 text-gray-600 bg-zinc-200 dark:text-white outline-none"
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          className="p-2 rounded dark:bg-zinc-700 text-gray-600 bg-zinc-200 dark:text-white outline-none"
        />
        <div className="flex flex-col gap-2">
          <label className="dark:text-white">{editingProduct ? "Don't upload new image, if you want to update the image, click on the update button" : ""}</label>
          <label className="dark:text-white">Product Image Preview:</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Product preview"
              className="w-32 h-32 object-cover rounded mt-2"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
            className="accent-red-500"
          />
          <label className="dark:text-white">Available</label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 dark:bg-blue-600 text-white p-2 rounded"
          >
            {editingProduct ? "Update" : "Add"} <FaPlus className="inline ml-1" />
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-red-500 text-white p-2 rounded"
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
    return Array(starRating).fill(null).map((_, index) => (
      <FaStar key={index} className="text-yellow-400" />
    ));
  };

  // console.log(product._id)

  const EditProduct = () => {
    onEdit(product)
  }


  const DeleteProduct = () => {
    onDelete(product._id)
  }


  return (
    <VendorProductCard Edit={EditProduct} Delete={DeleteProduct} title={product.productName} price={product.productPrice} description={product.productDescription} imageUrl={product.productImage} available={product.available} />
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
      <div className={`grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 place-items-center mt-4 z-0`}>
        {paginatedProducts?.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}

          />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`mx-1 mt-5 px-3 py-1 rounded ${currentPage === pageNum ? "bg-blue-500 dark:bg-blue-600 text-white" : "bg-gray-600"
                }`}
            >
              {pageNum}
            </button>
          )
        )}
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
      deleteProduct(currentvendor, id)
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

  return (
    <div className="flex  min-h-screen dark:text-white rounded-lg">
      {/* <Sidebar /> */}
      <main className="w-full overflow-y-auto">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {notification && (
          <div className="bg-green-500 dark:text-white p-2 rounded mt-4">
            {notification}
          </div>
        )}
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
      </main>
    </div>
  );
};

export default VendorProductManager;
