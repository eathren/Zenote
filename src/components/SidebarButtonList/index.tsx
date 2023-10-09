import React from "react";
import { Popover, Button } from "antd";

type ButtonItem = {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  disabled?: boolean;
};

type SidebarButtonListProps = {
  buttonList: ButtonItem[];
};

const SidebarButtonList: React.FC<SidebarButtonListProps> = ({
  buttonList,
}) => {
  return (
    <>
      {buttonList.map((item, index) => (
        <div key={index}>
          <Popover placement="right" title={item.text}>
            <Button
              type="text"
              style={{ width: "100%", marginTop: "10px" }}
              onClick={item.onClick}
              disabled={item.disabled}
            >
              {item.icon}
            </Button>
          </Popover>
        </div>
      ))}
    </>
  );
};

export default SidebarButtonList;
