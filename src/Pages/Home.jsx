import React, { useState } from "react"; // Import useState
import { FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdLogIn } from "react-icons/io";

const Home = () => {

  const RadioButtonWithAcceptTerms = () => {
    const [isChecked, setIsChecked] = useState(false); // useState to handle checkbox state
  
    // Handle the checkbox change event
    const handleCheckboxChange = (e) => {
      setIsChecked(e.target.checked);
    };
  
    return (
      <>
        <nav className="flex justify-between items-center p-4 bg-white border-b border-gray-300">
          <div className="text-xl font-bold text-red-600">Random Meet</div>
          <div className="flex items-center gap-6">
            <div className="flex items-center text-gray-700 font-semibold">
              <span className="mr-1">100<sup>+</sup></span>
              <FaRegUser className="text-lg" />
            </div>
            <a href="#" className="text-xl text-gray-700 hover:text-red-600 transition">
              <IoSettingsOutline />
            </a>
          </div>
        </nav>

        <div className="home-section text-center mt-14">
          <h1 className="font-bold text-3xl">Meet Random People.</h1>
          <p className="mt-4 leading-relaxed max-w-4xl mx-auto px-4">
            We prioritize your security with end-to-end encryption, ensuring that all your conversations on Talks You remain private and protected. Our dedicated team provides 24/7 support, guaranteeing seamless communication and assistance whenever needed.
          </p>
        </div>

        <div className="starting text-center flex flex-col items-center justify-center mt-12">
          <h2 className="flex items-center font-bold text-3xl gap-2">
            <IoMdLogIn /> Before You Start
          </h2>
          <ul className="mt-6 text-left border py-4 px-2 rounded-[10px] w-100 mx-auto">
            <li>1. You are connected with random people. Don't share personal information.</li>
            <li>2. Make sure to read <a href="#" className="font-light text-blue-800">Terms and Conditions</a>.</li>
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center   p-4">
          {/* Terms and Conditions */}
          <div className="  w-full max-w-md">
          

            <div className="flex items-center mt-6">
              <input 
                type="checkbox" 
                id="terms" 
                checked={isChecked} 
                onChange={handleCheckboxChange} 
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I accept the <a href="#" className="text-blue-500">Terms and Conditions</a>
              </label>
            </div>
          </div>
          
          {/* Get Started Button */}
          <button 
            className={`mt-6 px-6 py-2 rounded-full ${isChecked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'} text-white`} 
            disabled={!isChecked}
          >
            Get Started
          </button>
        </div>
      </>
    );
  };

  return <RadioButtonWithAcceptTerms />;
};

export default Home;
