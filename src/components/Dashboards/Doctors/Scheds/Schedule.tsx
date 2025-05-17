import React from "react"
import ScheduleForm from "./ScheduleForm"
import ScheduleViewer from "./ViewSchedule"

const Schedule = () => {
    // const sechedule = {
    //     workingDays: ["monday", "tuesday", "wednesday"],
    //     fromTime: "09:00",
    //     toTime: "17:00",
    //     interval: "30 minutes",
    //     downtime: 10,
    //     price: 50,
    // }
    // const sechedule = null
    return <ScheduleForm />
    // } else {
    //     return (
    //         <ScheduleViewer
    //             workingDays={sechedule.workingDays}
    //             fromTime={sechedule.fromTime}
    //             toTime={sechedule.toTime}
    //             interval={sechedule.interval}
    //             downtime={sechedule.downtime}
    //             price={sechedule.price}
    //         />
    //     )
    // }
}

export default Schedule
