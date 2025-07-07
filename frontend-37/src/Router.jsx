import { Route, Routes } from "react-router";
import { Main } from "./features/main";
import { TemplateChoice } from "./features/template-choice";
import { Playground } from "./features/playground";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/template" element={<TemplateChoice />} />
      <Route path="/playground" element={<Playground />} />
    </Routes>
  );
}
