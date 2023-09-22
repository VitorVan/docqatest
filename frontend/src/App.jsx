import "./App.css";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { useState } from "react";

function App() {
  const [response, setResponse] = useState({});

  const { Dragger } = Upload;

  const draggerProps = {
    name: "file",
    multiple: true,
    action: "http://127.0.0.1:8000/upload",
    onChange(info) {
      const { status } = info.file;
      setResponse(info.file.response);
      console.log(info);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e);
    },
  };

  return (
    <div className="flex flex-col items-center gap-12">
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
