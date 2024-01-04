FROM python:3.12

ENV LANG C.UTF-8

WORKDIR /app

#パッケージマネージャAPTを使用して、日本語のロケールをインストール
RUN apt-get update &&\
    apt-get -y install locales &&\
    localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9
ENV TERM xterm

# Python パスに serverapi ディレクトリを追加
ENV PYTHONPATH=/app/serverapi

#Poetryを公式のスクリプトを使用してインストール
RUN curl -sSL https://install.python-poetry.org | python3 -

ENV PATH /root/.local/bin:$PATH

#Poetryのバーチャル環境の作成を無効に設定
RUN poetry config virtualenvs.create false

COPY . /app
RUN poetry install --no-dev

CMD ["uvicorn", "serverapi.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]