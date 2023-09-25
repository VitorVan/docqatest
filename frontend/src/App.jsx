import "./App.css";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Input, Button } from "antd";
import axios from "axios";
import { useState } from "react";

function App() {
  const [response, setResponse] = useState({});
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState(false);

  const { Dragger } = Upload;

  const draggerProps = {
    name: "file",
    multiple: false,
    action: "http://127.0.0.1:8000/upload",
    onChange(info) {
      const { status } = info.file;
      if (info.file.response?.detail) {
        message.error(info.file.response.detail);
        return;
      } else {
        setResponse(info.file.response);
      }
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`Arquivo analisado com sucesso`);
      } else if (status === "error") {
        console.log(info);
        message.error(`Falha na análise do arquivo`);
      }
    },
  };

  const handleChange = (e) => {
    setApiKey(e.target.value);
  };

  const sendApiKey = () => {
    // Make a POST request with the field value
    if (apiKey === "") {
      message.error(`Chave não deve ser vazia.`);
      setError(true);
      return;
    }

    setError(false);
    axios
      .post("http://127.0.0.1:8000/setapikey", {
        apikey: apiKey,
      })
      .then(() => {
        // Handle the response if needed
        message.success(`Chave definida com sucesso.`);
      })
      .catch(() => {
        // Handle errors
        message.error(`Falha ao definir chave.`);
        setError(true);
      });
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex flex-row w-[442px] gap-3">
        <Input.Password
          placeholder="Insira sua chave de API OpenAI"
          onChange={handleChange}
          status={error ? "error" : "validating"}
        />
        <Button className="w-[120px] focus:outline-none" onClick={sendApiKey}>
          Definir chave
        </Button>
      </div>
      <Dragger
        {...draggerProps}
        className="flex flex-col max-w-[442px] w-[442px]"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Clique ou arraste sua pesquisa para essa área
        </p>
        <p className="ant-upload-hint"></p>
      </Dragger>
      <div className="flex flex-col gap-11 text-left max-w-[450px]">
        {response?.result?.map((item) => (
          <div
            key={item.query}
            className="flex flex-col gap-4 group hover:bg-blue-50 p-4 rounded-md transition-all"
          >
            <p className=" text-blue-950 font-medium text-xl">
              {item.query.replace(" em português", "")}
            </p>
            <p className="text-blue-950 font-light text-base">{item.result}</p>
            <div className="text-blue-950 text-[10px] hidden group-hover:flex flex-col gap-5">
              {item.source_documents.map((refer) => (
                <div key={refer.index} className="flex flex-col gap-2">
                  <p className="text-blue-950 font-medium">
                    {refer.page_content}
                  </p>
                  <p className="text-blue-950 font-light">
                    Página: {refer.metadata.page}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
