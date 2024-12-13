import { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [views, setViews] = useState([]);

    if (isLoading) return <h1>Loading ...</h1>;

    return (
        <div>
            <h1>{views[index]}</h1>
            <button onClick={() => setIndex((prev) => (prev + 1) % views.length)}>
                Next
            </button>
        </div>
    );
}

export default App;
