import React, { useState, useEffect } from "react";
import axios from "axios";

const COOKIE_OPTIONS = [
  "Functionality",
  "Analytics Storage",
  "Ad Storage",
  "Ad User Data",
  "Ad Personalization",
  "Personalization Storage",
  "Security Storage",
];

// ✅ Helper to get CSRF token from cookies
const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const CookiesPopup = () => {
  const [checked, setChecked] = useState(
    COOKIE_OPTIONS.reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  const [showNotificationBar, setShowNotificationBar] = useState(true);
  const [showManageModal, setShowManageModal] = useState(false);

  const [autoUserData, setAutoUserData] = useState({});
  const [dataFromStorage, setDataFromStorage] = useState({});

  // Load data from localStorage
  useEffect(() => {
    const name = localStorage.getItem("name");
    const phone = localStorage.getItem("phone");

    const updatedData = {};
    const sourceFlags = {};

    if (name) {
      updatedData.name = name;
      sourceFlags.name = true;
    }
    if (phone) {
      updatedData.phone = phone;
      sourceFlags.phone = true;
    }

    setAutoUserData(updatedData);
    setDataFromStorage(sourceFlags);
  }, []);

  const handleAcceptAll = async () => {
    await sendData(true);
    setShowNotificationBar(false);
  };

  const handleRejectAll = () => {
    setShowNotificationBar(false);
  };

  const handleDone = async () => {
    setShowManageModal(false);
    setShowNotificationBar(false);
    await sendData(true);
  };

  const sendData = async (consentGiven) => {
    if (!consentGiven) return;

    const filteredUserData = Object.keys(dataFromStorage).reduce((acc, key) => {
      acc[key] = autoUserData[key];
      return acc;
    }, {});

    const payload = {
      ...filteredUserData,
      consent: true,
      cookie_preferences: checked,
      timestamp: new Date().toISOString(),
    };

    const csrfToken = getCookie("csrftoken"); // default name in Django

    try {
      console.log("Sending data:", payload);
      await axios.post("http://127.0.0.1:8000/submit/", payload, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true, // ✅ ensures cookies are sent
      });
    } catch (error) {
      console.error(
        "Error submitting consent:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center z-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.4)] transform scale-105">
          Hi Welcome To Our Website
        </h1>
      </div>

      <div>
        {showNotificationBar && !showManageModal && (
          <div className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:top-6 sm:right-6 sm:left-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 shadow-xl w-full sm:w-[350px] md:w-[400px] flex flex-col gap-4 sm:gap-6 z-50">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-bold mb-1 text-black dark:text-white">
                We use Cookies
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-lg">
                We use cookies to enhance your experience. Read our{" "}
                <a
                  href="/privacy-policy"
                  className="underline text-blue-600 dark:text-blue-400"
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 border border-black dark:border-white rounded-full text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
              >
                Reject All
              </button>
              <button
                onClick={() => setShowManageModal(true)}
                className="px-4 py-2 border border-black dark:border-white rounded-full text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
              >
                Manage
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 border border-black dark:border-white rounded-full text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
              >
                Accept All
              </button>
            </div>
          </div>
        )}

        {showManageModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-60 dark:bg-black dark:bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-center text-black dark:text-white">
                  Cookie Settings
                </h2>
                <div className="flex flex-col gap-3">
                  {COOKIE_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked[option]}
                        onChange={() =>
                          setChecked((prev) => ({
                            ...prev,
                            [option]: !prev[option],
                          }))
                        }
                        className="w-5 h-5 border-gray-400 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setShowManageModal(false)}
                    className="px-6 py-2 border border-black dark:border-white rounded-full text-sm font-semibold text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDone}
                    className="px-6 py-2 border border-black dark:border-white rounded-full text-sm font-semibold text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CookiesPopup;
