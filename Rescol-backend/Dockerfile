FROM python:3.10

RUN export DOCKER_DEFAULT_PLATFORM=linux/amd64

ENV PYTHONUNBUFFERED=1

WORKDIR /rescol-backend

RUN apt-get update \
    && apt-get install -y gdal-bin libgdal-dev \
    && apt-get install -y glpk-utils \
    && apt-get install -y libjsoncpp-dev \
    && apt-get install cmake -y\
    && pip install --upgrade pip

COPY ./requirements.txt ./

RUN pip3 install -r requirements.txt

COPY ./ ./

