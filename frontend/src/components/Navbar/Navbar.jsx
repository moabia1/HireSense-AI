import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutBtn = () => {
    handleLogout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>HireSense</span>
          <span className={styles.logoAI}>AI</span>
        </Link>

        {/* Desktop Menu */}
        <div className={styles.desktopMenu}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <div className={styles.userSection}>
            {user && (
              <>
                <span className={styles.userName}>
                  {user.name || user.email}
                </span>
                <button className={styles.logoutBtn} onClick={handleLogoutBtn}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link
            to="/"
            className={styles.mobileLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          {user && (
            <>
              <div className={styles.mobileUserInfo}>
                <span>{user.name || user.email}</span>
              </div>
              <button className={styles.mobileLogoutBtn} onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
