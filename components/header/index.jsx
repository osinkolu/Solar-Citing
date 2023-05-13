import React, { useState, useEffect } from "react";

import styles from "./header.module.sass";
import Link from "next/link";
import Navbar from "../navbar";
import { useTheme } from "next-themes";

// ICONS
import ThemeIcon from "../../public/static/icons/app-mode-icon";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    window && window.scrollY >= 1 ? setIsSticky(true) : setIsSticky(false);
    window.onscroll = () => {
      window.scrollY >= 1 ? setIsSticky(true) : setIsSticky(false);
    };
  }, []);

  return (
    <div
      className={`${styles.main_header_wrapper}  ${
        isSticky && styles.sticky_top
      }`}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-2">
            <div className="app_brand_logo d-flex">
              <Link href={"/"}>
                <h3>Power TID</h3>
              </Link>
            </div>
          </div>
          <div className="d-none d-xl-block col-6">
            <Navbar />
          </div>
          <div className="col-10 col-xl-4">
            <div className="d-flex justify-content-end align-items-center">
              <button
                className={styles.mode_toggle_btn}
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              >
                <ThemeIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
