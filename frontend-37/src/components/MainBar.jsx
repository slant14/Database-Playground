import { TopBar } from "./ui/TopBar";
import { Button } from "./ui/Button";
import { TopBarElement } from "./ui/TopBarElement";
import { NavLink } from "react-router";

export function MainBar({ onClick }) {
  return (
    <TopBar>
      <TopBarElement>
        <NavLink to="/" end>
          Main
        </NavLink>
      </TopBarElement>
      <TopBarElement>
        <NavLink to="/about" end>
          About
        </NavLink>
      </TopBarElement>
      <TopBarElement>
        <Button
          style={{
            width: 223.93 + "px",
            height: 51.15 + "px",
            borderRadius: 11 + "px",
            fontFamily: `"Onest", sans-serif`,
            fontSize: 24 + "px",
          }}
          onClick={onClick}
        >
          Playground
        </Button>
      </TopBarElement>
    </TopBar>
  );
}
