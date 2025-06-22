import { useState } from "react";
import { TemplateChoiceBar } from "../components/TemplateChoiceBar";
import { TemplateList } from "../components/TemplateList";

export default function TemplateChoice() {
  const [choice, setChoice] = useState(-1);

  const temp_templates = [
    {
      id: 1,
      type: "PSQL",
      name: "Template #1",
      author: "Database Playground",
    },
    {
      id: 2,
      type: "PSQL",
      name: "Students’ Grades",
      author: "Database Playground",
    },
    {
      id: 3,
      type: "PSQL",
      name: "Pizzas and their Prices",
      author: "Database Playground",
    },
    {
      id: 4,
      type: "PSQL",
      name: "Guts & Glory",
      author: "Wraith 1344",
    },
    {
      id: 5,
      type: "PSQL",
      name: "Death logs",
      author: "Morgue",
    },
    {
      id: 6,
      type: "MSQL",
      name: "Students and Classrooms",
      author: "Professor",
    },
  ];

  return (
    <div>
      <TemplateChoiceBar onTemplateChoose={(e) => {
        if(choice < 0) return e.preventDefault();
        console.log(choice);
      }}/>
      <TemplateList data={temp_templates} templateChoice={choice} onTemplateChoiceChange={setChoice} />
    </div>
  );
}