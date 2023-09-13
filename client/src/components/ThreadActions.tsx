import React, { useEffect, useState } from "react";
import { IThread } from "./ThreadSection";
import axios from "axios";
import { getAxiosConfig } from "../axios_config";
import useThread from "../context/hooks/useThread";

interface Props {
  thread: IThread;
  setLoading: (t: boolean) => void;
  setSubThreadFn: any;
  // like_unlike?: any; //todo
}

const ThreadActions = ({
  thread,
  setLoading,
  setSubThreadFn,
}: // like_unlike,
Props) => {
  const [likes, setLikes] = useState<number>(0);
  let loading = false;
  const url = import.meta.env.VITE_BACK_URL;

  const { updateThread } = useThread();

  useEffect(() => {
    async function fn_fetch() {
      const { data } = await axios(`${url}/thread/likes/${thread.id}`, config);
      setLikes(data);
    }
    fn_fetch();
  }, []);
  const config = getAxiosConfig();
  async function like_unlike(st: IThread) {
    const config = getAxiosConfig();
    setLoading(true);
    const url = import.meta.env.VITE_BACK_URL;
    const { data } = await axios.put(`${url}/thread/like/${st.id}`, {}, config);
    updateThread({} as IThread, 4, data);
    if (data.liked) {
      //likeS
      setLikes(likes + 1);
    } else {
      //dislike
      setLikes(likes - 1);
    }
    setLoading(false);
  }

  // if children.threadparentid == parent.id then parent.push(children)
  function orderSubThreads(
    arr: IThread[],
    data: IThread[], // records
    parentid: number
  ) {
    for (const t of data) {
      let obj = {
        ...t,
        child: [],
      };
      if (t.threadparentid === parentid) {
        arr.push(obj);
        orderSubThreads(obj.child, data, t.id);
      }
    }
    setSubThreadFn(arr);
  }

  async function loadSubThread() {
    setLoading(true);
    const { data } = await axios(`${url}/thread/${thread.id}`, config);
    let tmp_st_arr: IThread[] = [];
    orderSubThreads(tmp_st_arr, data.threads, thread.id);
    setLoading(false);
  }
  return (
    <div className="bg-slate-900 p-2 flex items-center">
      <button
        onClick={loadSubThread}
        className="flex bg-slate-700 p-1 rounded-md items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mx-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        Comments ({thread.st_count})
      </button>
      <button
        onClick={() => like_unlike(thread)}
        disabled={loading}
        className="disabled:!bg-transparent flex"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={loading ? "#efefef10" : thread.liked ? "#e25822" : "none"}
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke={
            loading ? "#efefef20" : thread.liked ? "#e25822" : "currentColor"
          }
          className="w-6 h-6 a-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        <span className="font-semibold">{likes}</span>
      </button>
    </div>
  );
};

export default ThreadActions;
