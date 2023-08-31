import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ThreadActions from "./ThreadActions";
import Loading from "./Loading";
import { IThread } from "./ThreadSection";
import axios from "axios";
import { getAxiosConfig } from "../axios_config";
import { FN_UST } from "./Thread";
import moment from "moment";

interface Props {
  subThread: any;
  loading?: boolean;
  updateSubThread: FN_UST;
}

const SubThread = ({ subThread, updateSubThread, loading }: Props) => {
  useEffect(() => {
    console.log(subThread, "<");
  }, []);
  if (loading) return <Loading />;
  return (
    <div>
      {subThread &&
        subThread.map((st: IThread) => (
          <SubThread_Card
            sts={subThread}
            st={st}
            updateSubThread={updateSubThread}
          />
        ))}
    </div>
  );
};

const SubThread_Card = ({
  sts,
  st,
  updateSubThread,
}: {
  sts: IThread[];
  st: IThread;
  updateSubThread: FN_UST;
}) => {
  const [loading, setLoading] = useState(false);
  const [openReplybool, setOpenReplybool] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [updateReplyContent, setUpdateReplyContent] = useState(
    st.content ? st.content : ""
  );
  const [toggleMenu, setToggleMenu] = useState(false);

  useEffect(() => {
    console.log(st);
  }, []);

  //todo: update state
  function openReplyForm() {
    setOpenReplybool(true);
  }
  function closeReplyForm() {
    setOpenReplybool(false);
  }
  //todo: update, delete and likes
  async function handleReplyForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    //do it!
    const config = getAxiosConfig();
    const url = import.meta.env.VITE_BACK_URL;
    const { data } = await axios.post(
      `${url}/thread/new`,
      { content: newReplyContent, parentid: st.id },
      config
    );
    updateSubThread(data, st.id, "CREATE");
    setOpenReplybool(false);
    setLoading(false);
  }

  function handleUpdateForm(e: ChangeEvent<HTMLTextAreaElement>) {
    setUpdateReplyContent(e.target.value);
  }

  async function handleUpdate() {
    setOpenUpdateForm(true);
  }

  async function updateSubThreadSubmit() {
    const config = getAxiosConfig();
    setLoading(true);
    //update
    const url = import.meta.env.VITE_BACK_URL;
    const { data } = await axios.put(
      `${url}/thread/update/${st.id}`,
      { content: updateReplyContent },
      config
    );
    if (data) {
      updateSubThread(data, data.id, "UPDATE");
      setOpenUpdateForm(false);
      setLoading(false);
    }
  }

  function toggleThreadMenu() {
    setToggleMenu(!toggleMenu);
  }

  async function like_unlike() {
    const config = getAxiosConfig();
    setLoading(true);
    const url = import.meta.env.VITE_BACK_URL;
    if (st.liked) {
      //dislike
      const { data } = await axios.put(
        `${url}/thread/like/${st.id}`,
        {},
        config
      );
      updateSubThread(data, data.thread, "LIKE");
    } else {
      //like
      const { data } = await axios.put(
        `${url}/thread/like/${st.id}`,
        {},
        config
      );

      updateSubThread(data, data.thread, "LIKE");
    }
  }

  async function handleRemove() {
    const config = getAxiosConfig();
    const remove: boolean = confirm("Are you sure to delete this thread?");
    if (remove) {
      try {
        const url = import.meta.env.VITE_BACK_URL;
        const { data } = await axios.delete(
          `${url}/thread/delete/sub/${st.id}`,
          config
        );

        console.log({ data });
        updateSubThread(data, data.id, "DELETE");
      } catch (error) {
        console.log(error);
      }
    }
  }
  //todo: unlike
  return (
    <div
      style={{ marginLeft: `${st.deep * 2 + 15}px` }}
      className=" border-slate-500 line-path"
    >
      {/* subthread card */}
      {/* user info */}
      <div className="flex items-end">
        <img
          src={`https://www.gravatar.com/avatar/${st.deep}?d=robohash&f=y&s=128`}
          className="w-8 h-8 rounded-full"
        ></img>
        <div>
          <span>{st.username}</span>
          <span className="px-1">&#183;</span>
          <span className="text-sm text-gray-500">
            {moment(st.created_at).format("lll")}
          </span>
        </div>
      </div>
      {/* subthread info */}
      <div className=" ml-10">
        <div className="flex min-h-[32px]">
          <p>{st.deleted ? "[removed]" : st.content}</p>
        </div>
        <div className="w-full h-5 flex relative">
          <button onClick={like_unlike}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={st.liked ? "#e25822" : "none"}
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke={st.liked ? "#e25822" : "currentColor"}
              className="w-6 h-6 a-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
          <button onClick={openReplyForm} className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 a-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
            <span className="text-slate-400">Reply</span>
          </button>
          <button onClick={toggleThreadMenu} className="px-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>
          {toggleMenu ? (
            <ThreadMenu
              st={sts}
              id={st.id}
              handleUpdate={handleUpdate}
              handleRemove={handleRemove}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      {/* child */}
      {openUpdateForm ? (
        <div className="fixed w-full h-screen z-10 top-0 left-0 overflow-y-hidden flex items-center justify-center bg-[#0f0f0f90]">
          <div className="h-1/2 w-1/2 bg-slate-900 rounded flex flex-col items-start justify-around">
            <div className="text-end w-full">
              <button onClick={() => setOpenUpdateForm(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <label htmlFor="content" className="text-lg py-3 px-5">
              Content
            </label>
            <textarea
              onChange={handleUpdateForm}
              name="content"
              id="content"
              value={updateReplyContent}
              className="w-[90%] mx-auto mt-10 mb-2 h-[50%] rounded bg-slate-950 outline-none p-2"
            ></textarea>
            <div className="flex justify-end px-4 w-full">
              <button
                onClick={updateSubThreadSubmit}
                className="bg-indigo-900 px-2 py-1 rounded mb-2 flex items-center text-center"
              >
                {loading ? <Loading custom="w-8 h-8" /> : "Update"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {openReplybool ? (
        <form
          onSubmit={handleReplyForm}
          className="flex flex-col items-center line-path ml-5 before:top-0 before:h-full"
        >
          <textarea
            onChange={(e) => setNewReplyContent(e.target.value)}
            className="w-[90%] h-40 my-2 border-slate-950 border rounded outline-none p-2"
          ></textarea>
          <div className="w-[90%] text-end">
            <button onClick={closeReplyForm} className="mx-2 text-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-slate-950 text-slate-200 px-2 py-1 rounded-md"
            >
              {loading ? <Loading custom="w-8 h-8" /> : "Comment"}
            </button>
          </div>
        </form>
      ) : (
        ""
      )}

      <T st={st} updateSubThread={updateSubThread} />
    </div>
  );
};

const ThreadMenu = ({
  st,
  id,
  handleUpdate,
  handleRemove,
}: {
  st: IThread[];
  id: number;
  handleUpdate: () => void;
  handleRemove: () => void;
}) => {
  return (
    <div className="flex z-10 flex-col absolute bg-slate-800 p-2 left-32 top-5">
      <button
        onClick={handleUpdate}
        className="text-sm font-bold hover:text-orange-500"
      >
        Update
      </button>
      <button
        onClick={handleRemove}
        className="text-sm font-bold hover:text-red-500"
      >
        Remove
      </button>
    </div>
  );
};

const T = ({ st, updateSubThread }: { st: IThread; updateSubThread: any }) => {
  return (
    <>
      <SubThread subThread={st.child} updateSubThread={updateSubThread} />
    </>
  );
};

export default SubThread;
