import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import Playground from "./pages/Playground";
import TemplateChoice from "./pages/TemplateChoice";
import About from "./pages/About";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/template" element={<TemplateChoice />} />
      <Route path="/playground" element={<Playground />} />
    </Routes>
  );
}
