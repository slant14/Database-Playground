import { TopBar } from "./TopBar";
import { TopBarElement } from "./TopBarElement";
import { Button } from "./Button";

export function MainBar(){
    return <TopBar>
        <TopBarElement><a href="/">Main</a></TopBarElement>
        <TopBarElement><a href="/about">About</a></TopBarElement>
        <TopBarElement>
            <a href="/playground">
                <Button style={{width: 223.93 + "px", height: 51.15 + "px", borderRadius: 11 + "px"}}>Playground</Button>
            </a>
        </TopBarElement>
    </TopBar>
}