import React from "react"
import { Button, Popover } from "antd"
import ButtonGroup from "antd/es/button/button-group"
import { useLocation } from "react-router-dom"
import { useUser } from "src/hooks/user"

type ButtonItemType = {
  icon: React.ReactNode
  text: string
  onClick: () => void
  disabled?: boolean
}

type FooterButtonListProps = {
  buttonList: ButtonItemType[]
}

const FooterButtonList: React.FC<FooterButtonListProps> = ({ buttonList }) => {
  // Get the current location
  const location = useLocation()
  const { user } = useUser()
  return (
    <ButtonGroup>
      {buttonList.map((item, index) => {
        if (
          (item.text === "Find or Add New Node" &&
            (location.pathname === "/settings" ||
              location.pathname === "/" ||
              location.pathname === "/login" ||
              location.pathname === "/signup")) ||
          (!user && item.text === "Settings" && location.pathname === "/") ||
          (user &&
            (item.text === "Open Graph View" || item.text === "Home") &&
            location.pathname === "/")
        ) {
          return null
        }

        return (
          <div key={index} style={{ margin: "0 5px" }}>
            <Popover
              placement="top"
              title={item.text}
              arrow={{ pointAtCenter: true }}
            >
              <Button
                style={{ textAlign: "center" }}
                type="text"
                disabled={item.disabled}
                onClick={() => item.onClick()}
              >
                {item.icon}
              </Button>
            </Popover>
          </div>
        )
      })}
    </ButtonGroup>
  )
}

export default FooterButtonList
