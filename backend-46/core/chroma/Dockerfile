FROM python:3.10-slim

WORKDIR /app

COPY requirementsChroma.txt .
RUN pip install --upgrade pip && pip install -r requirementsChroma.txt

COPY ChromaEngine.py .
COPY chroma_api.py .

EXPOSE 9000

CMD ["python", "chroma_api.py"]