# Use python 3.10 image
FROM python:3.10-slim


# Create a workspace
WORKDIR /app

# Copy project dependencies into image
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip 
RUN pip install -r requirements.txt


# Copy source code into image
COPY . /app

# Expose port 8000
EXPOSE 8000

# Launch FastAPI
CMD ["uvicorn", "app.api:app", "--host", "0.0.0.0", "--port", "8000"]
