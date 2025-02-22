"use client";

import { useState, useRef, useContext } from "react";
import { PaperPlaneIcon, UploadIcon } from "@radix-ui/react-icons";
import ModelContext from "@/app/store/ContextProvider";

const InputPrompt = ({ onSendMessage, handleCancelRequest }: { onSendMessage: (message: string, model: string) => void, handleCancelRequest: () => void }) => {
  const [prompt, setPrompt] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const role = "user";
  const { model, loading } = useContext(ModelContext)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSendMessage(prompt, model);
    setPrompt("");
    resetHeight();
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    adjustHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim()) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Ukuran default
      if (textareaRef.current.scrollHeight > 164) {
        textareaRef.current.style.height = `${164}px`;
        return;
      }
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Ukuran default
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="relative w-full border rounded-3xl py-3 pl-12 pr-14 shadow-[0_4px_5px_-2px_rgb(0,0,0,0.1)] focus:shadow-[0_4px_5px_-1px_rgb(0,0,0,0.1)]"
    >
      <input type="text" name="role" value={role} readOnly className="hidden" />
      <label
        htmlFor="file"
        className="absolute bottom-2.5 left-3 hover:bg-[rgb(210,210,210)] hover:cursor-pointer p-2 w-8 h-8 rounded-full flex items-center justify-center"
      >
        <UploadIcon className="w-6 h-6 text-neutral-700" />
      </label>
      <input type="file" name="file" id="file" className="hidden" />
      <textarea
        ref={textareaRef}
        className="w-full h-auto overflow-y-auto leading-5 resize-none focus:outline-none textarea-custom"
        name="text"
        placeholder="Your Prompt Here"
        autoFocus
        rows={1}
        value={prompt}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      />
      {loading ? (
        <button
          onClick={handleCancelRequest}
          className="absolute bottom-2.5 right-3 bg-black hover:cursor-pointer hover:bg-neutral-600 p-2 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <div className="bg-white aspect-square w-[0.6rem]"></div>
        </button>
      ) : (
        <button
          type="submit"
          className="absolute bottom-2.5 right-3 bg-black hover:cursor-pointer hover:bg-neutral-600 p-2 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <PaperPlaneIcon className="text-white w-full h-full ml-[2px]" />
        </button>
      )}
    </form>
  );
};

export default InputPrompt;
