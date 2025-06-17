import { Button } from "./components/ui/Button";
import { MainBar } from "./components/ui/MainBar";

export default function App() {
  return <>
  <div>
      <MainBar></MainBar>

      <Button style={{ width: 200 }} onClick={() => alert("salam bro")}>
        hello bro (ci/cd test)
      </Button>
    </div>
  </>
}