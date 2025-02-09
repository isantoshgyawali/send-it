package main

import (
	"fmt"
	"time"
)

// better ID required
func generateScheduleID() string{
    return fmt.Sprintf("%d", time.Now().UnixNano())
}
