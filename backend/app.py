import json
import os
import shutil
import uuid
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import openai


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

apikey = ""

@app.post("/upload")
def uploadFile(file: UploadFile = File(...)):

    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=401, detail="Arquivo deve ser um PDF")

    if (apikey == ""):
        raise HTTPException(status_code=401, detail="Chave de API não definida")

    generatedUuid = str(uuid.uuid4())


    file_path = f"uploads/{os.path.splitext(file.filename)[0] + generatedUuid + os.path.splitext(file.filename)[1]}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    select_k = 2
    select_chain_type = 'map_reduce'

        
    prompts = [
        "Qual o título da pesquisa em português?",
        "A qual grande área a pesquisa se aplica em português?",
        "Se pudesse definir sua pesquisa em quatro palavras-chave, quais seriam elas em português?",
        "É uma revisão sistemática ou revisão literária em português?",
        "Se não é uma revisão, que tipo de pesquisa foi realizada em português?",
        "Qual o principal objetivo da pesquisa em português em português?",
        "Que problema ela resolve ou qual lacuna do conhecimento ela preenche ou soluciona em português?",
    ]

    results = []

    for prompt in prompts:
        try: 
            result = qaBase(apikey, file_path, prompt, select_chain_type, select_k)
        except openai.error.RateLimitError as e:
            raise HTTPException(status_code=401, detail="Limite de requisições na OpenAI excedido")
        except:
            raise HTTPException(status_code=401, detail="Chave de API incorreta")
            
        results.append(result)


    return {"success": True, "file": file.filename, "path": file_path, "result": results}

@app.post("/setapikey")
async def setapikey(request: Request):
    global apikey
    data = await request.json()  # Parse the JSON body
    apikey = data.get("apikey", "")
    print(apikey)
    return {"success": True, "apikey": apikey}
    

if __name__ == '__main__':
    uvicorn.run("app:app", host="127.0.0.1",port=8000, reload=True)