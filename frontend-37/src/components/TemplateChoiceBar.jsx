import { TopBar } from "./ui/TopBar";
import { TopBarElement } from "./ui/TopBarElement";
import { Button } from "./ui/Button";
import { NavLink } from "react-router";

export function TemplateChoiceBar({ onTemplateChoose }) {
  return (
    <TopBar
      style={{ backgroundColor: "#6968FF", color: "white" }}
      contentStyle={{ flexBasis: 404 + "px" }}
    >
      <TopBarElement>
        <NavLink to="/" end>
          <Button
            style={{
              width: 177 + "px",
              height: 51.15 + "px",
              borderRadius: 11 + "px",
              color: "black",
              backgroundColor: "white",
              fontFamily: `"Onest", sans-serif`,
              fontSize: 24 + "px"
            }}
          >
            Back
          </Button>
        </NavLink>
      </TopBarElement>
      <TopBarElement>
        <NavLink to="/playground" onClick={onTemplateChoose} end>
          <Button
            style={{
              width: 177 + "px",
              height: 51.15 + "px",
              borderRadius: 11 + "px",
              color: "black",
              backgroundColor: "white",
              fontFamily: `"Onest", sans-serif`,
              fontSize: 24 + "px"
            }}
          >
            Start
          </Button>
        </NavLink>
      </TopBarElement>
    </TopBar>
  );
}
