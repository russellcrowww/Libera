FROM python:3.11-slim


RUN apt-get update && apt-get install -y --no-install-recommends \
	gcc \
	libpq-dev \
	&& rm -rf /var/lib/apt/lists/*


WORKDIR /code


COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt


COPY . /code


ENV PYTHONPATH=/code/backend

CMD ["python", "backend/run.py"]
