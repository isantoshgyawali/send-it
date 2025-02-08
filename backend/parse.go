package main

func parseSchedule(schedule string) (int) {
    if schedule == "weekly" {
        return 7
    } else if schedule == "every 3 days" {
        return 3
    }
    return 0
}
