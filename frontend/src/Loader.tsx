//Loader.tsx 파일
import { memo } from "react";

const Loader = () => {
  return (
    <div>
      <img src="frontend\src\img\Loading.gif" alt="" />
    </div>
  );
};

export default memo(Loader);
