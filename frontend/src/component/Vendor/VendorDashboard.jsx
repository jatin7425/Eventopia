import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { useVendor } from "../../store/vendorContext";
import { BASE_URL } from "../../config/urls";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import VendorProductManager from "./VendorProductManager";
import { axiosInstance } from "../../lib/axios";
import { FaEdit, FaPlus, FaTimes, FaTimesCircle } from "react-icons/fa";
import vendorDefaultBanner from "../../assets/vendorDefaultBanner.jpg";
import vendorDefaultLogo from "../../assets/vendorDefaultLogo.jpg";
import { motion, AnimatePresence } from "framer-motion";

export default function VendorDashboard() {
  const { user } = useAuth();
  const { vendorId } = useParams();
  const { addVendor, updateVendor, deleteVendor, fetchVendorProducts } =
    useVendor();

  const [vendorList, setVendorList] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [openVendorList, setOpenVendorList] = useState(false);
  const [openAddVendorForm, setOpenAddVendorForm] = useState(false);
  const [openBannerForm, setOpenBannerForm] = useState(false);
  const [hoveringOnBanner, setHoveringOnBanner] = useState(false);

  // Fetch vendor data
  useEffect(() => {
    const fetchVendorById = async (vendorId) => {
      try {
        const res = await axiosInstance.get(
          `/vendor/getVendorById/${vendorId}`
        );
        setVendorList((prev) => [...prev, res?.data]);
      } catch (error) {
        // console.error("Error fetching vendor", error);
        // toast.error("Failed to fetch vendor");
      }
    };

    if (user?.vendorOwnerShip?.length > 0) {
      user.vendorOwnerShip.forEach((vendorId) => {
        fetchVendorById(vendorId);
      });
    }
  }, [user]);

  // Set current vendor
  useEffect(() => {
    if (vendorList.length > 0) {
      if (vendorId) {
        const foundVendor = vendorList.find((v) => v.data._id === vendorId);
        if (foundVendor) {
          setVendor(foundVendor.data);
          setCurrentVendor(vendorId);
        }
      } else {
        setVendor(vendorList[0]?.data);
        setCurrentVendor(vendorList[0]?.data?._id);
      }
    }
  }, [vendorList, vendorId]);

  // No vendors case
  if (user?.vendorOwnerShip?.length === 0) {
    return (
      <div className="min-h-screen w-full dark:bg-[#1a1a1a] flex items-center justify-center p-6">
        <AnimatePresence>
          {openAddVendorForm && (
            <AddVendorForm onClose={() => setOpenAddVendorForm(false)} />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-5 items-center text-center max-w-md"
        >
          <h1 className="text-3xl font-bold">
            It seems like you don't have any shops yet
          </h1>
          <p className="text-gray-400">
            Start selling your products and services online by creating a shop.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenAddVendorForm(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Create Your First Shop
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen dark:bg-[#1a1a1a] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full dark:bg-[#1a1a1a] text-gray-600 bg-white dark:text-white">
      <AnimatePresence>
        {openAddVendorForm && (
          <AddVendorForm onClose={() => setOpenAddVendorForm(false)} />
        )}
        {openBannerForm && (
          <BannerForm
            vendorId={vendor?._id}
            onClose={() => setOpenBannerForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 w-full bg-white dark:bg-zinc-800 px-6 py-4 z-10 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold capitalize">
              {vendor?.ShopName}'s Dashboard
            </h1>
            <p className="dark:text-gray-400 text-gray-500">
              Manage your shop, products, and services
            </p>
          </div>

          <motion.div className="relative">
            <button
              onClick={() => setOpenVendorList(!openVendorList)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
            >
              <FaPlus
                className={`transition-transform ${
                  openVendorList ? "rotate-45" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openVendorList && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-800 rounded-lg shadow-lg z-20 border border-gray-200 dark:border-zinc-700"
                >
                  <VendorList
                    vendors={vendorList}
                    currentVendor={currentVendor}
                    onSelect={(vendor) => {
                      setVendor(vendor.data);
                      setCurrentVendor(vendor.data._id);
                      setOpenVendorList(false);
                    }}
                    onCreateNew={() => {
                      setOpenVendorList(false);
                      setOpenAddVendorForm(true);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="relative ">
        <motion.div
          onMouseEnter={() => setHoveringOnBanner(true)}
          onMouseLeave={() => setHoveringOnBanner(false)}
          className="relative"
        >
          <img
            src={
              vendor?.ShopBanner
                ? `${BASE_URL}${vendor?.ShopBanner}`
                : vendorDefaultBanner
            }
            alt="Shop Banner"
            className="w-full h-64 object-cover"
            loading="lazy"
          />

          <AnimatePresence>
            {hoveringOnBanner && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOpenBannerForm(true)}
                  className="flex items-center gap-2 text-white bg-white/30 px-4 py-2 rounded-lg"
                >
                  <FaEdit /> <span className="-mb-2">Edit Banner</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Shop Info */}
        <motion.div
          className="p-4 dark:bg-zinc-800 bg-white "
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p>
            <strong>Email:</strong> {vendor?.ShopEmail}
          </p>
          <p>
            <strong>Phone:</strong> {vendor?.ShopPhone}
          </p>
          <p>
            <strong>Description:</strong> {vendor?.ShopDescription}
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <VendorProductManager
          currentvendor={currentVendor}
          vendorProducts={vendor?.Products}
        />
      </div>
    </div>
  );
}

// Vendor List Component
const VendorList = ({ vendors, currentVendor, onSelect, onCreateNew }) => {
  
  const uniqueVendors = vendors.filter(
    (vendor, index, self) =>
      index === self.findIndex((v) => v.data._id === vendor.data._id)
  );

  return (
    <div className="py-2">
      <button
        onClick={onCreateNew}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center gap-2"
      >
        <FaPlus /> <span className="-mb-[5px]">Create New Shop</span>
      </button>

      <div className="max-h-64 overflow-y-auto">
        {uniqueVendors.map((vendor) => (
          <button
            key={vendor.data._id}
            onClick={() => onSelect(vendor)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center ${
              currentVendor === vendor.data._id
                ? "bg-blue-100 dark:bg-blue-900"
                : ""
            }`}
          >
            {vendor.data.ShopName}
          </button>
        ))}
      </div>
    </div>
  );
};

// Add Vendor Form Component
const AddVendorForm = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [shopCategory, setShopCategory] = useState("");
  const [formData, setFormData] = useState({
    ShopName: "",
    ShopPhone: "",
    ShopEmail: "",
    ShopAddress: "",
    ShopDescription: "",
    ShopLocation: "",
    ShopLogo: null,
  });

  const { addVendor } = useVendor();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVendor({ formData, shopCategory });
      toast.success("Shop created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to create shop");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative bg-white dark:bg-zinc-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
        >
          <FaTimes />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create New Shop
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block mb-1">Shop Name</label>
                  <input
                    name="ShopName"
                    value={formData.ShopName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-zinc-700"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Phone</label>
                  <input
                    name="ShopPhone"
                    value={formData.ShopPhone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-zinc-700"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    name="ShopEmail"
                    type="email"
                    value={formData.ShopEmail}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-zinc-700"
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block mb-1">Address</label>
                  <input
                    name="ShopAddress"
                    value={formData.ShopAddress}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-zinc-700"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Description</label>
                  <textarea
                    name="ShopDescription"
                    value={formData.ShopDescription}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-zinc-700"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-1">Location</label>
                  <input
                    name="ShopLocation"
                    value={formData.ShopLocation}
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-zinc-700"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block mb-1">Category</label>
                  <select
                    value={shopCategory}
                    onChange={(e) => setShopCategory(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-zinc-700"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="bakery">Bakery</option>
                    <option value="food">Food</option>
                    <option value="decoration">Decoration</option>
                    <option value="hotel">Hotel</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Logo</label>
                  <input
                    type="file"
                    name="ShopLogo"
                    onChange={handleChange}
                    className="w-full p-2 border rounded dark:bg-zinc-700"
                  />
                  {formData.ShopLogo && (
                    <img
                      src={URL.createObjectURL(formData.ShopLogo)}
                      alt="Preview"
                      className="mt-2 h-24 w-24 rounded-full object-cover"
                    />
                  )}
                </div>
              </motion.div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <motion.button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 rounded"
                >
                  Back
                </motion.button>
              )}

              {step < 3 ? (
                <motion.button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded ml-auto"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded ml-auto"
                >
                  Create Shop
                </motion.button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Banner Form Component
const BannerForm = ({ vendorId, onClose }) => {
  const [bannerFile, setBannerFile] = useState(null);
  const { addBannerToVendor } = useVendor();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bannerFile) {
      toast.error("Please select a banner image");
      return;
    }

    const formData = new FormData();
    formData.append("ShopBanner", bannerFile);

    try {
      await addBannerToVendor(vendorId, formData);
      toast.success("Banner updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update banner");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative bg-white dark:bg-zinc-800 rounded-xl shadow-xl max-w-md w-full"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
        >
          <FaTimes />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Update Banner</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Select Banner Image</label>
              <input
                type="file"
                onChange={(e) => setBannerFile(e.target.files[0])}
                className="w-full p-2 border rounded dark:bg-zinc-700"
                accept="image/*"
              />
            </div>

            {bannerFile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <label className="block mb-2">Preview</label>
                <img
                  src={URL.createObjectURL(bannerFile)}
                  alt="Banner Preview"
                  className="w-full h-40 object-cover rounded"
                />
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 bg-blue-600 text-white rounded mt-4"
            >
              Update Banner
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};
