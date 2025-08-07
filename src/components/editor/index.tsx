"use client";
// InitializedMDXEditor.tsx
import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  codeBlockPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  tablePlugin,
  codeMirrorPlugin,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  diffSourcePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { useTheme } from "next-themes";
import "@mdxeditor/editor/style.css";
import { basicDark } from "cm6-theme-basic-dark";
import "./dark-editor.css";

interface Props {
  value: string;
  fieldChange: (content: string) => void;
  viewOnly?: boolean;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
}

// Only import this to the next file
export const Editor = ({ value, fieldChange, editorRef, ...props }: Props) => {
  const { resolvedTheme } = useTheme();
  const themeExtension = resolvedTheme === "dark" ? [basicDark] : [];
  return (
    <MDXEditor
      key={resolvedTheme}
      markdown={value}
      ref={editorRef}
      className="grid border light-border-2 w-full background-light800_dark200 markdown-editor dark-editor"
      onChange={fieldChange}
      {...props}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: "css",
            txt: "txt",
            sql: "sql",
            html: "html",
            sass: "sass",
            scss: "scss",
            bash: "bash",
            json: "json",
            js: "javascript",
            ts: "typescript",
            "": "unspecified",
            tsx: "TypeScript (React)",
            jsx: "JavaScript (React)",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: themeExtension,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <Separator />

                      <BoldItalicUnderlineToggles />
                      <CodeToggle />
                      <Separator />

                      <ListsToggle />
                      <Separator />

                      <CreateLink />
                      <InsertImage />
                      <Separator />

                      <InsertTable />
                      <InsertThematicBreak />
                      <Separator />

                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
    />
  );
};
