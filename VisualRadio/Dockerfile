FROM python:3.8-buster

RUN apt update && apt-get install -y python3-pip
RUN pip install --upgrade pip
RUN apt-get install -y ffmpeg
RUN apt-get install flac

WORKDIR /app
COPY requirements.txt .
RUN pip3 install -r requirements.txt
RUN pip install cryptography
RUN pip3 install setuptools-rust
RUN pip3 install git+https://github.com/openai/whisper.git
RUN pip install SpeechRecognition
RUN pip install natsort
RUN pip install librosa
RUN pip install pandas
RUN pip install tensorflow
RUN pip install matplotlib
RUN pip install Flask-Caching
RUN pip install psutil
RUN pip install konlpy
# RUN pip install flask-socketio
# RUN pip install redis

# installing java jdk and java jre
RUN apt-get install -y default-jdk default-jre

EXPOSE 5001

CMD [ "python", "main.py" ]
