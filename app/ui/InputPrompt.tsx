"use client";

import { useState, useRef, useContext } from "react";
import { PaperPlaneIcon, ImageIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import {useModelContext} from "@/app/store/ContextProvider";
import Image from 'next/image'

const imageModels = ["llava", "llava-llama3", "llama3.2-vision", "minicpm-v", "moondream", "bakllava", "llava-phi3"];

const InputPrompt = ({ onSendMessage, handleCancelRequest }: { onSendMessage: (message: string, model: string, image: File | null) => void, handleCancelRequest: () => void }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const role = "user";
  const { model, loading } = useModelContext()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSendMessage(prompt, model, image);
    setImage(null);
    setPrompt("");
    resetHeight();
  };

  const isImageSupported = (model: string): boolean => {
    return imageModels.some(imgModel => model.startsWith(imgModel));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
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
      const maxScrollHeight = 164;
      if (textareaRef.current.scrollHeight > maxScrollHeight) {
        textareaRef.current.style.height = `${maxScrollHeight}px`;
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
      className={`relative bg-white text-sm w-full border rounded-3xl py-3 pl-12 pr-14 shadow-[0_4px_5px_-2px_rgb(0,0,0,0.1)] focus:shadow-[0_4px_5px_-1px_rgb(0,0,0,0.1)]`}
    >
      {image && (
        <div className="relative w-min min-w-24 min-h-16 mb-4">
          <Image
            src={URL.createObjectURL(image!)}
            alt={image.name}
            width={75}
            height={75}
            className="rounded-md w-full h-full"
          />
          <CrossCircledIcon onClick={() => {setImage(null)}} className="absolute -top-1.5 -right-1.5 w-5 h-5 text-white cursor-pointer bg-black rounded-full" />
        </div>
      )}

      <input type="text" name="role" value={role} readOnly className="hidden" />
      <label
        htmlFor="image"
        className={`absolute bottom-2.5 left-3 p-2 w-8 h-8 rounded-full flex items-center justify-center 
    ${isImageSupported(model) ? "hover:bg-gray-200 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-neutral-700" />
          {!isImageSupported(model) && (
            <div className="absolute w-7 h-0.5 bg-neutral-700 rotate-45"></div>
          )}
        </div>
      </label>
      <input
        type="file"
        accept="image/*"
        name="image"
        id="image"
        className="hidden"
        onChange={handleImageChange}
        disabled={!isImageSupported(model)}
      />

      <textarea
        ref={textareaRef}
        className="w-full h-auto overflow-y-auto leading-5 resize-none focus:outline-none textarea-custom"
        name="text"
        spellCheck="false"
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
          className="absolute bottom-2.5 right-3 bg-black cursor-pointer hover:opacity-80 p-2 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <div className="bg-white aspect-square w-[0.6rem]"></div>
        </button>
      ) : (
        <button
          type="submit"
          className="absolute bottom-2.5 right-3 bg-black cursor-pointer hover:opacity-80 p-2 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <PaperPlaneIcon className="text-white w-full h-full ml-[2px]" />
        </button>
      )}
    </form>
  );
};

export default InputPrompt;
