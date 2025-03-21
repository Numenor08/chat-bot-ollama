"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { PaperPlaneIcon, ImageIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import { useModelContext } from "@/app/store/ContextProvider"
import Image from "next/image"

const imageModels = ["llava", "llava-llama3", "llama3.2-vision", "minicpm-v", "moondream", "bakllava", "llava-phi3"]

const InputPrompt = ({
  onSendMessage,
  handleCancelRequest,
}: {
  onSendMessage: (message: string, model: string, image: File | null) => void
  handleCancelRequest: () => void
}) => {
  const [prompt, setPrompt] = useState<string>("")
  const [image, setImage] = useState<File | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const role = "user"
  const { model, loading } = useModelContext()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!prompt.trim()) return
    onSendMessage(prompt, model, image)
    setImage(null)
    setPrompt("")
    resetHeight()
  }

  const isImageSupported = (model: string): boolean => {
    return imageModels.some((imgModel) => model.startsWith(imgModel))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    adjustHeight()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (prompt.trim()) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
      }
    }
  }

  const adjustHeight = () => {
    if (!textareaRef.current || !hiddenTextareaRef.current) return

    hiddenTextareaRef.current.value = textareaRef.current.value

    const baseHeight = 1.25
    hiddenTextareaRef.current.style.height = `${baseHeight}rem`

    const contentHeight = hiddenTextareaRef.current.scrollHeight
    const maxScrollHeight = baseHeight * 16 * 8 // 10rem

    if (contentHeight > maxScrollHeight) {
      textareaRef.current.style.height = `${baseHeight * 8}rem`
      textareaRef.current.style.overflowY = "auto"
    } else {
      textareaRef.current.style.height = `${contentHeight}px`
      textareaRef.current.style.overflowY = "hidden"
    }
  }

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `1.25rem`
      adjustHeight()
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [prompt])

  useEffect(() => {
    adjustHeight()
  }, [])

  return (
    <div className="w-full pb-4 px-3">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`relative bg-white text-sm w-full border rounded-3xl py-3 pl-12 pr-14 shadow-[0_4px_5px_-2px_rgb(0,0,0,0.1)] focus:shadow-[0_4px_5px_-1px_rgb(0,0,0,0.1)]`}
      >
        {image && (
          <div className="relative w-min min-w-24 min-h-16 mb-4">
            <Image
              src={URL.createObjectURL(image!) || "/placeholder.svg"}
              alt={image.name}
              width={75}
              height={75}
              className="rounded-md w-full h-full"
            />
            <CrossCircledIcon
              onClick={() => {
                setImage(null)
              }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 text-white cursor-pointer bg-black rounded-full"
            />
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
            {!isImageSupported(model) && <div className="absolute w-7 h-0.5 bg-neutral-700 rotate-45"></div>}
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
          className="w-full bg-white transition-height overflow-y-auto leading-5 resize-none focus:outline-none bg-transparent"
          name="text"
          spellCheck="false"
          placeholder="Your Prompt Here"
          autoFocus
          rows={1}
          value={prompt}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />

        {/* Hidden textarea for measuring content height */}
        <textarea
          ref={hiddenTextareaRef}
          aria-hidden="true"
          tabIndex={-1}
          className="absolute opacity-0 top-0 left-0 h-0 pointer-events-none overflow-hidden w-full leading-5 resize-none"
          style={{
            visibility: "hidden",
            padding: textareaRef.current ? window.getComputedStyle(textareaRef.current).padding : "0px",
            width: textareaRef.current ? `${textareaRef.current.clientWidth}px` : "100%",
          }}
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
    </div>
  )
}

export default InputPrompt

