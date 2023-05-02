FROM golang:alpine AS builder

WORKDIR /app

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY . ./

RUN go build cmd/main.go

EXPOSE 5000 

CMD ["./main"]
