import { TopBar } from "./TopBar";
import { TopBarElement } from "./TopBarElement";
import { Button } from "./Button";

export function PlaygroundBar(){
    return <TopBar style={{backgroundColor: "#6968FF", color: "white"}} contentStyle={{flexBasis: 521 + "px"}}>
        <TopBarElement>
            <a href="/">
                <Button style={
                        {
                            width: 52 + "px",
                            height: 51.15 + "px",
                            borderRadius: 11 + "px",
                            backgroundColor: "white"
                        }
                    }>
                    <img src="/save.svg"></img>
                </Button>
            </a>
        </TopBarElement>
                <TopBarElement>
            <a href="/playground">
                <Button style={
                        {
                            width: 459 + "px",
                            height: 51.15 + "px",
                            borderRadius: 11 + "px",
                            color: "black",
                            backgroundColor: "white"
                        }
                    }>
                    PostgreSQL | Template #1
                </Button>
            </a>
        </TopBarElement>
    </TopBar>
}