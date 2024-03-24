# Use the official Python image for Windows as base
FROM python:3-alpine

COPY . .

RUN pip install -r requirements.txt


CMD ["python", "app.py"]


EXPOSE 5000

