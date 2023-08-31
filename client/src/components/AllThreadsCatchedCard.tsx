import React from "react";

const AllThreadsCatchedCard = () => {
  return (
    <div className="flex items-center justify-center p-20">
      <div className="w-fit p-2 border-gradient">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          fill="currentColor"
          className="bi bi-check-lg gradient"
          viewBox="0 0 16 16"
        >
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
          <defs>
            <linearGradient id="MyGradient">
              <stop offset="1%" stop-color="white" />
              <stop offset="95%" stop-color="green" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <p className="flex flex-col text-xl text-gray-300 p-2">
        You have seen all the most recent threads
        <span className="text-sm text-slate-600">
          If you are looking for more, get out of here
        </span>
      </p>
    </div>
  );
};

export default AllThreadsCatchedCard;
