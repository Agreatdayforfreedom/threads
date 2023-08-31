import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { getAxiosConfig } from "../axios_config";
import Loading from "./Loading";
import { IThread } from "./ThreadSection";

interface Props {
  open: boolean;
  close: () => void;
  update?: {
    id?: number;
    content?: string;
  };
  updateState: (thread: IThread, type: number) => void;
}

const ThreadForm = ({
  open,
  close,
  update, //update mode
  updateState, // update thread state
}: Props) => {
  const [content, setContent] = useState<string>(
    update?.content ? update.content : ""
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const config = getAxiosConfig();
    setLoading(true);
    if (update && update.id) {
      //update
      const url = import.meta.env.VITE_BACK_URL;
      const { data } = await axios.put(
        `${url}/thread/update/${update.id}`,
        { content },
        config
      );
      updateState(data, 2);
      setContent("");
    } else {
      //create
      const url = import.meta.env.VITE_BACK_URL;
      const { data } = await axios.post(
        `${url}/thread/new`,
        { content },
        config
      );
      updateState(data, 1);
      setContent("");
    }
    close();
    setLoading(false);
  }

  // if (loading) return <p className="fixed top-0 "></p>;
  return (
    <div className="absolute bg-neutral-900 w-[40%] h-[40%] rounded left-0 top-0 right-0 bottom-0 m-auto">
      <div className="text-end">
        <button
          onClick={close}
          className="m-2 bg-gray-500 px-2 rounded-full text-gray-700"
        >
          x
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-around p-3 bg-slate-900 h-3/4"
      >
        <div className="flex flex-col items-start">
          <label htmlFor="content" className="text-slate-300 ">
            Content
          </label>
          <input
            className="p-1 rounded"
            autoFocus
            type="text"
            id="content"
            defaultValue={update?.content ? update.content : content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex item-center justify-end">
          <button
            disabled={loading}
            type="submit"
            className="bg-teal-600 p-2  rounded mt-1 flex items-center justify-center"
          >
            {loading ? (
              <Loading custom="!w-6 !h-6 !border-2" />
            ) : update?.id ? (
              "Update"
            ) : (
              "New"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ThreadForm;
