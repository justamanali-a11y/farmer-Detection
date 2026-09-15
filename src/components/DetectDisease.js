import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileImage,
  ImagePlus,
  Leaf,
  Loader2,
  ScanSearch,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PageHeader, PageIntro } from "./PageChrome";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";

function severityVariant(severity) {
  const value = String(severity || "").toLowerCase();

  if (value.includes("healthy") || value.includes("low")) {
    return "healthy";
  }

  if (value.includes("severe") || value.includes("high")) {
    return "severe";
  }

  return "moderate";
}

function DetectDisease({ onBack }) {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      setImageName(file.name);
      setResult(null);
    }
  };

  const detectCrop = () => {
    if (!image) return;

    setLoading(true);

    setTimeout(() => {
      setResult({
        crop: "Tomato",
        disease: "Early Blight",
        confidence: "94%",
        severity: "Moderate",
        recommendation:
          "Remove infected leaves, improve air circulation and avoid overhead watering. Use suitable fungicide if required.",
      });

      setLoading(false);
    }, 1500);
  };

  const removeImage = () => {
    setImage(null);
    setImageName("");
    setResult(null);
  };

  const confidenceValue = result
    ? parseInt(String(result.confidence), 10) || 0
    : 0;

  return (
    <div className="fd-page">
      <PageHeader onBack={onBack} />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
        <PageIntro
          eyebrow="Crop health check"
          title="Detect crop disease"
          subtitle="Upload a clear leaf photo. We keep the same detection process — this screen just makes the result easier to read."
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <Card>
            <CardContent className="p-5 sm:p-8">
              <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-farm-300 bg-farm-50/60 p-8 text-center transition-all duration-300 hover:border-farm-500 hover:bg-farm-50 sm:p-10">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-farm-600 shadow-soft">
                  <ImagePlus className="h-6 w-6" />
                </div>

                <p className="text-lg font-bold text-farm-800">
                  Click to upload crop image
                </p>

                <p className="mt-2 text-sm text-stone-500">
                  JPG, PNG or JPEG · well-lit leaf photos work best
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>

              {image && (
                <div className="mt-6">
                  <div className="overflow-hidden rounded-2xl border border-farm-100 bg-stone-50 p-2">
                    <img
                      src={image}
                      alt="Crop Preview"
                      className="mx-auto h-64 w-full max-w-lg rounded-xl object-cover"
                    />
                  </div>

                  <p className="mt-3 flex items-center justify-center gap-2 truncate text-sm text-stone-500">
                    <FileImage className="h-4 w-4" />
                    {imageName}
                  </p>

                  {loading && (
                    <div className="mx-auto mt-5 max-w-md rounded-2xl border border-farm-200 bg-farm-50 px-4 py-3 text-sm font-medium text-farm-800">
                      <Loader2 className="mr-2 inline h-4 w-4 animate-spin align-middle" />
                      Analysing your crop image…
                    </div>
                  )}

                  <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button
                      type="button"
                      onClick={detectCrop}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Detecting...
                        </>
                      ) : (
                        <>
                          <ScanSearch />
                          Detect Disease
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={removeImage}
                    >
                      <Trash2 />
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {result && (
                  <motion.div
                    className="mt-8 rounded-2xl border border-farm-100 bg-farm-50 p-5 sm:p-6"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="flex items-center gap-2 text-xl font-extrabold text-farm-800 sm:text-2xl">
                        <CheckCircle2 className="h-5 w-5" />
                        Detection Result
                      </h3>
                      <Badge variant={severityVariant(result.severity)}>
                        {result.severity}
                      </Badge>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                      <div className="rounded-xl border border-farm-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Crop
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-lg font-bold text-farm-900">
                          <Leaf className="h-4 w-4 text-farm-600" />
                          {result.crop}
                        </p>
                      </div>

                      <div className="rounded-xl border border-red-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Disease
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-lg font-bold text-red-600">
                          <ShieldAlert className="h-4 w-4" />
                          {result.disease}
                        </p>
                      </div>

                      <div className="rounded-xl border border-farm-100 bg-white p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Confidence
                        </p>
                        <p className="mb-2 text-lg font-bold text-farm-800">
                          {result.confidence}
                        </p>
                        <Progress value={confidenceValue} />
                      </div>

                      <div className="rounded-xl border border-amber-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                          Severity
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-lg font-bold text-amber-700">
                          <AlertTriangle className="h-4 w-4" />
                          {result.severity}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-farm-100 bg-white p-5">
                      <p className="mb-2 flex items-center gap-2 font-bold text-farm-800">
                        <Sparkles className="h-4 w-4" />
                        Recommendation
                      </p>

                      <p className="leading-relaxed text-stone-600">
                        {result.recommendation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default DetectDisease;
