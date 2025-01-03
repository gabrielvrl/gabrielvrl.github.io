import { useEffect, useState } from "react";

type Props = {
  text: string;
  textClassName?: string;
};

const TypingEffect = ({ text, textClassName = "" }: Props) => {
  const [ellipsis, setEllipsis] = useState("");

  useEffect(() => {
    const states = ["", ".", "..", "..."];
    let index = 0;

    const interval = setInterval(() => {
      setEllipsis(states[index]);
      index = (index + 1) % states.length;
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <span className={`${textClassName} text-4xl dark:text-white`}>
        {text + ellipsis}
      </span>
    </div>
  );
};

export default TypingEffect;
