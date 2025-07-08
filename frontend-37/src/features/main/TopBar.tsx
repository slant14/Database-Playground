import { NavLink } from "react-router";
import { TopBar } from "../../shared/ui/TopBar";
import { TopBarElement } from "../../shared/ui/TopBarElement";
import { Button } from "../../shared/ui/Button";

interface MainTopBarProps {
  onClick: () => void;
}

export function MainTopBar({ onClick }: MainTopBarProps) {
  return (
    <TopBar contentStyle={{ flexBasis: "500px" }}>
      <TopBarElement>
        <NavLink to="/about" end>
          About
        </NavLink>
      </TopBarElement>
      <TopBarElement>
        <NavLink to="/" end>
          Classrooms
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
