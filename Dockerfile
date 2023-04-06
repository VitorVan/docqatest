# FROM python:3.9
FROM nvidia/cuda:11.7.1-cudnn8-devel-ubuntu22.04
LABEL maintainer="Hugging Face"
LABEL repository="transformers"

RUN apt update && \
    apt install -y bash \
                   build-essential \
                   git \
                   curl \
                   ca-certificates \
                   python3 \
                   python3-pip && \
    rm -rf /var/lib/apt/lists


WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN python3 -m pip install --no-cache-dir --upgrade pip
RUN python3 -m pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .

CMD ["panel", "serve", "/code/LangChain_QA_Panel_App.ipynb", "--address", "0.0.0.0", "--port", "7860", "--allow-websocket-origin", "sophiamyang-panel-pdf-qa.hf.space",  "--allow-websocket-origin", "0.0.0.0:7860"]

RUN mkdir /.cache
RUN chmod 777 /.cache
RUN mkdir .chroma
RUN chmod 777 .chroma