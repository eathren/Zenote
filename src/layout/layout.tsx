import { Header } from "src/components/Header"
import styles from "./index.module.css"
type LayoutProps = {
  children: React.ReactNode
}

export const BasicLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <div className={styles.layout__body}>{children}</div>
    </>
  )
}
