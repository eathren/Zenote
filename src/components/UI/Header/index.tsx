import { HomeOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { useUser } from "src/hooks/user";

export const Header = () => {
  const { user, signOut } = useUser();
  return (
    <div className={styles.header__body}>
      <div className={styles.header__icon}>
        <Link to="/">
          <HomeOutlined style={{ color: "white" }} />
        </Link>
      </div>
      <div className={styles.header__links}>
        {!user ? (
          <>
            <Link to="/login">
              <Button type="text" style={{ color: "white" }}>
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button type="text" style={{ color: "white" }}>
                Sign Up
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Button type="text" style={{ color: "white" }} onClick={signOut}>
              Sign Out
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
