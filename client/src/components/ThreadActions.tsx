import React from "react";
import { IThread } from "./ThreadSection";
import axios from "axios";
import { getAxiosConfig } from "../axios_config";

interface Props {
  thread: IThread;
  setSubThread: (t: any) => void;
  setLoading: (t: boolean) => void;
}
//! let arr = [];
// function recursive(arr, deep, c_deep, rand) {
//   if(c_deep === deep) return;
//   let obj = {
//   id: c_deep + 1,
//   child: []
//   }
//   for(let i = 0; i < rand; i++) {
//     arr.push(obj)
//   }
//   // try to push a
//   arr.push(obj);
//   recursive(obj.child, deep, c_deep + 1, Math.floor(Math.random() * 10));
// }
//! recursive(arr, 10, 1, Math.floor(Math.random() * 10))

// type Child = { id?: number; deep: number } | Omit<Tree, "main_id">;
// interface
const ThreadActions = ({ thread, setSubThread, setLoading }: Props) => {
  const config = getAxiosConfig();

  //what is the condition to make a thread children of its parent
  // if children.threadparentid == parent.id then parent.push(children)
  //
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
    setSubThread(arr);
  }

  async function loadSubThread() {
    const url = import.meta.env.VITE_BACK_URL;

    setLoading(true);
    const { data } = await axios(`${url}/thread/${thread.id}`, config);
    let tmp_st_arr: IThread[] = [];
    orderSubThreads(tmp_st_arr, data.threads, thread.id);
    setLoading(false);
  }

  return (
    <div className="bg-slate-900 p-2">
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
        Comments
      </button>
    </div>
  );
};

export default ThreadActions;
