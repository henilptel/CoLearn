import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import classNames from "classnames";


interface ExcludedRoute {
  path: string;
}

// Define the excluded routes
const excludedRoutes: ExcludedRoute[] = [
  { path: "/login" },
  { path: "/register" },
  { path: "/register/1" },
  { path: "/register/2" },
  { path: "/register/3" },
  { path: "/register/4" },
  { path: "/verify/callback" },
  { path: "/meeting" },
  { path: "/meeting/" },
  { path: "/meeting/:meetingId" },
  { path: "/admin" },
  { path: "/verification" },
];

const App: React.FC = () => {
  const location = useLocation();
  const header = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [showSideBar, setShowSideBar] = useState<boolean>(false);

  const calculateContentHeight = (): void => {
    if (header.current) {
      setContentHeight(
        document.documentElement.scrollHeight - header.current.offsetHeight,
      );
    } else {
      setContentHeight(document.documentElement.scrollHeight);
    }
  };

  useLayoutEffect(() => {
    calculateContentHeight();
    window.addEventListener("resize", calculateContentHeight);

    return () => {
      window.removeEventListener("resize", calculateContentHeight);
    };
  }, [location]);

  // Check if the current route matches any excluded route
  const isExcluded = useMemo(() => {
    if (location.pathname === "/") {
      return true;
    }

    return excludedRoutes.some((route) => location.pathname.match(route.path));
  }, [location.pathname]);

  const toggleSideBar = (): void => setShowSideBar((prev) => !prev);

  // Conditionally render Header and SideBar based on the route
  return (
    <>
      

      <div className="d-flex flex-grow-1">
       

        <div
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            height: contentHeight,
          }}
          className={classNames({
            "flex-grow-1": true,
            "p-3": !isExcluded,
          })}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default App;