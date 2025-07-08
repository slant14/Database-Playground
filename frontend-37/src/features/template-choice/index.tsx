import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { templateStore } from "@/shared/store/templateStore";
import { TemplateChoiceTopBar } from "./TopBar";
import { TemplateList } from "./TemplateList";
import { API_URL } from "@/config/env";
import { Template } from "./types";

export function TemplateChoice() {
  const [choice, setChoice] = useState<Template | undefined>(undefined);
  const [templates, setTemplates] = useState<Template[]>([]);
  const session_id = localStorage.getItem("session_id");
  const navigate = useNavigate();
  const { updateTemplate } = templateStore();

  useEffect(() => {
    const run = async () => {
      const res = await fetch(API_URL + "/template/", {
        credentials: "include",
      });
      const json = (await res.json()) as Template[];
      setTemplates(json);
    };

    run();
  }, []);

  const onChoice = async (choice: Template) => {
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
        onTemplateChoose={async (e: React.MouseEvent<HTMLElement>) => {
          if (!choice) return e.preventDefault();
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
