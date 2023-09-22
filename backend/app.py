import json
import os
import shutil
import uuid
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from qa import qaBase

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
def uploadFile(file: UploadFile = File(...)):

    generatedUuid = str(uuid.uuid4())

    file_path = f"uploads/{os.path.splitext(file.filename)[0] + generatedUuid + os.path.splitext(file.filename)[1]}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    select_k = 2
    select_chain_type = 'map_reduce'

        
    prompts = [
        "Qual o título da pesquisa em português?",
        "A qual grande área a pesquisa se aplica em português?",
        # "Se pudesse definir sua pesquisa em quatro palavras-chave, quais seriam elas?",
        # "É uma revisão sistemática ou revisão literária?",
        # "Se não é uma revisão, que tipo de pesquisa foi realizada?",
        "Qual o principal objetivo da pesquisa em português?",
        "Que problema ela resolve ou qual lacuna do conhecimento ela preenche ou soluciona em português?",
    ]

    results = []

    for prompt in prompts:
        result = qaBase(file_path, prompt, select_chain_type, select_k)
        results.append(result)


    return {"success": True, "file": file.filename, "path": file_path, "result": results}

@app.get("/")
async def root():
    print("Hello World")
    return {"success": True}

if __name__ == '__main__':
    uvicorn.run(app, host="127.0.0.1",port=8000)