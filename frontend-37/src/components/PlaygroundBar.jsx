import { TopBar } from "./ui/TopBar";
import { TopBarElement } from "./ui/TopBarElement";
import { Button } from "./ui/Button";
import { NavLink } from "react-router";

import image from "../assets/save.svg";

export function PlaygroundBar() {
  return (
    <TopBar
      style={{ backgroundColor: "#6968FF", color: "white" }}
      contentStyle={{ flexBasis: 521 + "px" }}
    >
      <TopBarElement>
        <NavLink to="/" end>
          <Button
            style={{
              width: 52 + "px",
              height: 51.15 + "px",
              borderRadius: 11 + "px",
              backgroundColor: "white",
            }}
          >
            <img src={image}></img>
          </Button>
        </NavLink>
      </TopBarElement>
      <TopBarElement>
        <NavLink to="/template" end>
          <Button
            style={{
              width: 459 + "px",
              height: 51.15 + "px",
              borderRadius: 11 + "px",
              color: "black",
              backgroundColor: "white",
            }}
          >
            PostgreSQL | Template #1
          </Button>
        </NavLink>
      </TopBarElement>
    </TopBar>
  );
}
