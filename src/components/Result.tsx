import { useLocation } from "react-router-dom";

type State = {
  url: string;
};

export default function Result() {
  const { state }: { state: State } = useLocation();

  return <iframe width="500" height="500" src={state.url}></iframe>;
}
