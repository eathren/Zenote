import React from "react";
import { Button, Popover } from "antd";
import ButtonGroup from "antd/es/button/button-group";

type ButtonItemType = {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  disabled?: boolean;
};

type FooterButtonListProps = {
  buttonList: ButtonItemType[];
};

const FooterButtonList: React.FC<FooterButtonListProps> = ({ buttonList }) => {
  return (
    <ButtonGroup>
      {buttonList.map((item, index) => (
        <div key={index} style={{ margin: "0 5px" }}>
          <Popover placement="top" title={item.text}>
            <Button
              type="text"
              disabled={item.disabled}
              onClick={() => item.onClick()}
            >
              {item.icon}
            </Button>
          </Popover>
        </div>
      ))}
    </ButtonGroup>
  );
};

export default FooterButtonList;
