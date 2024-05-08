import { useEffect, useState } from "react";
import { Sun } from "../icons/sun";
import { Moon } from "../icons/moon";

const ThemeToggle = (): JSX.Element => {
  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") ?? "dark"
      : "light"
  );

  const handleClick = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button onClick={handleClick} id="theme">{theme === "light" ? <Moon /> : <Sun />}</button>
  );
}

export default ThemeToggle;