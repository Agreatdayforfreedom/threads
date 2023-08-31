import React from "react";

interface Props {
  custom?: string;
}
const Loading = ({ custom }: Props) => (
  <div className={`loader ${custom}`}></div>
);

export default Loading;
