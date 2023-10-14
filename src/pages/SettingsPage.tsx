import { Button } from "antd"
import { useUser } from "src/hooks/user"

const SettingsPage = () => {
  const { signOut } = useUser()

  return (
    <>
      <Button block style={{ color: "white" }} onClick={signOut}>
        Sign Out
      </Button>
    </>
  )
}

export default SettingsPage
