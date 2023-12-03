const key = process.env.REACT_APP_VISION_KEY;
const endPoint = process.env.REACT_APP_VISION_ENDPOINT;

export async function analyzeImage(url) {
  const visualFeatures = [
    "tags",
    "read",
    "caption",
    "denseCaptions",
    "smartCrops",
    "objects",
    "people",
  ];

  const requestUrl = `${endPoint}computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=${visualFeatures.join(
    ","
  )}`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": key,
    },
    body: JSON.stringify({
      url,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Computer Vision request failed: ${response.status} (${response.statusText})`
    );
  }

  const analysis = await response.json();

  return { URL: url, ...analysis };
}

export const isConfigured = () => {
  return key?.length > 0 && endPoint?.length > 0;
};
