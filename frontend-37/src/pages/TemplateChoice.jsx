import { useEffect, useState } from "react";
import { TemplateChoiceBar } from "../components/TemplateChoiceBar";
import { TemplateList } from "../components/TemplateList";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

export default function TemplateChoice() {
  const [choice, setChoice] = useState(-1);
  const [templates, setTemplates] = useState([]);
  const session_id = Cookies.get("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const res = await fetch("https://api.dbpg.ru/template", {
        credentials: "include",
      });
      const json = await res.json();
      setTemplates(json);
    };

    run();
  });

  const onChoice = async (choice) => {
    await fetch(`https://api.dbpg.ru/session/info?session_id=${session_id}`, {
      method: "PATCH",
      body: JSON.stringify({
        template: choice,
      }),
      credentials: "include",
    });

    await fetch(`https://api.dbpg.ru/db?session_id=${session_id}`, {
      method: "PUT",
      credentials: "include",
    });

    navigate("/playground");
  };

  return (
    <div>
      <TemplateChoiceBar
        onTemplateChoose={async (e) => {
          if (choice < 0) return e.preventDefault();
          await onChoice(choice);
        }}
      />
      <TemplateList
        data={templates}
        templateChoice={choice}
        onTemplateChoiceChange={setChoice}
      />
    </div>
  );
}

