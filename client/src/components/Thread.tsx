import React, { useEffect, useState } from "react";
import { IThread, UpdateState } from "./ThreadSection";
import moment from "moment";
import ThreadActions from "./ThreadActions";
import SubThread from "./SubThread";

interface Props {
  setUpdate: (state: UpdateState) => void;
  setOpen: (state: boolean) => void;
  thread: any;
}

export type FN_UST = (
  // obj: IThread,
  new_obj: IThread,
  id: number,
  type: "UPDATE" | "CREATE" | "DELETE" | "LIKE"
) => void;

const Thread = ({ thread, setUpdate, setOpen }: Props) => {
  const [loading, setLoading] = useState(false);
  const [subThreads, setSubThreads] = useState<IThread[]>([]); //should be on a global

  function handleUpdate(id: number, content: string) {
    setOpen(true);
    setUpdate({ id, content });
  }

  function updateSubThread(
    // obj: IThread,
    new_obj: IThread,
    id: number, // thread id to update
    type: "UPDATE" | "CREATE" | "DELETE" | "LIKE"
  ) {
    setLoading(true);
    let tmp = [...subThreads];

    //update
    if (type === "UPDATE") {
      const arr = a(tmp, id, new_obj);
      setSubThreads(arr);
    } else if (type === "CREATE") {
      //add new item
      const arr = iterate(tmp, id, new_obj);
      setSubThreads(arr);
    } else if (type === "DELETE") {
      const arr = a(tmp, id, new_obj);
      setSubThreads(arr);
    } else if (type === "LIKE") {
      const arr = a(tmp, id, new_obj);
      setSubThreads(arr);
    } else console.log("Invalid type");
    setLoading(false);
  }

  function iterate(arr: IThread[], id: number, obj: IThread) {
    arr.map((st) => {
      //set deep if not exists
      if (!obj.deep) obj.deep = st.deep + 1;
      if (st.id === id) st.child.push(obj);
      if (st.child && st.child.length > 0) iterate(st.child, id, obj);
    });
    return arr;
  }

  function a(arr: IThread[], id: number, update: Partial<Omit<IThread, "id">>) {
    arr.map((st: IThread) => {
      //update the state of subthreads !
      if (st.id === id && update.content) {
        st.content = update.content;
      }
      if (st.id === id && update.deleted) {
        st.deleted = true;
      }
      if (st.id === id && typeof update.liked === "boolean") {
        st.liked = update.liked;
      }
      if (st.child.length > 0) a(st.child, id, update);
    });
    return arr;
  }

  async function handleDelete(id: number) {
    const remove: boolean = confirm("Are you sure to delete this thread?");
    if (remove) {
      console.log("delete");
    } else {
      console.log("no delete");
    }
  }

  function setSubThreadFn(thread: any) {
    setSubThreads(thread);
  }
  // useEffect(() => {
  //   console.log(subThreads, ">,<");
  // }, [subThreads]);
  return (
    <div className="border my-3 p-2 rounded border-slate-600 pt-4">
      <div className="  flex justify-between  border-slate-600">
        <div className="w-full flex flex-col">
          <div className="flex justify-end items-center">
            <button
              className="px-1 text-orange-500"
              onClick={() => handleUpdate(thread.id, thread.content)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 edit-svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </button>
            <button
              className="px-1 text-red-500"
              onClick={() => handleDelete(thread.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 delete-svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>

          <div className="text-start">
            <span className="p-1 text-slate-400 text-sm">
              {moment(thread.created_at).format("LT")}
            </span>
            <span className="p-1 text-slate-400">{thread.username}</span>
            <p className="w-full min-h-[120px] p-2 rounded bg-slate-800">
              {thread.content}
            </p>
          </div>
        </div>
      </div>
      <ThreadActions
        thread={thread}
        setSubThread={setSubThreadFn}
        setLoading={setLoading}
      />
      <CommentForm />
      <SubThread
        subThread={subThreads}
        updateSubThread={updateSubThread}
        loading={loading}
      />
    </div>
  );
};

function CommentForm() {
  return (
    <div className="bg-red py-3">
      <form className="flex items-end">
        <textarea
          className="!border-b rounded-b-none mr-2 h-[30px] !w-full !text-start  p-1 rounded focus:h-32 focus:outline-none focus:!border-indigo-800 transition-all"
          placeholder="Leave a comment"
          name=""
          id=""
        ></textarea>
        <button className="bg-indigo-800 p-1 rounded text-sm hover:bg-indigo-700 transition-colors">
          Post
        </button>
      </form>
    </div>
  );
}

export default Thread;
