// src/admin/components/Topbar.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FiBell,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../hooks/useAdmin";

export default function Topbar({ toggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const { adminUser, logout, notifications } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-40">

      {/* Left Side */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <FiMenu size={22} className="text-gray-600" />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <FiBell size={20} className="text-gray-600" />
            {notifications && notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Notifications
                </h3>
                {notifications && notifications.length > 0 && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {notifications.length} new
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications && notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${
                        notif.type === "error"
                          ? "border-l-4 border-l-red-500"
                          : notif.type === "success"
                          ? "border-l-4 border-l-green-500"
                          : "border-l-4 border-l-blue-500"
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">Just now</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <FiBell size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No notifications yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" />

        {/* User Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-3 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {adminUser?.avatar ? (
              <img
                src={adminUser.avatar}
                alt={adminUser?.name}
                className="w-9 h-9 rounded-xl object-cover"
              />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-xs font-bold">
                {getInitials(adminUser?.name)}
              </div>
            )}

            {/* ✅ Only show name - removed role */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {adminUser?.name || "Admin"}
              </p>
            </div>

            <FiChevronDown
              size={14}
              className={`text-gray-400 hidden md:block transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              {/* ✅ User Info - removed role, just name and email */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <p className="text-sm font-semibold text-gray-900">
                  {adminUser?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {adminUser?.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/admin/settings");
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-gray-700 rounded-xl transition text-sm"
                >
                  <FiUser size={16} className="text-gray-400" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/admin/settings");
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-gray-700 rounded-xl transition text-sm"
                >
                  <FiSettings size={16} className="text-gray-400" />
                  Settings
                </button>
              </div>

              {/* Logout */}
              <div className="p-1.5 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 hover:bg-red-50 flex items-center gap-3 text-red-600 rounded-xl transition text-sm"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}



// company 75techstore google code //


// {
//   "places": [
//     {
//       "name": "places/ChIJQdAW5HOTOxARVIW_HEaGLJQ",
//       "id": "ChIJQdAW5HOTOxARVIW_HEaGLJQ",
//       "types": [
//         "point_of_interest",
//         "establishment"
//       ],
//       "nationalPhoneNumber": "0703 562 0709",
//       "internationalPhoneNumber": "+234 703 562 0709",
//       "formattedAddress": "M plaza, Adepele St, Ikeja, 100102, Lagos, Nigeria",
//       "addressComponents": [
//         {
//           "longText": "M plaza",
//           "shortText": "M plaza",
//           "types": [
//             "premise"
//           ],
//           "languageCode": "en"
//         },
//         {
//           "longText": "Adepele Street",
//           "shortText": "Adepele St",
//           "types": [
//             "route"
//           ],
//           "languageCode": "en"
//         },
//         {
//           "longText": "Ikeja",
//           "shortText": "Ikeja",
//           "types": [
//             "neighborhood",
//             "political"
//           ],
//           "languageCode": "en"
//         },
//         {
//           "longText": "Ikeja",
//           "shortText": "Ikeja",
//           "types": [
//             "locality",
//             "political"
//           ],
//           "languageCode": "en"
//         },
//         {
//           "longText": "Anifowoshe/Ikeja",
//           "shortText": "Anifowoshe/Ikeja",
//           "types": [
//             "administrative_area_level_3",
//             "political"
//           ],
//           "languageCode": "en"
//         },
//         {
//           "longText": "Ikeja",
//           "shortText": "Ikeja",
//           "types": [
//             "administrative_area_level_2",
//             "political"
//           ],
//           "languageCode": "en"
//         },
//         {
//           "longText": "Lagos",
//           "shortText": "LA",
//           "types": [
//             "administrative_area_level_1",
//             "political"
//           ],
//           "languageCode": "en"
//         },
//         {
//           "longText": "Nigeria",
//           "shortText": "NG",
//           "types": [
//             "country",
//             "political"
//           ],
//           "languageCode": "en"
//         },
//         {
//           "longText": "100102",
//           "shortText": "100102",
//           "types": [
//             "postal_code"
//           ],
//           "languageCode": "en-US"
//         }
//       ],
//       "plusCode": {
//         "globalCode": "6FR5H8WR+C2",
//         "compoundCode": "H8WR+C2 Ikeja, Nigeria"
//       },
//       "location": {
//         "latitude": 6.596108,
//         "longitude": 3.3400429
//       },
//       "viewport": {
//         "low": {
//           "latitude": 6.5947540697084976,
//           "longitude": 3.3386825197084984
//         },
//         "high": {
//           "latitude": 6.5974520302915023,
//           "longitude": 3.3413804802915021
//         }
//       },
//       "rating": 5,
//       "googleMapsUri": "https://maps.google.com/?cid=10677056452276749652&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgBIAA",
//       "websiteUri": "https://75techstore.com.ng/",
//       "regularOpeningHours": {
//         "openNow": true,
//         "periods": [
//           {
//             "open": {
//               "day": 1,
//               "hour": 8,
//               "minute": 0
//             },
//             "close": {
//               "day": 1,
//               "hour": 20,
//               "minute": 0
//             }
//           },
//           {
//             "open": {
//               "day": 2,
//               "hour": 8,
//               "minute": 0
//             },
//             "close": {
//               "day": 2,
//               "hour": 20,
//               "minute": 0
//             }
//           },
//           {
//             "open": {
//               "day": 3,
//               "hour": 8,
//               "minute": 0
//             },
//             "close": {
//               "day": 3,
//               "hour": 20,
//               "minute": 0
//             }
//           },
//           {
//             "open": {
//               "day": 4,
//               "hour": 8,
//               "minute": 0
//             },
//             "close": {
//               "day": 4,
//               "hour": 20,
//               "minute": 0
//             }
//           },
//           {
//             "open": {
//               "day": 5,
//               "hour": 8,
//               "minute": 0
//             },
//             "close": {
//               "day": 5,
//               "hour": 20,
//               "minute": 0
//             }
//           },
//           {
//             "open": {
//               "day": 6,
//               "hour": 8,
//               "minute": 0
//             },
//             "close": {
//               "day": 6,
//               "hour": 20,
//               "minute": 0
//             }
//           }
//         ],
//         "weekdayDescriptions": [
//           "Monday: 8:00 AM – 8:00 PM",
//           "Tuesday: 8:00 AM – 8:00 PM",
//           "Wednesday: 8:00 AM – 8:00 PM",
//           "Thursday: 8:00 AM – 8:00 PM",
//           "Friday: 8:00 AM – 8:00 PM",
//           "Saturday: 8:00 AM – 8:00 PM",
//           "Sunday: Closed"
//         ],
//         "nextCloseTime": "2026-11-27T19:00:00Z"
//       },
//       "utcOffsetMinutes": 60,
//       "adrFormatAddress": "M plaza, \u003cspan class=\"street-address\"\u003eAdepele St\u003c/span\u003e, \u003cspan class=\"extended-address\"\u003eIkeja\u003c/span\u003e, \u003cspan class=\"postal-code\"\u003e100102\u003c/span\u003e, \u003cspan class=\"region\"\u003eLagos\u003c/span\u003e, \u003cspan class=\"country-name\"\u003eNigeria\u003c/span\u003e",
//       "businessStatus": "OPERATIONAL",
//       "userRatingCount": 7,
//       "iconMaskBaseUri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
//       "iconBackgroundColor": "#78909C",
//       "displayName": {
//         "text": "75techstore Limited",
//         "languageCode": "en"
//       },
//       "currentOpeningHours": {
//         "openNow": true,
//         "periods": [
//           {
//             "open": {
//               "day": 1,
//               "hour": 8,
//               "minute": 0,
//               "date": {
//                 "year": 2026,
//                 "month": 11,
//                 "day": 30
//               }
//             },
//             "close": {
//               "day": 1,
//               "hour": 20,
//               "minute": 0,
//               "date": {
//                 "year": 2026,
//                 "month": 11,
//                 "day": 30
//               }
//             }
//           },
//           {
//             "open": {
//               "day": 2,
//               "hour": 8,
//               "minute": 0,
//               "date": {
//                 "year": 2026,
//                 "month": 12,
//                 "day": 1
//               }
//             },
//             "close": {
//               "day": 2,
//               "hour": 20,
//               "minute": 0,
//               "date": {
//                 "year": 2026,
//                 "month": 12,
//                 "day": 1
//               }
//             }
//           },
//           {
//             "open": {
//               "day": 3,
//               "hour": 8,
//               "minute": 0,
//               "date": {
//                 "year": 2026,
//                 "month": 12,
//                 "day": 2
//               }
//             },
//             "close": {
//               "day": 3,
//               "hour": 20,
//               "minute": 0,
//               "date": {
//                 "year": 2026,
//                 "month": 12,
//                 "day": 2
//               }
//             }
//           },
//           {
//             "open": {
//               "day": 4,
//               "hour": 8,
//               "minute": 0,
//               "date": {
//                 "year": 2026,
//                 "month": 12,
//                 "day": 3
//               }
//             },
//             "close": {
//               "day": 4,
//               "hour": 20,
//               "minute": 0,
//               "date": {
//                 "year": 2026,
//                 "month": 12,
//                 "day": 3
//               }
//             }
//           },
//           {
//             "open": {
//               "day": 5,
//               "hour": 8,
//               "minute": 0,
//               "date": {
//                 "year": 2026,
//                 "month": 11,
//                 "day": 27
//               }
//             },
//             "close": {
//               "day": 5,
//               "hour": 20,
//               "minute": 0,
//               "date": {
//                 "year": 2026,
//                 "month": 11,
//                 "day": 27
//               }
//             }
//           },
//           {
//             "open": {
//               "day": 6,
//               "hour": 8,
//               "minute": 0,
//               "date": {
//                 "year": 2026,
//                 "month": 11,
//                 "day": 28
//               }
//             },
//             "close": {
//               "day": 6,
//               "hour": 20,
//               "minute": 0,
//               "date": {
//                 "year": 2026,
//                 "month": 11,
//                 "day": 28
//               }
//             }
//           }
//         ],
//         "weekdayDescriptions": [
//           "Monday: 8:00 AM – 8:00 PM",
//           "Tuesday: 8:00 AM – 8:00 PM",
//           "Wednesday: 8:00 AM – 8:00 PM",
//           "Thursday: 8:00 AM – 8:00 PM",
//           "Friday: 8:00 AM – 8:00 PM",
//           "Saturday: 8:00 AM – 8:00 PM",
//           "Sunday: Closed"
//         ],
//         "nextCloseTime": "2026-11-27T19:00:00Z"
//       },
//       "shortFormattedAddress": "M plaza, Adepele St, Ikeja",
//       "reviews": [
//         {
//           "name": "places/ChIJQdAW5HOTOxARVIW_HEaGLJQ/reviews/Ci9DQUlRQUNvZENodHljRjlvT25WUVEycFdaakpaV0VwSWVVazRhbWx1VkVwMFMzYxAB",
//           "relativePublishTimeDescription": "in the last week",
//           "rating": 5,
//           "text": {
//             "text": "I had a great experience with 75Techstore Limited. Their team demonstrates strong technical expertise and a professional approach to delivering technology solutions. They offer a wide range of services, including website development, mobile app development, IT support, and gadget-related services, making them a convenient one-stop technology partner.",
//             "languageCode": "en"
//           },
//           "originalText": {
//             "text": "I had a great experience with 75Techstore Limited. Their team demonstrates strong technical expertise and a professional approach to delivering technology solutions. They offer a wide range of services, including website development, mobile app development, IT support, and gadget-related services, making them a convenient one-stop technology partner.",
//             "languageCode": "en"
//           },
//           "authorAttribution": {
//             "displayName": "Oghenetega Sukuru",
//             "uri": "https://www.google.com/maps/contrib/112703454302883229623/reviews",
//             "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjVhzlVcIEzVSCy0dkVLqQD9xfR5lJMkFV183U7vStdy9NPqOWbf=s128-c0x00000000-cc-rp-mo"
//           },
//           "publishTime": "2026-11-20T12:23:49.087809304Z",
//           "flagContentUri": "https://www.google.com/local/content/rap/report?postId=Ci9DQUlRQUNvZENodHljRjlvT25WUVEycFdaakpaV0VwSWVVazRhbWx1VkVwMFMzYxAB&d=17924085&t=1&wv=1",
//           "googleMapsUri": "https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sCi9DQUlRQUNvZENodHljRjlvT25WUVEycFdaakpaV0VwSWVVazRhbWx1VkVwMFMzYxAB!2m1!1s0x103b9373e416d041:0x942c86461cbf8554"
//         },
//         {
//           "name": "places/ChIJQdAW5HOTOxARVIW_HEaGLJQ/reviews/Ci9DQUlRQUNvZENodHljRjlvT2pOSFYwRTNjRWd6VFRCbVFVazBURTlYWjFOS1NFRRAB",
//           "relativePublishTimeDescription": "a year ago",
//           "rating": 5,
//           "text": {
//             "text": "Got my current phone from them.. And everything is working well",
//             "languageCode": "en"
//           },
//           "originalText": {
//             "text": "Got my current phone from them.. And everything is working well",
//             "languageCode": "en"
//           },
//           "authorAttribution": {
//             "displayName": "ifeanyi chuks",
//             "uri": "https://www.google.com/maps/contrib/110600459860877122734/reviews",
//             "photoUri": "https://lh3.googleusercontent.com/a/ACg8ocJ6WBjzIa0DoUBb8YGfQQ91rtN2-eXY8DTPYCgBVFpXUWeLEw=s128-c0x00000000-cc-rp-mo"
//           },
//           "publishTime": "2025-08-31T09:49:50.905983027Z",
//           "flagContentUri": "https://www.google.com/local/content/rap/report?postId=Ci9DQUlRQUNvZENodHljRjlvT2pOSFYwRTNjRWd6VFRCbVFVazBURTlYWjFOS1NFRRAB&d=17924085&t=1&wv=1",
//           "googleMapsUri": "https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sCi9DQUlRQUNvZENodHljRjlvT2pOSFYwRTNjRWd6VFRCbVFVazBURTlYWjFOS1NFRRAB!2m1!1s0x103b9373e416d041:0x942c86461cbf8554"
//         },
//         {
//           "name": "places/ChIJQdAW5HOTOxARVIW_HEaGLJQ/reviews/Ci9DQUlRQUNvZENodHljRjlvT2pGcE9VRTNTRzFIZGpOaldGSTBPSE5CTldsTFdGRRAB",
//           "relativePublishTimeDescription": "a year ago",
//           "rating": 5,
//           "text": {
//             "text": "I got the best of gadgets from their store",
//             "languageCode": "en"
//           },
//           "originalText": {
//             "text": "I got the best of gadgets from their store",
//             "languageCode": "en"
//           },
//           "authorAttribution": {
//             "displayName": "Marvelous Popoola",
//             "uri": "https://www.google.com/maps/contrib/110623694983006645585/reviews",
//             "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjXYJSeUQdzn7H3XP7Nf1LKoko59UoO_sbL0XVawOUBvnQ85160=s128-c0x00000000-cc-rp-mo"
//           },
//           "publishTime": "2025-08-31T09:44:15.940797094Z",
//           "flagContentUri": "https://www.google.com/local/content/rap/report?postId=Ci9DQUlRQUNvZENodHljRjlvT2pGcE9VRTNTRzFIZGpOaldGSTBPSE5CTldsTFdGRRAB&d=17924085&t=1&wv=1",
//           "googleMapsUri": "https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sCi9DQUlRQUNvZENodHljRjlvT2pGcE9VRTNTRzFIZGpOaldGSTBPSE5CTldsTFdGRRAB!2m1!1s0x103b9373e416d041:0x942c86461cbf8554"
//         },
//         {
//           "name": "places/ChIJQdAW5HOTOxARVIW_HEaGLJQ/reviews/Ci9DQUlRQUNvZENodHljRjlvT21aVlprTjFUM04xYWswMlNHaFJPRGM0Y25KVWJtYxAB",
//           "relativePublishTimeDescription": "3 weeks ago",
//           "rating": 5,
//           "text": {
//             "text": "Reliable and efficient",
//             "languageCode": "en"
//           },
//           "originalText": {
//             "text": "Reliable and efficient",
//             "languageCode": "en"
//           },
//           "authorAttribution": {
//             "displayName": "Jerry Sunday",
//             "uri": "https://www.google.com/maps/contrib/102939416753378926642/reviews",
//             "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjX0xS-7Gv16V9OeSyhZnHnblb8c5TyHWrg8Pbvjt5ZAIghWkbH3=s128-c0x00000000-cc-rp-mo"
//           },
//           "publishTime": "2026-11-04T09:15:11.954061622Z",
//           "flagContentUri": "https://www.google.com/local/content/rap/report?postId=Ci9DQUlRQUNvZENodHljRjlvT21aVlprTjFUM04xYWswMlNHaFJPRGM0Y25KVWJtYxAB&d=17924085&t=1&wv=1",
//           "googleMapsUri": "https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sCi9DQUlRQUNvZENodHljRjlvT21aVlprTjFUM04xYWswMlNHaFJPRGM0Y25KVWJtYxAB!2m1!1s0x103b9373e416d041:0x942c86461cbf8554"
//         },
//         {
//           "name": "places/ChIJQdAW5HOTOxARVIW_HEaGLJQ/reviews/Ci9DQUlRQUNvZENodHljRjlvT2tFNFdHWkxPREJPZFVKR1pESndibFI0TVV4d2VXYxAB",
//           "relativePublishTimeDescription": "a year ago",
//           "rating": 5,
//           "authorAttribution": {
//             "displayName": "akong david",
//             "uri": "https://www.google.com/maps/contrib/101461077502484752314/reviews",
//             "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjWF1p-D8w56bDf7DYbRHlrGOcd3p5G9_JxCe9Hd57ykur2PESXtLw=s128-c0x00000000-cc-rp-mo"
//           },
//           "publishTime": "2025-09-04T13:17:58.997708738Z",
//           "flagContentUri": "https://www.google.com/local/content/rap/report?postId=Ci9DQUlRQUNvZENodHljRjlvT2tFNFdHWkxPREJPZFVKR1pESndibFI0TVV4d2VXYxAB&d=17924085&t=1&wv=1",
//           "googleMapsUri": "https://www.google.com/maps/reviews/data=!4m6!14m5!1m4!2m3!1sCi9DQUlRQUNvZENodHljRjlvT2tFNFdHWkxPREJPZFVKR1pESndibFI0TVV4d2VXYxAB!2m1!1s0x103b9373e416d041:0x942c86461cbf8554"
//         }
//       ],
//       "photos": [
//         {
//           "name": "places/ChIJQdAW5HOTOxARVIW_HEaGLJQ/photos/AV-0GLc76Ld79gMzh4L1N_VybltfyBh6iBZSHdM7jHjKDSngO3ukmmhRbNNa2lmHFqKVcVHFYKB4MKpe5858i_wr3uY80AenourXYK7wbHt6ZDXdY3nwLtBlXkgM9uSCZEmpPFY14CYvAg2L4IsyXb-gvUD6-7nvK8erWPOgNaZmoppz8_h2PgR5G4FOZHYBRVrDvvnVIIg7X25Q9bkC24kpT2B2-hd54ebWrrZgZIunaK7zIU4blsg5pMgkyivHQQAErOE2nO0DHvD4jOsRm5BjOvuUqns3Ln4ZfgMKOJVaOEVWGAzGiwktw4sxioL8nGDJMdTEcYbIyYBbExk7wpoVi38jvBus78kq9IjytBrMegtGYbH4vVnGKIcrMRRSH0UtbzLL1bR2bjEXryC5ifgGoCdGMNLQ2x-xKyuvSdoXVyliIQ",
//           "widthPx": 1080,
//           "heightPx": 880,
//           "authorAttributions": [
//             {
//               "displayName": "75techstore Limited",
//               "uri": "https://maps.google.com/maps/contrib/108490095534536210874",
//               "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjU2vhxaZXZfEvbBz-ujwzvHpxdO-0ku_N0r-OrfGfhsErxdfhI=s100-p-k-no-mo"
//             }
//           ],
//           "flagContentUri": "https://www.google.com/local/content/rap/report?postId=!1e10!2sCIABIhDsyzCJSeXRQ0v3cjVjBroJ&t=27&cb_client=maps_api_places.places_api&hl=en-US",
//           "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIABIhDsyzCJSeXRQ0v3cjVjBroJ!2e10!4m2!3m1!1s0x103b9373e416d041:0x942c86461cbf8554"
//         },
//         {
//           "name": "places/ChIJQdAW5HOTOxARVIW_HEaGLJQ/photos/AV-0GLdg4auDj9rGY2qQ_OX6Oq1iGWeu_Wv0VpRwRgycEsicNlyPGgdlate7jE2xIARZfu_5XBEYGfybgU3YU78dsBjny4YFIIFeTa6egxUWYCytj29XnPDAdKUBTdXPySeprW5i9zev871RRFvfi1rrARBBF0h8axg0SnR-BmUZnAn0B5SepGzeHypwkuB39eI8OFAT6tEZzVWNKOU4JXFtqqEesxwIijPG7dMufyq_QRp2rVCDHQOMdlVoyYTd5qGEMY0JCCcFjW9rMya9QkFRn4uXdWJ_b9tQD_1ib42ELSWU07rPbgEvj9qEcCsqnLNYHDaHy3Fwz8F1NCnF95fd9289oog8U0X3_Ufv6LVC57bWbGgxpDFesudxhMBrkoCJNtIUSe7Lhyvt1MmaUERubbQ_h3qnwN6h_F3EYDd3YkjO",
//           "widthPx": 640,
//           "heightPx": 640,
//           "authorAttributions": [
//             {
//               "displayName": "75techstore Limited",
//               "uri": "https://maps.google.com/maps/contrib/108490095534536210874",
//               "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjU2vhxaZXZfEvbBz-ujwzvHpxdO-0ku_N0r-OrfGfhsErxdfhI=s100-p-k-no-mo"
//             }
//           ],
//           "flagContentUri": "https://www.google.com/local/content/rap/report?postId=!1e10!2sCIABIhCqQD4b9pe3RemsNenhuTjH&t=27&cb_client=maps_api_places.places_api&hl=en-US",
//           "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIABIhCqQD4b9pe3RemsNenhuTjH!2e10!4m2!3m1!1s0x103b9373e416d041:0x942c86461cbf8554"
//         },
//         {
//           "name": "places/ChIJQdAW5HOTOxARVIW_HEaGLJQ/photos/AV-0GLex_xRtJLS0bRuSYP0SjKMUrkFcvk_r-pMFwF5yS5bsIryn84k6cFzoYtKlhk5_jKCTlhdyLzylmYsjfbodemQ3o46AabJX8dlRabppeO9vNvw5iyM4mt-CbFdQorZBCoN_9PvDQ56rOUIkC1JNBXAKTXpIGy1c6_XfqplVcTiQaNs2YZ2u4UyvO1BLtqTNPnL4amMD5zbYGm2ZSzBkGC8c4q4q6LeQ7O2SzsRp1OwwIQPPeom6utyQ6MqcCdj-72zTO1rniAAJoe45JdgJ5neut-2WBlXA3STGPeabcuZQt-DKvdZNz1lxcEG9uy6HYck5OAH4EJ9x98jjqkrhkNhCyuCLvKpdlZ6z4MvvTiMCgKMAZykDjZYiNcMObhVSiJKH60u-5qF7MGLFP3USerO-nv1Afxz8vkuHLceUTH35",
//           "widthPx": 1600,
//           "heightPx": 3735,
//           "authorAttributions": [
//             {
//               "displayName": "75techstore Limited",
//               "uri": "https://maps.google.com/maps/contrib/108490095534536210874",
//               "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjU2vhxaZXZfEvbBz-ujwzvHpxdO-0ku_N0r-OrfGfhsErxdfhI=s100-p-k-no-mo"
//             }
//           ],
//           "flagContentUri": "https://www.google.com/local/content/rap/report?postId=!1e10!2sCIABIhDr81ld4WhSDEKOTUiQlYqo&t=27&cb_client=maps_api_places.places_api&hl=en-US",
//           "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIABIhDr81ld4WhSDEKOTUiQlYqo!2e10!4m2!3m1!1s0x103b9373e416d041:0x942c86461cbf8554"
//         }
//       ],
//       "addressDescriptor": {
//         "landmarks": [
//           {
//             "name": "places/ChIJu0NvoCeSOxARrsq99iLhJ_c",
//             "placeId": "ChIJu0NvoCeSOxARrsq99iLhJ_c",
//             "displayName": {
//               "text": "Awolowo Road T - Junction",
//               "languageCode": "en"
//             },
//             "types": [
//               "establishment",
//               "point_of_interest"
//             ],
//             "straightLineDistanceMeters": 67.534676,
//             "travelDistanceMeters": 176.90833
//           },
//           {
//             "name": "places/ChIJlaI5eieSOxARH8CczVXmj1M",
//             "placeId": "ChIJlaI5eieSOxARH8CczVXmj1M",
//             "displayName": {
//               "text": "3C HUB",
//               "languageCode": "en"
//             },
//             "types": [
//               "electronics_store",
//               "establishment",
//               "point_of_interest",
//               "store"
//             ],
//             "spatialRelationship": "AROUND_THE_CORNER",
//             "straightLineDistanceMeters": 67.46079,
//             "travelDistanceMeters": 84.46129
//           },
//           {
//             "name": "places/ChIJd2cE4omROxARV_ETEpoxFOs",
//             "placeId": "ChIJd2cE4omROxARV_ETEpoxFOs",
//             "displayName": {
//               "text": "SLOT",
//               "languageCode": "en"
//             },
//             "types": [
//               "establishment",
//               "point_of_interest",
//               "shopping_mall",
//               "store"
//             ],
//             "straightLineDistanceMeters": 179.85297,
//             "travelDistanceMeters": 289.99344
//           },
//           {
//             "name": "places/ChIJGxci8EuTOxARCEtAIpG6ERg",
//             "placeId": "ChIJGxci8EuTOxARCEtAIpG6ERg",
//             "displayName": {
//               "text": "Awolowo Glass House, Ikeja",
//               "languageCode": "en"
//             },
//             "types": [
//               "establishment",
//               "point_of_interest",
//               "shopping_mall"
//             ],
//             "straightLineDistanceMeters": 121.47019,
//             "travelDistanceMeters": 206.25635
//           },
//           {
//             "name": "places/ChIJEwEADCeSOxARtOqA0g0WgoA",
//             "placeId": "ChIJEwEADCeSOxARtOqA0g0WgoA",
//             "displayName": {
//               "text": "Computer Village",
//               "languageCode": "en"
//             },
//             "types": [
//               "electronics_store",
//               "establishment",
//               "point_of_interest",
//               "store"
//             ],
//             "spatialRelationship": "AROUND_THE_CORNER",
//             "straightLineDistanceMeters": 104.4694,
//             "travelDistanceMeters": 117.91537
//           }
//         ],
//         "areas": [
//           {
//             "name": "places/ChIJwZ-aiiiSOxARaInoeYiwslI",
//             "placeId": "ChIJwZ-aiiiSOxARaInoeYiwslI",
//             "displayName": {
//               "text": "Ikeja",
//               "languageCode": "en"
//             },
//             "containment": "WITHIN"
//           },
//           {
//             "name": "places/ChIJs535oieSOxARL50bzu8pHoQ",
//             "placeId": "ChIJs535oieSOxARL50bzu8pHoQ",
//             "displayName": {
//               "text": "Awolowo Glass House",
//               "languageCode": "en"
//             },
//             "containment": "NEAR"
//           }
//         ]
//       },
//       "googleMapsLinks": {
//         "directionsUri": "https://www.google.com/maps/dir//''/data=!4m7!4m6!1m1!4e2!1m2!1m1!1s0x103b9373e416d041:0x942c86461cbf8554!3e0?g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgBIAA",
//         "placeUri": "https://maps.google.com/?cid=10677056452276749652&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgBIAA",
//         "writeAReviewUri": "https://www.google.com/maps/place//data=!4m3!3m2!1s0x103b9373e416d041:0x942c86461cbf8554!12e1?g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgBIAA",
//         "reviewsUri": "https://www.google.com/maps/place//data=!4m4!3m3!1s0x103b9373e416d041:0x942c86461cbf8554!9m1!1b1?g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgBIAA",
//         "photosUri": "https://www.google.com/maps/place//data=!4m3!3m2!1s0x103b9373e416d041:0x942c86461cbf8554!10e5?g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgBIAA"
//       },
//       "timeZone": {
//         "id": "Africa/Lagos"
//       },
//       "postalAddress": {
//         "regionCode": "NG",
//         "languageCode": "en-US",
//         "postalCode": "100102",
//         "administrativeArea": "Lagos",
//         "locality": "Ikeja",
//         "addressLines": [
//           "M plaza",
//           "Adepele St"
//         ]
//       },
//       "googleMapsTypeLabel": {
//         "text": "Software Company",
//         "languageCode": "en-US"
//       },
//       "navigationPoints": [
//         {
//           "navigationPointToken": "ChIJ5M8Bk2ViGkAR-X2kLVO4CkASEglB0Bbkc5M7EBFUhb8cRoYslBoSCUHQFuRzkzsQEVSFvxxGhiyUIhIJLxaycyeSOxARgA_6FW53gYk",
//           "displayName": {
//             "text": "Otigba Street",
//             "languageCode": "en"
//           },
//           "location": {
//             "latitude": 6.5960906,
//             "longitude": 3.3400024
//           },
//           "travelModes": [
//             "DRIVE",
//             "WALK"
//           ]
//         }
//       ]
//     }
//   ],
//   "contextualContents": [
//     {
//       "photos": [
//         {
//           "name": "places/ChIJQdAW5HOTOxARVIW_HEaGLJQ/photos/AV-0GLdQApzJoaoeDoXakbhtncfKJeXdVs10xBmdSByEbR2JkmZjS9lv6YR3wW5NaXGHds6rznrn-aeSmoNAiEoYyciC7quoEkoezhkQrplRAsfWNeq3-rzE4RjYhDP9D17C64kRMynB0MCtMzocA1T_34Mb-SedSBvIUmY6SbgGOWIriOLum5xJ1XbajeoOLJuC5LM7Ah2X-pQJgdZIqOYHiRcA9Ix3zigr9Gn4osuMH7YO8tkLB5nS1IP94UAQg6DdBhBJ_x0OrA16LM-Wn8DYUWEq-x70fkri_mGagHTRL3RELfBx0Pfn3MDucxX21ZrW1HafqAWIue8cNgk_75ep1eYDgxhFMTmgnxcfEo_iSjAtKZ4ECXp3yGZlOq07oymKnD2Y6nNw5kUdKkedoUKd6_K-YKe-BD18",
//           "widthPx": 1080,
//           "heightPx": 880,
//           "authorAttributions": [
//             {
//               "displayName": "75techstore",
//               "uri": "https://maps.google.com/maps/contrib/108490095534536210874",
//               "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjU2vhxaZXZfEvbBz-ujwzvHpxdO-0ku_N0r-OrfGfhsErxdfhI=s100-p-k-no-mo"
//             }
//           ],
//           "flagContentUri": "https://www.google.com/local/content/rap/report?postId=!1e10!2sCIABIhDsyzCJSeXRQ0v3cjVjBroJ&t=27&cb_client=maps_api_places&hl=en-US",
//           "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIABIhDsyzCJSeXRQ0v3cjVjBroJ!2e10!4m2!3m1!1s0x103b9373e416d041:0x942c86461cbf8554"
//         },
//         {
//           "name": "places/ChIJQdAW5HOTOxARVIW_HEaGLJQ/photos/AV-0GLe1q-sydELzsAwrbg388mXEma47JMQYS92SJ8gkASkNTBhwK0ZbwGv6KdiDUlxPyJ7-03XpwCPp5C0m2nQ5vS5MLZ9w9w507mIVgg4Rjv6nOvdRDIqVeIOArVJgfP5fsLSqb6mKZHWAo6qEJBwdkznCQA8TfMxUf6FjJWEJHUqxoNhKiySgulzkzIu77r4tZT-_fheNrPyYnXysOYF91G6ZQKo0jQsGC4voVPlnqvetk_A0CHJNzkdUjX5tOuE0nEz9G7D3imw7E-Clpq2_IPbzwSwwz-0BcQKAQJnfc7jvOGffbgsqOvBZdmHYnond5RzXL8UpRwouIYse1GRi9Ji4Xw6ZF-lalfpf2ySDjFIjJH_RFf0EH6RbAT9WEWPtMVYJkfHks0FYPgfibpUAjHfSGnvWz7Q",
//           "widthPx": 640,
//           "heightPx": 640,
//           "authorAttributions": [
//             {
//               "displayName": "75techstore",
//               "uri": "https://maps.google.com/maps/contrib/108490095534536210874",
//               "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjU2vhxaZXZfEvbBz-ujwzvHpxdO-0ku_N0r-OrfGfhsErxdfhI=s100-p-k-no-mo"
//             }
//           ],
//           "flagContentUri": "https://www.google.com/local/content/rap/report?postId=!1e10!2sCIABIhCqQD4b9pe3RemsNenhuTjH&t=27&cb_client=maps_api_places&hl=en-US",
//           "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIABIhCqQD4b9pe3RemsNenhuTjH!2e10!4m2!3m1!1s0x103b9373e416d041:0x942c86461cbf8554"
//         },
//         {
//           "name": "places/ChIJQdAW5HOTOxARVIW_HEaGLJQ/photos/AV-0GLeQkMdM452hldlOESR1qhUgeUvezm2NJ18m9dWGF_x5JGRigxnyP9GgBvDCMdUlSw0rHMyNh__parccmgojGUDf8ZhspnXgLi99i6hJn7B4CNvbMT3ta15UyoJpJG5_I5kI-KLq_EnTsK21Gxmt7bSoZWZsZupXRXrddFwc3Yb55pV2qWMH3jk2uj1gvb3LwQIPe6_HCn30lFCpT1pLqN8HAca9bMrKPlD0lAOWNX3myNLyxHW_lgtySOpt8IdNTOwHpbrLfzwaQJyhWT-edBfY8WdlagigKOQq-Uz9_V7IvF9ohePBO8ZT3DKw24x2BCieNrmbW3kqJF3M8Q8sU2MB_nf5kNfZOO2Hw7m9pycXd0jya_8IpO7VKRFQSVXowjvi_6HABaU8z1uTDwIOqIiK3mAhE1I",
//           "widthPx": 1600,
//           "heightPx": 3735,
//           "authorAttributions": [
//             {
//               "displayName": "75techstore",
//               "uri": "https://maps.google.com/maps/contrib/108490095534536210874",
//               "photoUri": "https://lh3.googleusercontent.com/a-/ALV-UjU2vhxaZXZfEvbBz-ujwzvHpxdO-0ku_N0r-OrfGfhsErxdfhI=s100-p-k-no-mo"
//             }
//           ],
//           "flagContentUri": "https://www.google.com/local/content/rap/report?postId=!1e10!2sCIABIhDr81ld4WhSDEKOTUiQlYqo&t=27&cb_client=maps_api_places&hl=en-US",
//           "googleMapsUri": "https://www.google.com/maps/place//data=!3m4!1e2!3m2!1sCIABIhDr81ld4WhSDEKOTUiQlYqo!2e10!4m2!3m1!1s0x103b9373e416d041:0x942c86461cbf8554"
//         }
//       ]
//     }
//   ],
//   "searchUri": "https://www.google.com/maps/search/75techstore+Limited,+Ikeja,+Lagos,+Nigeria"
// }
