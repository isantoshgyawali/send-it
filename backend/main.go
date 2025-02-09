package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"time"

	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"connectrpc.com/connect"
	emailV1 "github.com/isantoshgyawali/sendit/proto/gen/email/v1"
	"github.com/isantoshgyawali/sendit/proto/gen/email/v1/emailV1connect"
	"github.com/joho/godotenv"
)

// Tracking the scheduled tasks
var scheduledTasks = make(map[string]context.CancelFunc)
type EmailServiceServer struct{}

func (e *EmailServiceServer) Email(
    ctx context.Context,
    req *connect.Request[emailV1.EmailRequest],
) (*connect.Response[emailV1.EmailResponse], error) {
    // SMTP SERVER CONFIGURATION
    smtpHost := "smtp.gmail.com"
    smtpPort := "587"                          // TLS: 587 , SSL: 465
    smtpUsername := os.Getenv("SMTP_USERNAME") // user needs to provide
    smtpPassword := os.Getenv("SMTP_PASSWORD") // user needs to provide

    // EXTRACTING REQUEST DATA
    from := smtpUsername
    to := req.Msg.Email
    subject := req.Msg.Title
    body := req.Msg.Content
    log.Println("Received Email Request: ", to, subject, body)

    // BUILDING MESSAGE
    message := []byte(
    "To: " + to + "\r\n" +
    "Subject: " + subject + "\r\n" +
    "\r\n" +
    body + "\r\n")

    // SENDING EMAIL
    auth := smtp.PlainAuth("", smtpUsername, smtpPassword, smtpHost)
    err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, []byte(message))
    if err != nil {
        log.Println("Failed to send email:\n", err)
        return connect.NewResponse(&emailV1.EmailResponse{
            Status:  "error",
            Message: "Failed to send email:\n" + err.Error(),
        }), nil

    }

    schedule := req.Msg.Schedule
    repeat := req.Msg.Repeat
    if (schedule != nil && repeat != nil) {
        if schduleID, err := e.ScheduleMail(to, *schedule, *repeat); err != nil {
            return connect.NewResponse(&emailV1.EmailResponse{
                Status: "error",
                Message: "Error while scheduling mail:\n" + err.Error(),
            }), nil
        } else {
            return connect.NewResponse(&emailV1.EmailResponse{
                Status: "Success",
                Message: "Mail was sent and Scheduled for \n" + *schedule,
                ScheduleId: &schduleID,
            }), nil
        }
    }

    return connect.NewResponse(&emailV1.EmailResponse{
        Status:  "success",
        Message: "Email sent successfully to " + to,
    }), nil
}

func (e *EmailServiceServer) ScheduleMail(to string, schedule string, repeat bool) (string, error) {
    scheduleID := generateScheduleID()

    // Cancelable context
    ctx, cancel := context.WithCancel(context.Background())
    scheduledTasks[scheduleID] = cancel

    go func() {
        for {
            select {
            // cancel() is called
            case <- ctx.Done():
                fmt.Println("Cancelled")
                return 
            default: 
                fmt.Printf("Sending email on repeat")
                time.Sleep(5 * time.Second)
            }
        }
    }()

    return scheduleID, nil
}

func (e *EmailServiceServer) CancelSchedule(
    ctx context.Context,
    req *connect.Request[emailV1.CancelScheduleRequest],
) (*connect.Response[emailV1.CancelScheduleResponse], error) {
    scheduleID := req.Msg.ScheduleId

    if cancelFunc, exists := scheduledTasks[scheduleID]; exists {
        cancelFunc()
        delete(scheduledTasks, scheduleID)
        return connect.NewResponse(&emailV1.CancelScheduleResponse{
            Status:  "success",
            Message: "Schedule Canceled successfully",
        }), nil
    }

    return connect.NewResponse(&emailV1.CancelScheduleResponse{
        Status:  "error",
        Message: "ScheduleID not found",
    }), nil
}

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    // ServiceHandler &&  ConnectHandler
    emailService := &EmailServiceServer{}
    path, handler := emailV1connect.NewEmailServiceHandler(emailService)

    // http..NewServeMux to manage routes
    mux := http.NewServeMux()
    mux.Handle(path, handler)

    // SERVER-CONFIG
    server := &http.Server{
        Addr: "localhost:8080",
        // h2c let's you use the http2 for gRPC without the need of TLS CONFIGURATION
        // only use this for local developement
        Handler: h2c.NewHandler(mux, &http2.Server{}),
    }

    log.Println("Server is listening on localhost:8080 (gRPC, gRPC-Web, and REST supported)")
    if err := server.ListenAndServe(); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
