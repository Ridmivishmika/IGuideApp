"use client";
import React from "react";
import styles from "./footer.module.css";
import { FaFacebookF, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.topSection}>
          <h2 className={styles.title}>iGuide</h2>
          <p className={styles.description}>
            Empowering the next generation of legal minds through quality
            academic resources.
          </p>
          <div className={styles.socials}>
            <a
              href="https://www.facebook.com/iGuidelk?mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://youtube.com/@iguideelearning?si=VyLfhtsU1-j-oz4x"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <p>&copy; {new Date().getFullYear()} iGuide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
