import React, { useEffect, useState } from "react";
import { getAxiosConfig } from "../axios_config";
import axios from "axios";
import moment from "moment";
import ThreadForm from "./ThreadForm";
import Loading from "./Loading";
import AllThreadsCatchedCard from "./AllThreadsCatchedCard";
import ThreadActions from "./ThreadActions";
import SubThread from "./SubThread";
import Thread from "./Thread";
import useThread from "../context/hooks/useThread";

// export interface Thread {
//   id: number;
//   content: string;
//   username: string;
//   userid: number;
//   path_content_uid: string;
//   created_at: Date;
// }

export interface IThread {
  id: number;
  content: string;
  deep: number;
  threadparentid: number;
  node_path: string;
  created_at: string;
  userid: number;
  username: string;
  deleted: boolean;
  updated: boolean;
  liked: boolean;
  child: IThread[];
}

export interface UpdateState {
  content: string;
  id: number;
}

const ThreadSection = () => {
  const [update, setUpdate] = useState<UpdateState>({} as UpdateState);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [stopFetch, setStopFetch] = useState(false);

  const { threads, handleThreadsState } = useThread();

  async function fetchData() {
    setisLoading(true);
    const config = getAxiosConfig();
    const url = import.meta.env.VITE_BACK_URL;
    const { data } = await axios(`${url}/thread?page=${page}`, config);
    // console.log({ data }, "data");
    handleThreadsState([...threads, ...data]);
    if (data.length + threads.length === data[1]) {
      setStopFetch(true);
      setisLoading(false);
    }
    setPage(page + 1);
    setisLoading(false);
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading ||
      stopFetch
    ) {
      return;
    }
    console.log(window.innerHeight);
    fetchData();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  function close() {
    setOpen(false);
  }

  function handleCreate() {
    setOpen(!open);
    setUpdate({} as UpdateState);
  }

  useEffect(() => console.log(threads), []);

  function updateState(thread: IThread, type: number) {
    //1: create, 2: update, 3: delete
    if (type === 1) {
      handleThreadsState([thread, ...threads]);
    } else if (type === 2) {
      const updateThread = threads.map((item) => {
        if (item.id === thread.id) {
          return thread;
        }
        return item;
      });
      handleThreadsState(updateThread);
    } else if (type === 3) {
      handleThreadsState([...threads.filter((t) => t.id !== thread.id)]);
    } else {
      console.log(`Error invalid ${type} type`);
    }
  }

  return (
    <section className=" flex flex-col items-center ">
      <div className="w-full text-end">
        <button
          className="px-2 py-1 mx-2 bg-teal-600 rounded"
          onClick={handleCreate}
        >
          New thread
        </button>
      </div>
      <div className="mt-3 w-3/4">
        {threads &&
          threads.map((thread: IThread, i: number) => (
            <Thread thread={thread} setUpdate={setUpdate} setOpen={setOpen} />
          ))}
      </div>

      {isLoading && <Loading />}
      {stopFetch ? <AllThreadsCatchedCard /> : ""}
      {open ? (
        <ThreadForm
          open={open}
          close={close}
          update={update}
          updateState={updateState}
        />
      ) : (
        ""
      )}
    </section>
  );
};

export default ThreadSection;
