import { TopBar } from "./ui/TopBar";
import { TopBarElement } from "./ui/TopBarElement";
import { Button } from "./ui/Button";
import { NavLink } from "react-router";
import saveSvg from "../assets/save.svg";
import { useTemplate } from "../hooks/useTemplate";

export function PlaygroundBar() {
  const { template } = useTemplate();
  return (
    <TopBar
      style={{
        backgroundColor: "#6968FF",
        color: "white",
        borderRadius: `${22}px ${22}px ${0}px ${0}px`,
      }}
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
            <img src={saveSvg} alt="Save button"></img>
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
              fontFamily: `"Onest", sans-serif`,
              fontSize: 24 + "px",
            }}
          >
            {template}
          </Button>
        </NavLink>
      </TopBarElement>
    </TopBar>
  );
}
