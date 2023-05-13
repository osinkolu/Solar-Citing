import React from "react";
import styles from "./footer.module.sass";
import { useTheme } from "next-themes";


export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={styles.app_footer}>
      <div className="container py-3">
        <div className="row">
          <div className="py-3 col-12 col-xl-3">
            <div className="app_logo align-center">
              <h2 className={`py-3`}>Power TID</h2>
            </div>
          </div>
          <div className="py-3 col-6 col-lg-4 col-xl-2">
            
          </div>
          <div className="py-3 col-6 col-lg-4 col-xl-2">
            
          </div>
          <div className="py-3 col-6 col-lg-4 col-xl-2">
            
          </div>
        </div>
      </div>
    </footer>
  );
}
