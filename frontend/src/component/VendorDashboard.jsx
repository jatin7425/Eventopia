import { Link, useParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import { useVendor } from "../store/vendorContext";
import { BASE_URL } from '../config/urls';
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import VendorProductManager from "./VendorProductManager";
import { axiosInstance } from "../lib/axios";
import { FaEdit, FaPlus, FaTimes, FaTimesCircle } from "react-icons/fa";
import vendorDefaultBanner from "../assets/vendorDefaultBanner.jpg"
import vendorDefaultLogo from "../assets/vendorDefaultLogo.jpg"
import gsap from 'gsap';



export default function VendorDashboard() {


  const {
    addVendor,
    updateVendor,
    deleteVendor,
    isVendorLoading,
    setIsVendorLoading,
  } = useVendor();
  const { user } = useAuth();
  const { vendorId } = useParams();

  // console.log(Productdeleted, ProductAdded, productUpdated)

  const [list, setList] = useState([])

  // Fetch a single vendor by ID

  const [vendorList, setVendorList] = useState([])

  const fetchVendorById = async (vendorId) => {
    setIsVendorLoading(true);
    try {
      const res = await axiosInstance.get(`/vendor/getVendorById/${vendorId}`);
      // console.log(res?.data?.Products)
      setVendorList(prev => [...prev, res?.data])
    } catch (error) {


      console.error("Error fetching vendor", error);
      toast.error("Failed to fetch vendor");
    } finally {
      setIsVendorLoading(false);
    }
  };

  useEffect(() => {
    user?.vendorOwnerShip.forEach(async (vendorId) => {
      await fetchVendorById(vendorId);
    })
  }, [user]);

  const [vendor, setVendor] = useState()
  const [currentVendor, setCurrentVendor] = useState()

  useEffect(() => {
    if (vendorId) {
      const vendor = vendorList.find(vendor => vendor.data._id === vendorId)
      if (vendor) {
        setVendor(vendor.data)
        setCurrentVendor(vendorId)
      } else {
        setVendor(vendorList[0]?.data)
        setCurrentVendor(vendorList[0]?.data?._id)
      }
    } else {
      setVendor(vendorList[0]?.data)
      setCurrentVendor(vendorList[0]?.data?._id)
    }
    // console.log(vendor)
  }, [vendorList])



  const [OpenAddVenderForm, setOpenAddVenderForm] = useState(false);
  const handleOpenAddVenderForm = () => setOpenAddVenderForm(!OpenAddVenderForm);

  // console.log(user)

  if (user?.vendorOwnerShip?.length == 0) {
    return (
      <div className="min-h-screen relative w-full dark:bg-[#1a1a1a] flex items-center justify-center dark:text-white p-6">
        {OpenAddVenderForm && <AddVendorForm />}
        <div className="flex flex-col gap-5 items-center justify-center">
          <h1 className="text-3xl font-bold text-center">
            It's seems like you don't have any shop online for service, sell
            your services and products online, help people to manage their
            events.
          </h1>
          <p className="text-gray-400 text-center">
            You haven't joined any vendors yet. Please join some to manage your
            shop.
          </p>
          <button
            onClick={handleOpenAddVenderForm}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-max"
          >
            Join a Vendor
          </button>
        </div>
      </div>
    );
  }

  // console.log(user?.vendorOwnerShip)

  const [openVenderList, setOpenVenderList] = useState(false)
  const handleOpenVenderList = () => setOpenVenderList(!openVenderList)


  const RenderVenderList = () => {
    const listRef = useRef([]);
    const vendorRefs = useRef([]);

    // console.log(vendorList)

    vendorList.forEach(vendors => {

      if (!listRef.current.some(v => v.data._id === vendors.data._id)) {
        listRef.current.push(vendors)
      }
    })
    useEffect(() => {
      // Animate each h1 element with a delay of 100ms
      vendorRefs.current.forEach((ref, index) => {
        gsap.fromTo(ref, { opacity: 0 }, { opacity: 1, delay: index * 0.15 });
      });
    }, [listRef.current]);

    return (
      <div
        onClick={handleOpenAddVenderForm}
        className="h-[280px] flex flex-col gap-4 relative pl-2 "
      >
        <div className="py-1 px-3">
          <h1
            className={`text-lg cursor-pointer text-white hover:text-blue-500 rounded `}
          >
            Create new Shop
          </h1>
        </div>
        {listRef.current?.map((vendor, index) => (
          <div className="h-fit w-full relative flex items-center justify-start  ">
            <Link
              to={`/user/myVendors/${vendor?.data?._id}`}
              ref={(el) => (vendorRefs.current[index] = el)}
              key={vendor?.data?._id || index} // Use unique ID if available
              onClick={() => {
                setVendor(vendorList[index]?.data);
                setCurrentVendor(vendorList[index]?.data?._id);
              }}
              className=""
            >
              <span
                className={` w-full py-5 px-3 cursor-pointer ${
                  currentVendor === vendor?.data?._id
                    ? "bg-zinc-600 rounded-r-lg absolute h-6 w-[190px] -left-2 -top-[5px] z-[-10] "
                    : ""
                }`}
              ></span>
              <span
                className={` text-lg cursor-pointer -ml-4 text-zinc-800 dark:text-zinc-100 ${
                  currentVendor === vendor?.data?._id
                    ? "pl-8 text-zinc-100  "
                    : ""
                }`}
              >
                {vendor?.data?.ShopName}
              </span>
            </Link>
          </div>
        ))}
      </div>
    );
  }

  const containerRef = useRef(null);

  useEffect(() => {
    if (openVenderList) {
      gsap.to(containerRef.current, { duration: 0.3, minWidth: '200px', minHeight: '280px', scaleY: 1 });
    } else {
      gsap.to(containerRef.current, { duration: 0.3, minWidth: '0px', minHeight: '0px', scaleY: 1 });
    }



  }, [openVenderList]);

  const [openBannerForm, setOpenBannerForm] = useState(false)
  const [HoveringOnBanner, setHoveringOnBanner] = useState(false)
  const handleOpenBannerForm = () => setOpenBannerForm(!openBannerForm)
  const handleHoverBanner = () => setHoveringOnBanner(!HoveringOnBanner)

  return (
    <div className="min-h-screen w-full dark:bg-[#1a1a1a] text-gray-600 bg-zinc-300 dark:text-white">
      {OpenAddVenderForm && (
        <AddVendorForm handleOpenAddVenderForm={handleOpenAddVenderForm} />
      )}
      <div className="flex items-center gap-5 sticky top-0 w-full bg-white dark:bg-zinc-800 px-6 py-4 z-10">
        <img
          src={vendor?.ShopLogo || vendorDefaultLogo}
          alt="Shop Logo"
          className="min-w-20 min-h-20 h-[2vmin] w-[2vmin] max-md:hidden rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold capitalize max-sm:text-lg">
            {vendor?.ShopName && `${vendor?.ShopName}'s`} Dashboard
          </h1>
          <p className="dark:text-gray-400 text-gray-500 max-sm:hidden">
            Manage your shop, products, and services
          </p>
        </div>
        <div
          ref={containerRef}
          className={`rounded-md border bg-white/80 backdrop-blur-sm dark:bg-zinc-800 border-gray-500 absolute right-5 top-8 z-[99]`}
        >
          <div
            className="p-2 w-full cursor-pointer"
            onClick={handleOpenVenderList}
          >
            <FaPlus
              className={`${openVenderList ? "rotate-45" : ""
                } transition-all duration-100`}
            />
          </div>

          <div
            className={`${openVenderList ? "" : "hidden"
              } transition-all duration-300 pb-2 pr-2 max-h-96 h-max overflow-y-auto`}
          >
            <RenderVenderList />
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex items-center justify-center">
          <div
            onMouseEnter={handleHoverBanner}
            onMouseLeave={handleHoverBanner}
            className={`absolute top-0 left-0 w-full h-full ${HoveringOnBanner && 'bg-black/50'} flex items-center justify-center`}>
            {HoveringOnBanner &&
              <div
                className="text-white bg-white/30 px-2 py-1 rounded-lg text-xl cursor-pointer m-2 whitespace-nowrap flex justify-center items-center gap-2"
                onClick={handleOpenBannerForm}
              >
                <FaEdit /> Edit the banner
              </div>
            }
          </div>
          <img
            src={
              vendor?.ShopBanner
                ? `${BASE_URL}${vendor?.ShopBanner}`
                : vendorDefaultBanner
            }
            alt="Shop Logo"
            className="w-full max-sm:h-60 sm:aspect-3/1 object-cover"
          />
        </div>
        {openBannerForm && (
          <BannerForm
            handleOpenBannerForm={handleOpenBannerForm}
            vendorId={vendor?._id}
          />
        )}
        <div className="p-4 dark:bg-[#333] bg-white  dark:text-white rounded-lg mt-6 sm:mx-6 mx-2 text-md max-md:text-sm max-sm:text-xs absolute sm:-bottom-4 -bottom-8 left-0 right-0">
          <p>
            <strong>Email:</strong> {vendor?.ShopEmail}
          </p>
          <p>
            <strong>Phone:</strong> {vendor?.ShopPhone}
          </p>
          <p className="max-sm:hidden">
            <strong>Description:</strong> {vendor?.ShopDescription}
          </p>
        </div>
      </div>
      <br />
      <br />
      <div className="sm:p-6 p-2 pt-0">
        <VendorProductManager
          currentvendor={currentVendor}
          vendorProducts={vendor?.Products}
        />
      </div>
    </div>
  );


}

const AddVendorForm = ({ handleOpenAddVenderForm }) => {
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setShopCategory(e.target.value);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData, shopCategory);
    addVendor({ formData, shopCategory });
  };

  const handleClose = () => {
    handleOpenAddVenderForm()
  }


  return (
    <>
      <div className="max-w-xl w-[90%] mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-white/90 backdrop-blur-sm dark:bg-zinc-800 shadow-lg dark:shadow-white/10 rounded-lg mt-10 z-30">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2">
          <FaTimes />
        </button>
        <h1 className="text-3xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-8">
          Add Vendor
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 ">
          {/* Step 1: Basic Shop Details */}
          {step === 1 && (
            <div>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="ShopName"
                    className="text-lg text-gray-600 dark:text-gray-300 "
                  >
                    Shop Name
                  </label>
                  <input
                    id="ShopName"
                    name="ShopName"
                    type="text"
                    value={formData.ShopName}
                    onChange={handleChange}
                    className="px-3 py-3 outline-none rounded-md bg-zinc-700/20 "
                    placeholder="Enter Shop Name"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="ShopPhone"
                    className="text-lg text-gray-600 dark:text-gray-300"
                  >
                    Shop Phone
                  </label>
                  <input
                    id="ShopPhone"
                    name="ShopPhone"
                    type="tel"
                    value={formData.ShopPhone}
                    onChange={handleChange}
                    className="px-3 py-3 outline-none rounded-md bg-zinc-700/20 "
                    placeholder="Enter Phone Number"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="ShopEmail"
                    className="text-lg text-gray-600 dark:text-gray-300"
                  >
                    Shop Email
                  </label>
                  <input
                    id="ShopEmail"
                    name="ShopEmail"
                    type="email"
                    value={formData.ShopEmail}
                    onChange={handleChange}
                    className="px-3 py-3 outline-none rounded-md bg-zinc-700/20 "
                    placeholder="Enter Email"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address & Description */}
          {step === 2 && (
            <div>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="ShopAddress"
                    className="text-lg text-gray-600 dark:text-gray-300"
                  >
                    Shop Address
                  </label>
                  <input
                    id="ShopAddress"
                    name="ShopAddress"
                    type="text"
                    value={formData.ShopAddress}
                    onChange={handleChange}
                    className="px-3 py-3 outline-none rounded-md bg-zinc-700/20 "
                    placeholder="Enter Address"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="ShopDescription"
                    className="text-lg text-gray-600 dark:text-gray-300"
                  >
                    Shop Description
                  </label>
                  <textarea
                    id="ShopDescription"
                    name="ShopDescription"
                    value={formData.ShopDescription}
                    onChange={handleChange}
                    className="px-3 py-3 outline-none rounded-md bg-zinc-700/20 "
                    placeholder="Enter a description of your shop"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="ShopLocation"
                    className="text-lg text-gray-600 dark:text-gray-300"
                  >
                    Shop Location
                  </label>
                  <input
                    id="ShopLocation"
                    name="ShopLocation"
                    type="text"
                    value={formData.ShopLocation}
                    onChange={handleChange}
                    className="px-3 py-3 outline-none rounded-md bg-zinc-700/20 "
                    placeholder="Enter Location"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Category & Logo */}
          {step === 3 && (
            <div>
              <div className="flex flex-col">
                <label
                  htmlFor="ShopCategory"
                  className="text-lg text-gray-600 dark:text-gray-300"
                >
                  Shop Category
                </label>
                <select
                  name="ShopCategory"
                  value={shopCategory}
                  onChange={handleCategoryChange}
                  className="px-3 py-3 outline-none rounded-md bg-zinc-700/20 "
                >
                  <option value="">Select Category</option>
                  <option value="bakery">Bakery</option>
                  <option value="food">Food</option>
                  <option value="decoration">Decoration</option>
                  <option value="hotel">Hotel</option>
                  <option value="banquet">Banquet Hall</option>
                </select>
              </div>

              <div className="flex flex-col mt-6">
                <label
                  htmlFor="ShopLogo"
                  className="text-lg text-gray-600 dark:text-gray-300"
                >
                  Shop Logo
                </label>
                <input
                  id="ShopLogo"
                  name="ShopLogo"
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, ShopLogo: e.target.files[0] })
                  }
                  className="px-3 py-3 outline-none rounded-md bg-zinc-700/20 "
                />
              </div>
              {formData?.ShopLogo && (
                <div className="flex flex-col mt-6">
                  <img
                    src={URL.createObjectURL(formData?.ShopLogo)}
                    alt="Shop Logo"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="btn-secondary"
              >
                Previous
              </button>
            )}

            {step < 3 ? (
              <button type="button" onClick={handleNext} className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 ">
                Next
              </button>
            ) : (
              <button type="submit" className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 ">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="w-screen h-screen fixed top-0 left-0 z-20 bg-gray-500/10 backdrop-blur-lg"></div>
    </>
  );
};

const BannerForm = ({ handleOpenBannerForm, vendorId }) => {
  const [formData, setFormData] = useState({
    ShopBanner: null,
  });

  const { addBannerToVendor } = useVendor();

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] }); // ✅ Store File object
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // ✅ Now correctly logs file

    // Convert formData to FormData object for upload
    const data = new FormData();
    data.append("ShopBanner", formData.ShopBanner);

    addBannerToVendor(vendorId, data);
  };

  return (
    <>
      <div
        className="max-w-xl w-[90%] mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-white/90 backdrop-blur-sm dark:bg-zinc-800 shadow-xl rounded-lg mt-10 z-20"
      >
        <button onClick={handleOpenBannerForm} className="absolute top-4 right-4 p-2">
          <FaTimesCircle size={20} />
        </button>
        <h1 className="text-3xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-8 ">
          Add Banner
        </h1>
        {formData?.ShopBanner && (
          <div className="flex flex-col mt-6">
            <img
              src={URL.createObjectURL(formData.ShopBanner)}
              alt="Shop Banner"
              className="w-full aspect-3/1 object-cover"
            />
          </div>
        )}
        <br />
        <form className="flex flex-col gap-6 justify-center items-center w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="ShopBanner" className="text-lg text-gray-600 dark:text-gray-300">
              Shop Banner
            </label>
            <input
              type="file"
              id="ShopBanner"
              onChange={handleChange}
              name="ShopBanner"
              className="px-3 py-3 outline-none rounded-md bg-zinc-700/20  w-full"
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 ">
            Submit
          </button>
        </form>
      </div>
      <div className="w-screen h-screen fixed top-0 left-0 z-10 bg-gray-500/10 backdrop-blur-lg"></div>
    </>
  );
};
