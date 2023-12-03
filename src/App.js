import React, { useState } from "react";
import { analyzeImage, isConfigured } from "./azure-image-analysis";

function App() {
  const [url, setUrl] = useState("");
  const [analysisImage, setAnalysisImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const onAnalysisClicked = async () => {
    try {
      new URL(url);
    } catch (e) {
      setErrorMessage("Invalid URL");
      return;
    }

    setLoading(true);
    setAnalysisImage(await analyzeImage(url));
    setLoading(false);
    setErrorMessage(null);
  };

  const PrettyPrintJson = (data) => {
    return (
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  function DisplayResults() {
    if (loading) return <h3 style={{ marginTop: "24px" }}>Loading...</h3>;

    if (errorMessage)
      return <h3 style={{ marginTop: "24px" }}>{errorMessage}</h3>;

    if (analysisImage)
      return (
        <div>
          <h2>Computer Vision Analysis</h2>
          <div>
            <img
              src={analysisImage.URL}
              height="200"
              border="1"
              alt={
                analysisImage.captionResult && analysisImage.captionResult.text
                  ? analysisImage.captionResult.text
                  : "can't find caption"
              }
            />
          </div>
          {PrettyPrintJson(analysisImage)}
        </div>
      );
  }

  if (isConfigured()) {
    return (
      <section>
        <h1>Computer Vision</h1>

        <div className="">
          <label>Insert URL or type prompt:</label>
          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            placeholder="Enter URL to analyze or textual prompt to generate an image"
          />
        </div>

        <div className="action-buttons">
          <button onClick={onAnalysisClicked}>Analyze</button>
          <button>Generate</button>
        </div>

        <DisplayResults />
      </section>
    );
  } else
    return <div>Key and/or endpoint not configured for cognitive services</div>;
}

export default App;
