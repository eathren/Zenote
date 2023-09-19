import { HomeOutlined } from "@ant-design/icons"
import styles from "./index.module.css"
import { Link } from "react-router-dom"
import { Button } from "antd"

export const Header = () => {
  return (
    <div className={styles.header__body}>
      <div className={styles.header__icon}>
        <Link to="/">
          <HomeOutlined style={{ color: "white" }} />
        </Link>
      </div>
      <div className={styles.header__links}>
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
      </div>
    </div>
  )
}
