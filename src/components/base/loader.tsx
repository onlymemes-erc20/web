import { Update } from "../icons/update";

type LoaderProps = {
  width: number;
  height: number;
};
export const Loader = ({ width, height }: LoaderProps) => (
  <div>
    <Update width={width} height={height} />
    <span className="sr-only">Loading...</span>
  </div>
);
