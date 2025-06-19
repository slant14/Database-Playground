import { TopBar } from "./TopBar";
import { Button } from "./ui/Button";
import { TopBarElement } from "./TopBarElement";
import { NavLink } from "react-router";

export function MainBar() {
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
        <NavLink to="/playground" end>
          <Button
            style={{
              width: 223.93 + "px",
              height: 51.15 + "px",
              borderRadius: 11 + "px",
            }}
          >
            Playground
          </Button>
        </NavLink>
      </TopBarElement>
    </TopBar>
  );
}

