import { TopBar } from "./TopBar";
import { TopBarElement } from "./TopBarElement";
import { Button } from "./Button";

export function PlaygroundBar(){
    return <TopBar style={{backgroundColor: "#6968FF", color: "white"}} contentStyle={{flexBasis: 404 + "px"}}>
        <TopBarElement>
            <a href="/">
                <Button style={
                        {
                            width: 177 + "px",
                            height: 51.15 + "px",
                            borderRadius: 11 + "px",
                            color: "black",
                            backgroundColor: "white"
                        }
                    }>
                    Back
                </Button>
            </a>
        </TopBarElement>
                <TopBarElement>
            <a href="/playground">
                <Button style={
                        {
                            width: 177 + "px",
                            height: 51.15 + "px",
                            borderRadius: 11 + "px",
                            color: "black",
                            backgroundColor: "white"
                        }
                    }>
                    Start
                </Button>
            </a>
        </TopBarElement>
    </TopBar>
}