import React, { useState } from "react";
import { useAuth } from "../store/auth.jsx";
import toast, { LoaderIcon } from "react-hot-toast";
import { GoEye, GoEyeClosed } from "react-icons/go";

function AuthPage() {
  const {  login, signup, isAuthLoading } = useAuth();
  const [isSignPage, setIsSignPage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullname] = useState("");
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignPage) {
      // Check for empty fields
      if (
        !email ||
        !password ||
        !confirmPassword ||
        !fullName ||
        !userName ||
        !gender
      ) {
        toast.error("All fields are required!");
        return;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      console.log(email, password, fullName, userName, gender);

      // Proceed with signup if all validations pass
      await signup(email, password, fullName, userName, gender);
    } else {
      // Check for empty email or password for login
      if (!email || !password) {
        toast.error("Email and password are required!");
        return;
      }

      // Proceed with login
      await login(email, password);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="fixed top-0 w-screen h-screen flex justify-center items-center">
        <LoaderIcon />
      </div>
    );
  }

  return (
    <>
      <div
        className={`${
          !isSignPage && "h-screen"
        }  dark:bg-[#1a1a1a]  flex flex-col dark:text-white relative`}
      >
        {/* <img
          src="https://readymadeui.com/bg-effect.svg"
          className="fixed inset-0 w-full h-full z-0"
          loading="lazy"
        /> */}

        <section className="h-full w-full flex justify-center items-center z-10">
          <div className={`container w-full h-full  ${isSignPage ? "" : ""}`}>
            <div className="h-full w-full max-lg:flex-wrap items-center justify-center md:justify-around">
              {/* <!-- Left column container with background--> */}
              <div
                className={` ${
                  isSignPage
                    ? "fixed right-10 top-20 -z-10 max-lg:block max-lg:aspect-square max-lg: max-xl:opacity-30 max-sm:hidden "
                    : "fixed right-40 top-20 -z-10 mb-12 md:mb-0 md:w-8/12 lg:w-6/12 lg:h-full max-lg:block max-lg:aspect-square max-lg: max-lg:opacity-30 max-sm:hidden"
                }`}
              >
                <img
                  src={
                    isSignPage
                      ? "https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                      : "https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                  }
                  className={isSignPage ? " h-full object-cover" : "w-full"}
                  alt="Phone image"
                  loading="lazy"
                />
              </div>

              {/* <!-- Right column container with form --> */}
              <div
                className={`h-full w-full xl:bg-zinc-800 ${
                  !isSignPage &&
                  " max-xl:pt-32 2xl:pt-40 max-md:px-10 max-sm:px-5 "
                } xl:pt-10 max-xl:pt-10 max-md:px-10 max-sm:px-5 max-lg:10/12 max-lg:mb-10 lg:max-w-max sm:px-10`}
              >
                <form
                  onSubmit={handleSubmit}
                  className="h-full flex flex-col text-zinc-300 dark:text-white w-full"
                >
                  {isSignPage && (
                    <>
                      <div className="md:flex gap-4">
                        {/* Fullname input */}
                        <div className="flex flex-col w-full">
                          <label className="mb-2 m-1" htmlFor="fullname">
                            Fullname
                          </label>
                          <input
                            name="fullname"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="Full Name"
                            className="mb-6 py-2 px-3 text-black rounded-md bg-transparent bg-white border-zinc-600 dark:border-white border-[1px]"
                          />
                        </div>

                        {/* userName */}
                        <div className="flex flex-col w-full">
                          <label className="mb-2 m-1" htmlFor="fullname">
                            UserName
                          </label>
                          <input
                            name="fullname"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="user.name"
                            className="mb-6 py-2 px-3 text-black rounded-md bg-transparent bg-white border-zinc-600 dark:border-white border-[1px]"
                          />
                        </div>
                      </div>

                      {/* userName */}

                      {/* Gender Selection */}
                      <label className="mb-2 m-1">Gender</label>
                      <div className="mb-6 flex gap-4">
                        {["Male", "Female", "Other"].map((g) => (
                          <label key={g} className="flex items-center">
                            <input
                              type="radio"
                              name="gender"
                              value={g}
                              checked={gender === g}
                              onChange={(e) => setGender(e.target.value)}
                              className="mr-2"
                            />
                            {g}
                          </label>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Email input */}
                  <div className="flex flex-col ">
                    <label className="mb-2 m-1" htmlFor="email">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="xyz@example.com"
                      className="mb-6 py-2 px-3 rounded-md bg-white text-black border-zinc-600 dark:border-white border-[1px]"
                    />

                    {/* Password input */}
                    <label className="mb-2 m-1" htmlFor="password">
                      Password
                    </label>
                    <div className="relative h-fit mb-6 ">
                      <input
                        name="confirm password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="******"
                        className="w-full py-2 px-3 rounded-md bg-transparent text-black bg-white border-zinc-600 dark:border-white border-[1px]"
                      />
                      {showPassword ? (
                        <GoEye
                          size={30}
                          onClick={() => setShowPassword(false)}
                          className="absolute top-1/2  text-black -translate-y-1/2 right-3 cursor-pointer"
                        />
                      ) : (
                        <GoEyeClosed
                          size={30}
                          onClick={() => setShowPassword(true)}
                          className="absolute top-1/2  text-black -translate-y-1/2 right-3 cursor-pointer"
                        />
                      )}
                    </div>
                  </div>

                  {isSignPage && (
                    <>
                      {/* Confirm Password input */}
                      <label className="mb-2 m-1" htmlFor="confirmPassword">
                        Confirm Password
                      </label>
                      <div className="relative h-fit mb-6">
                        <input
                          name="confirmPassword"
                          type={showPassword2 ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="******"
                          className="w-full py-2 px-3 rounded-md bg-transparent text-black bg-white border-zinc-600 dark:border-white border-[1px]"
                        />
                        {showPassword2 ? (
                          <GoEye
                            size={30}
                            onClick={() => setShowPassword2(false)}
                            className="absolute top-1/2 text-black -translate-y-1/2 right-3 cursor-pointer"
                          />
                        ) : (
                          <GoEyeClosed
                            size={30}
                            onClick={() => setShowPassword2(true)}
                            className="absolute top-1/2 text-black -translate-y-1/2 right-3 cursor-pointer"
                          />
                        )}
                      </div>
                    </>
                  )}

                  {/* <!-- Remember me checkbox --> */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                      <input
                        className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="checkbox"
                        value=""
                        id="exampleCheck3"
                        defaultChecked
                      />
                      <label
                        className="inline-block pl-[0.15rem] hover:cursor-pointer"
                        htmlFor="exampleCheck3"
                      >
                        Remember me
                      </label>
                    </div>

                    {/* <!-- Forgot password link --> */}
                    {!isSignPage ? (
                      <a
                        href="/forgetpasswordemail"
                        className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                      >
                        Forgot password
                      </a>
                    ) : (
                      <></>
                    )}
                  </div>

                  {/* <!-- Submit button --> */}

                  <button
                    type="submit"
                    className="inline-block w-full rounded text-white bg-blue-600 hover:bg-blue-700 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal dark:text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  >
                    {isSignPage ? "Sign up" : "login"}
                  </button>

                  {/* <!-- Divider --> */}
                  <div className="mt-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                    <p className="mx-4 mb-0 text-center font-semibold dark:text-neutral-200">
                      OR
                    </p>
                  </div>

                  <p
                    className=" my-4"
                    onClick={() => setIsSignPage(!isSignPage)}
                  >
                    {isSignPage ? "Already" : "Don't"} Have account:-{" "}
                    <span className="text-blue-500 cursor-pointer">
                      Click-Here
                    </span>
                  </p>

                  {/* <!-- Social login buttons --> */}
                  <div className="flex items-center max-sm:justify-center gap-10 max-sm:gap-2 ">
                    <a
                      className="mb-3 flex w-fit items-center justify-center rounded bg-primary px-2 sm:px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                      style={{ backgroundColor: "#3b5998" }}
                      href="#!"
                      role="button"
                    >
                      {/* <!-- Facebook --> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="sm:mr-2 h-3.5 w-3.5 "
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                      <span className="max-sm:hidden">Facebook</span>
                    </a>
                    <a
                      className="mb-3 flex w-fit items-center justify-center rounded bg-info px-2 sm:px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#54b4d3] transition duration-150 ease-in-out hover:bg-info-600 hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:bg-info-600 focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:outline-none focus:ring-0 active:bg-info-700 active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(84,180,211,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)]"
                      style={{ backgroundColor: "#55acee" }}
                      href="#!"
                      role="button"
                    >
                      {/* <!-- Twitter --> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="sm:mr-2 h-3.5 w-3.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                      <span className="max-sm:hidden">Twitter</span>
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default AuthPage;
