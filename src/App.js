import React, { useState, useRef, useEffect } from "react";
import { generateData } from "./generate";
import companyLogo from './rocketsoftware.png';
import {
  Rocket,
  Home,
  Database,
  Code,
  Upload,
  Menu,
  ChevronLeft,
  ChevronRight,
  Play,
  ChevronDown,
  TestTube,
  Download,
  Package,
  Wrench,
  Settings,
  Bot,
} from "lucide-react";

const modelOptions = ["Gemma 9b", "Llama 7b", "Mistral"];

// eslint-disable-next-line react/prop-types
function DataInterpretation({ onNavigateToModelTraining }) {
  const [inputText, setInputText] = useState("");
  const [outputData, setOutputData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = oldProgress + 10;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setOutputData([]);
    setCurrentPage(1);
    try {
      const data = await generateData(inputText);
      setOutputData(data);
    } catch (error) {
      console.error("Error generating data:", error);
      setError("Failed to generate data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (outputData.length === 0) {
      alert("No data to download. Please generate data first.");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "English,French\n" +
      outputData.map((row) => `${row.input},${row.output}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "generated_dataset.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = outputData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(outputData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    let startPage, endPage;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i
              ? 'bg-[#5738F5] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          &lt;
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => paginate(1)}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              1
            </button>
            {startPage > 2 && <span className="mx-1">...</span>}
          </>
        )}
        {pageNumbers}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="mx-1">...</span>}
            <button
              onClick={() => paginate(totalPages)}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border-t-4 border-[#5738F5] p-6">
      <h2 className="text-2xl font-bold mb-4">Data Creation</h2>
      <div className="mb-4">
        <textarea
          placeholder="Enter your prompt (e.g., 'Convert English to French')"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 border-2 border-gray-300 rounded focus:border-[#5738F5] focus:ring focus:ring-[#CF52F6] focus:ring-opacity-50 transition-all duration-300 min-h-[100px]"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setInputText("")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        >
          Clear
        </button>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-4 py-2 bg-gradient-to-r from-[#5738F5] to-[#CF52F6] text-white rounded hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#CF52F6] focus:ring-opacity-50 disabled:opacity-50"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>
      {isLoading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div className="bg-gradient-to-r from-[#5738F5] to-[#CF52F6] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {!isLoading && outputData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Output</h3>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b p-2 text-left">English</th>
                  <th className="border-b p-2 text-left">French</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border-b p-2">{item.input}</td>
                    <td className="border-b p-2">{item.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            {renderPaginationButtons()}
            <p className="text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-[#CF52F6] text-white rounded hover:bg-[#B23AD8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5738F5] focus:ring-opacity-50 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Dataset
            </button>
            <button
              onClick={onNavigateToModelTraining}
              className="px-4 py-2 bg-[#5738F5] text-white rounded hover:bg-[#4A2ED1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#CF52F6] focus:ring-opacity-50"
            >
              Model Training
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const predefinedModels = [
  { name: "GPT-2 Small", id: "gpt2-small" },
  { name: "BERT Base", id: "bert-base-uncased" },
  { name: "RoBERTa Large", id: "roberta-large" },
];

function ModelTesting() {
  const [isTestingModel, setIsTestingModel] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState("");
  const [testDataFile, setTestDataFile] = useState(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const testDataInputRef = useRef(null);

  const handleTestDataUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setTestDataFile(file);
    }
  };

  const testModel = () => {
    if (!selectedModel || !testDataFile) {
      alert("Please select a model and upload test data before testing.");
      return;
    }

    setIsTestingModel(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 10;
        if (newProgress === 100) {
          clearInterval(interval);
          setIsTestingModel(false);
          // Simulating a random accuracy between 70% and 95%
          const simulatedAccuracy = (
            Math.random() * (0.95 - 0.7) +
            0.7
          ).toFixed(2);
          setAccuracy(simulatedAccuracy);
        }
        return newProgress;
      });
    }, 500);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border-t-4 border-[#5738F5]">
      <h2 className="text-2xl font-bold mb-4 text-black">Model Testing</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-black">
            Select Model
          </h3>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-[#5738F5] focus:ring focus:ring-[#CF52F6] focus:ring-opacity-50 transition-all duration-300"
          >
            <option value="">Select a model</option>
            {modelOptions.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-black">
            Upload Test Data
          </h3>
          <input
            type="file"
            ref={testDataInputRef}
            onChange={handleTestDataUpload}
            className="hidden"
          />
          <button
            onClick={() => testDataInputRef.current.click()}
            className="relative px-4 py-2 bg-black text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#5738F5] after:to-[#CF52F6] after:rounded-b"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Test Data
          </button>
          {testDataFile && (
            <p className="mt-2 text-gray-600">Uploaded: {testDataFile.name}</p>
          )}
        </div>

        <div>
          <button
            onClick={testModel}
            disabled={isTestingModel || !selectedModel || !testDataFile}
            className={`px-4 py-2 bg-gradient-to-r from-[#5738F5] to-[#CF52F6] text-white rounded hover:bg-[#4A2ED1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#CF52F6] focus:ring-opacity-50 flex items-center ${
              isTestingModel || !selectedModel || !testDataFile
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <TestTube className="mr-2 h-4 w-4" />
            {isTestingModel ? "Testing Model..." : "Test Model"}
          </button>
        </div>

        {isTestingModel && (
          <div className="mt-4">
            <p className="text-gray-600 mb-2">Testing model... Please wait.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-[#5738F5] to-[#CF52F6]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {accuracy !== null && (
          <div className="mt-6 p-4 border-2 border-gray-300 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-black">
              Model Accuracy
            </h3>
            <p className="text-gray-700">
              The model accuracy is: {accuracy * 100}%
            </p>
            {parseFloat(accuracy) < 0.8 && (
              <p className="mt-2 text-gray-600">
                The accuracy is relatively low. Consider trying other models or
                improving your current one.
                <a
                  href="https://huggingface.co/docs/transformers/training"
                  className="ml-2 text-[#5738F5] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Check documentation on how to improve accuracy
                </a>
              </p>
            )}
          </div>
        )}

        <div>
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#5738F5] focus:ring-opacity-50"
          >
            <span className="text-xl font-semibold text-black">Analysis</span>
            <ChevronDown
              className={`h-5 w-5 text-[#5738F5] transition-transform ${
                isAccordionOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>
          {isAccordionOpen && (
            <div className="mt-2 p-4 border-2 border-gray-300 rounded-lg">
              {accuracy !== null ? (
                <div className="text-gray-700">
                  <p>
                    Based on the test results, here are some areas where the
                    model might be failing:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Complex sentence structures</li>
                    <li>Rare or domain-specific vocabulary</li>
                    <li>Idiomatic expressions</li>
                    <li>Long-range dependencies in text</li>
                  </ul>
                  <p className="mt-2">
                    To improve the models performance, consider fine-tuning on a
                    more diverse dataset or increasing the models capacity if
                    resources allow.
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">
                  Run a test to see the analysis of your models performance.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const deploymentSteps = [
  { name: "Initiation", icon: Rocket },
  { name: "Model Packaging", icon: Package },
  { name: "Environment Setup", icon: Wrench },
  { name: "Dependency Installation", icon: Download },
  { name: "Configuration", icon: Settings },
  { name: "Ollama Integration", icon: Bot },
];

function ModelDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDeploymentComplete, setIsDeploymentComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isDeploying && currentStep < deploymentSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prevStep) => prevStep + 1);
        setProgress(((currentStep + 1) / deploymentSteps.length) * 100);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (currentStep === deploymentSteps.length) {
      setIsDeploying(false);
      setIsDeploymentComplete(true);
    }
  }, [isDeploying, currentStep]);

  const startDeployment = () => {
    setIsDeploying(true);
    setCurrentStep(0);
    setProgress(0);
    setIsDeploymentComplete(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}
      >
        Model Deployment
      </h1>

      <button
        className="px-4 py-2 bg-gradient-to-r from-[#5738F5] to-[#CF52F6] text-white rounded hover:bg-[#4A2ED1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#CF52F6] focus:ring-opacity-50 flex items-center"
        onClick={startDeployment}
        disabled={isDeploying}
      >
        <Rocket style={{ marginRight: "8px" }} />
        {isDeploying ? "Deploying..." : "Deploy Model"}
      </button>

      {isDeploying && (
        <div style={{ marginTop: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Deployment Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                className="bg-gradient-to-r from-[#5738F5] to-[#CF52F6] h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div>
            {deploymentSteps.map((step, index) => (
              <div
                key={step.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                  opacity: index <= currentStep ? 1 : 0.5,
                }}
              >
                <span style={{ marginRight: "8px", fontSize: "24px" }}>
                  {React.createElement(step.icon, { size: 24 })}
                </span>
                <span>{step.name}</span>
                {index < currentStep && (
                  <span style={{ marginLeft: "8px", color: "green" }}>✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isDeploymentComplete && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Deployment Successful!
          </h2>
          <p style={{ marginBottom: "16px" }}>
            Your model has been successfully deployed. Here is a sample API
            request and response:
          </p>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              padding: "16px",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Sample API Request:
            </h3>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {`POST /api/generate
Content-Type: application/json

{
  "prompt": "Translate the following English text to French: 'Hello, how are you?'"
}`}
            </pre>
          </div>
          <div
            style={{
              backgroundColor: "#f0f0f0",
              padding: "16px",
              borderRadius: "4px",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Sample API Response:
            </h3>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {`{
  "translation": "Bonjour, comment allez-vous ?"
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function Loader({ progress }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-gradient-to-r from-[#5738F5] to-[#CF52F6] h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("data-interpretation");
  const [dataset, setDataset] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [isTraining, setIsTraining] = useState(false);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [epochs, setEpochs] = useState(10);
  const [learningRate, setLearningRate] = useState(0.001);
  const [batchSize, setBatchSize] = useState(32);
  const [configOpen, setConfigOpen] = useState(false);

  const fileInputRef = useRef(null);
  const logsEndRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleConfig = () => setConfigOpen(!configOpen);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDataset(file);
    }
  };

  const suggestModel = () => {
    const randomModel =
      modelOptions[Math.floor(Math.random() * modelOptions.length)];
    setSelectedModel(randomModel);
  };

  const startTraining = () => {
    if (!dataset || !selectedModel) {
      alert("Please upload a dataset and select a model first.");
      return;
    }
    setIsTraining(true);
    setTrainingLogs([]);
    simulateTraining();
  };

  const simulateTraining = () => {
    let currentEpoch = 0;
    const intervalId = setInterval(() => {
      if (currentEpoch < epochs) {
        const loss = Math.random().toFixed(4);
        setTrainingLogs((prev) => [
          ...prev,
          `Epoch ${currentEpoch + 1}/${epochs}, Loss: ${loss}`,
        ]);
        currentEpoch++;
      } else {
        clearInterval(intervalId);
        setIsTraining(false);
        setTrainingLogs((prev) => [...prev, "Training completed!"]);
      }
    }, 1000);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [trainingLogs]);

  const renderContent = () => {
    switch (currentPage) {
      case "model-training":
        return (
          <div className="p-6 bg-white rounded-lg shadow-lg border-t-4 border-[#5738F5]">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Model Training
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-black">
                  Upload Dataset
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="relative px-4 py-2 bg-black text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#5738F5] after:to-[#CF52F6] after:rounded-b"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Dataset
                  </button>
                  <span className="text-gray-600">
                    {dataset ? dataset.name : "No file chosen"}
                  </span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".csv"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-black">
                  Select Model
                </h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded focus:border-[#5738F5] focus:ring focus:ring-[#CF52F6] focus:ring-opacity-50 transition-all duration-300"
                  >
                    <option value="">Select a model</option>
                    {modelOptions.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={suggestModel}
                    className="relative px-4 py-2 bg-black text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#5738F5] after:to-[#CF52F6] after:rounded-b"
                  >
                    Suggest Model
                  </button>
                </div>
              </div>
              <div>
                <button
                  onClick={() => setConfigOpen(!configOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 text-left text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5738F5] focus:ring-opacity-50"
                >
                  <span className="text-xl font-semibold">
                    Training Configuration
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      configOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {configOpen && (
                  <div className="mt-2 p-4 border-2 border-gray-300 rounded-md space-y-2">
                    <div className="flex items-center space-x-2">
                      <label className="w-32 text-gray-700">Epochs:</label>
                      <input
                        type="number"
                        value={epochs}
                        onChange={(e) => setEpochs(parseInt(e.target.value))}
                        className="px-2 py-1 border-2 border-gray-300 rounded focus:border-[#5738F5] focus:ring focus:ring-[#CF52F6] focus:ring-opacity-50 transition-all duration-300"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="w-32 text-gray-700">
                        Learning Rate:
                      </label>
                      <input
                        type="number"
                        value={learningRate}
                        onChange={(e) =>
                          setLearningRate(parseFloat(e.target.value))
                        }
                        step="0.0001"
                        className="px-2 py-1 border-2 border-gray-300 rounded focus:border-[#5738F5] focus:ring focus:ring-[#CF52F6] focus:ring-opacity-50 transition-all duration-300"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="w-32 text-gray-700">Batch Size:</label>
                      <input
                        type="number"
                        value={batchSize}
                        onChange={(e) => setBatchSize(parseInt(e.target.value))}
                        className="px-2 py-1 border-2 border-gray-300 rounded focus:border-[#5738F5] focus:ring focus:ring-[#CF52F6] focus:ring-opacity-50 transition-all duration-300"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={startTraining}
                  disabled={isTraining}
                  className={`px-4 py-2 bg-gradient-to-r from-[#5738F5] to-[#CF52F6] text-white rounded hover:bg-[#4A2ED1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#CF52F6] focus:ring-opacity-50 flex items-center ${
                    isTraining ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isTraining ? "Training..." : "Start Training"}
                </button>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-black">
                  Training Logs
                </h3>
                <div className="border-2 border-gray-300 rounded-md p-4 h-48 overflow-y-auto bg-gray-50">
                  {trainingLogs.map((log, index) => (
                    <div key={index} className="text-gray-700">
                      {log}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </div>
          </div>
        );
      case "data-interpretation":
        return (
          <DataInterpretation
            onNavigateToModelTraining={() => setCurrentPage("model-training")}
          />
        );
      case "model-testing":
        return <ModelTesting />;
      case "model-deployment":
        return <ModelDeployment />;
      default:
        return (
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500 text-xl">
              Content for {currentPage} goes here
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-white border-r border-gray-200 text-black min-h-screen flex flex-col transition-all duration-300 ease-in-out relative">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <img style={{height:'25px'}} src={companyLogo} alt="BigCo Inc. logo"/>
              {/* <Rocket className="h-8 w-8 text-gradient-to-r from-[#5738F5] to-[#CF52F6]" /> */}
              <span className="text-xl font-bold bg-gradient-to-r from-[#5738F5] to-[#CF52F6] text-transparent bg-clip-text">
                Rocket AI Studio
              </span>
            </div>
          )}
          {!sidebarOpen && (
            <Rocket className="h-8 w-8 text-gradient-to-r from-[#5738F5] to-[#CF52F6] mx-auto" />
          )}
        </div>
        <nav
          className={`flex-grow p-4 space-y-2 overflow-y-auto transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <button
            className={`w-full flex items-center px-2 py-1 text-left rounded-md hover:bg-gray-100 ${
              !sidebarOpen && "justify-center"
            } ${currentPage === "data-interpretation" ? "bg-gray-200" : ""}`}
            onClick={() => setCurrentPage("data-interpretation")}
          >
            <Home className="h-4 w-4 " />
            {sidebarOpen && <span className="ml-2">Data Creation</span>}
          </button>
          <button
            className={`w-full flex items-center px-2 py-1 text-left rounded-md hover:bg-gray-100 ${
              !sidebarOpen && "justify-center"
            } ${currentPage === "dataset-evaluation" ? "bg-gray-200" : ""}`}
            onClick={() => setCurrentPage("dataset-evaluation")}
          >
            <Database className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Dataset Evaluation</span>}
          </button>
          <button
            className={`w-full flex items-center px-2 py-1 text-left rounded-md hover:bg-gray-100 ${
              !sidebarOpen && "justify-center"
            } ${currentPage === "model-training" ? "bg-gray-200" : ""}`}
            onClick={() => setCurrentPage("model-training")}
          >
            <Code className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Model Training</span>}
          </button>
          <button
            className={`w-full flex items-center px-2 py-1 text-left rounded-md hover:bg-gray-100 ${
              !sidebarOpen && "justify-center"
            } ${currentPage === "model-testing" ? "bg-gray-200" : ""}`}
            onClick={() => setCurrentPage("model-testing")}
          >
            <TestTube className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Model Testing</span>}
          </button>
          <button
            className={`w-full flex items-center px-2 py-1 text-left rounded-md hover:bg-gray-100 ${
              !sidebarOpen && "justify-center"
            } ${currentPage === "model-deployment" ? "bg-gray-200" : ""}`}
            onClick={() => setCurrentPage("model-deployment")}
          >
            <Upload className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Model Deployment</span>}
          </button>
        </nav>
        <button
          className="absolute top-1/2 -right-3 p-1 bg-white text-[#5738F5] border border-[#5738F5] rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-auto bg-white text-black">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#5738F5] to-[#CF52F6] text-transparent bg-clip-text">
              {currentPage === "data-interpretation"
                ? "Data Creation"
                : currentPage.charAt(0).toUpperCase() +
                  currentPage.slice(1).replace("-", " ")}
            </h1>
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6 text-gradient-to-r from-[#5738F5] to-[#CF52F6]" />
            </button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;