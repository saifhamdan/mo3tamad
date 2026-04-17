FROM golang:latest

RUN apt-get update && apt-get install -y \
    wget \
    poppler-utils \
    wkhtmltopdf

WORKDIR /app

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY . ./

RUN go build cmd/main.go

EXPOSE 5000 

ENV XDG_RUNTIME_DIR=/tmp/runtime-root

CMD ["./main"]
