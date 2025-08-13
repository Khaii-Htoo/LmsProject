import { Award, BookOpen, Rocket, Users } from "lucide-react";

export const featureKeyData = [
  {
    title: "Rich Course Builder",
    description:
      "Create multimedia lessons, quizzes, and assignments with ease.",
    Icon: BookOpen,
  },
  {
    title: "Certificates & Progress",
    description: "Track progress, issue certificates, and motivate learners.",
    Icon: Award,
  },
  {
    title: "Community & Cohorts",
    description: "Foster discussions and manage cohorts at scale.",
    Icon: Users,
  },
  {
    title: "Fast & Secure",
    description: "Optimized performance with secure, reliable infrastructure.",
    Icon: Rocket,
  },
];

export const Categories = [
  "4 Skill",
  "Speaking & Listening",
  "Writing & Reading",
];

export const levels = ["Begineer", "Intermediate", "Advanced"];

export const status = ["Draft", "Published", "Archived"];

export const richTextEditorModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],

    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ],
};

export const richTextEditorFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];
