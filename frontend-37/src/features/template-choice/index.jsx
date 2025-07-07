import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { templateStore } from "../../shared/store/templateStore";
import { TemplateChoiceTopBar } from "./TopBar";
import { TemplateList } from "./TemplateList";
import { API_URL } from "../../config/env";

export function TemplateChoice() {
  const [choice, setChoice] = useState(-1);
  const [templates, setTemplates] = useState([]);
  const session_id = localStorage.getItem("session_id");
  const navigate = useNavigate();
  const { updateTemplate } = templateStore();

  useEffect(() => {
    const run = async () => {
      const res = await fetch(API_URL + "/template/", {
        credentials: "include",
      });
      const json = await res.json();
      setTemplates(json);
    };

    run();
  }, []);

  const onChoice = async (choice) => {
    await fetch(`${API_URL}/session/info/?session_id=${session_id}`, {
      method: "PATCH",
      body: JSON.stringify({
        template: choice.id,
      }),
      credentials: "include",
    });

    await fetch(`${API_URL}/db/?session_id=${session_id}`, {
      method: "PUT",
      credentials: "include",
    });
    updateTemplate(choice.name);

    navigate("/playground");
  };

  return (
    <div>
      <TemplateChoiceTopBar
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
