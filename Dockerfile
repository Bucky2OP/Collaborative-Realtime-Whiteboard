
FROM golang:1.25 AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o server .

# Run stage
FROM gcr.io/distroless/base

COPY --from=build /app/server /server
EXPOSE 8080

CMD ["/server"]
