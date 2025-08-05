"use client";

import React, { useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface JoditEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function Editor({ value, onChange }: JoditEditorProps) {
  const editor = useRef<any>(null);
  const { theme } = useTheme();

  const config = useMemo(
    () => ({
      readonly: false,
      height: 200,
      toolbarButtonSize: "middle" as "middle",
      theme: theme === "dark" ? "dark" : "default",
      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
      },
      toolbarSticky: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "link",
        "unlink",
        "|",
        "image",
        "|",
        "undo",
        "redo",
      ],
    }),
    [theme]
  );

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      onChange={onChange}
      className="rounded border border-gray-300 dark:border-gray-600"
    />
  );
}
