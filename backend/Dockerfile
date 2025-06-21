FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY ./core/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY ./core /app

EXPOSE 8000

CMD ["python", "core/manage.py", "runserver", "0.0.0.0:8000"]
