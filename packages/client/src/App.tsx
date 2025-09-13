import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="p-4">
      <p className="font-bold text-cyan-300 p-4">{message} </p>
      <Button>Click me</Button>
    </div>
  );
}

export default App;
