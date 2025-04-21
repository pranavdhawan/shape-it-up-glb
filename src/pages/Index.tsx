
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ModelViewer from "@/components/ModelViewer";
import { useToast } from "@/hooks/use-toast";

const API_URL = "https://your-backend-url.com/api/generate"; // TODO: replace with your backend endpoint

const Index: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // percent
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Simulated API for demo: Remove and replace with fetch to your backend.
  const fakeGenerateModel = async (prompt: string): Promise<{ glbUrl: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          glbUrl: "https://models.babylonjs.com/CornellBox/cornellBox.glb", // Demo GLB file for placeholder
        });
      }, 3500);
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setProgress(0);
    setGlbUrl(null);
    setDownloadUrl(null);

    // Animate progress bar for fun (simulate model gen progress)
    let fakeProgress = 0;
    pollingRef.current = setInterval(() => {
      fakeProgress = Math.min(98, fakeProgress + Math.random() * 7 + 2);
      setProgress(fakeProgress);
    }, 600);

    try {
      // *** Replace this with a call to your backend API ***
      // const response = await fetch(API_URL, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ prompt }),
      // });
      // if (!response.ok) throw new Error("Generation failed");
      // const data = await response.json();
      // setGlbUrl(data.glbUrl);
      // setDownloadUrl(data.glbUrl);

      // ---- Demo only: ----
      const data = await fakeGenerateModel(prompt);
      setGlbUrl(data.glbUrl);
      setDownloadUrl(data.glbUrl);

      setProgress(100);
      toast({
        title: "Model Ready!",
        description: "Your 3D model is ready to view and download.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(100), 400);
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-slate-100 to-purple-100 px-2">
      <div className="w-full max-w-md rounded-[2rem] shadow-xl bg-white p-8 border animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-4 text-primary drop-shadow-lg">
          Generate a 3D Model
        </h1>
        <p className="mb-4 text-base text-gray-500 text-center">
          Describe the shape you want! Example: <span className="text-primary font-semibold">red aeroplane</span>
        </p>
        <Input
          placeholder="Type a prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          className="mb-4 bg-slate-50"
        />
        <Button
          className="w-full text-base py-2 mb-2 font-semibold rounded-xl hover:scale-105 transition-all"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? "Generating..." : "Generate Model"}
        </Button>
        {loading && (
          <div className="mt-3 mb-2">
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-right mt-1">{Math.floor(progress)}%</div>
          </div>
        )}
        {(glbUrl || loading) && (
          <ModelViewer glbUrl={glbUrl || ""} loading={loading || !glbUrl} />
        )}
        {/* Download button: only while model is generating or loaded */}
        {downloadUrl && (
          <a
            href={downloadUrl}
            download="model.glb"
            className="block mt-3 w-full text-center bg-gradient-to-r from-indigo-400 to-violet-400 text-white font-bold py-2 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Download .glb
          </a>
        )}
      </div>
    </div>
  );
};

export default Index;
