import React, { useState } from "react";
import {
  PDFViewer,
  Text,
  View,
  Page,
  Document,
  StyleSheet
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10
  },
  cell: {
    width: "30%",
    textAlign: "center",
    margin: "auto"
  }
});

function generateTickets(
  date,
  numTeams,
  venue,
  startTime,
  eventLength,
  timePerPerson
) {
  const tickets = [];

  for (let i = 0; i < numTeams; i++) {
    let time = startTime;

    for (let j = 0; j < eventLength; j += timePerPerson) {
      tickets.push({
        date: date,
        time: time,
        venue: venue,
        church: "Church Info"
      });

      time = addMinutes(time, timePerPerson);
    }

    startTime = addMinutes(startTime, timePerPerson * numTeams);
  }

  return tickets;
}

function addMinutes(time, minutes) {
  var date = new Date("1970-01-01T" + time + ":00Z");
  date.setMinutes(date.getMinutes() + minutes);
  return date.toTimeString().slice(0, 5);
}

function formatTime(time) {
  return time;
}

function TicketPDF({ tickets }) {
  return (
    <Document>
      <Page size="A4" orientation="portrait">
        {tickets.map((ticket, index) => (
          <View style={styles.container} key={index}>
            <Text style={styles.cell}>{ticket.date}</Text>
            <Text style={styles.cell}>{formatTime(ticket.time)}</Text>
            <Text style={styles.cell}>{ticket.venue}</Text>
            <Text style={styles.cell}>{ticket.church}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export default function TicketForm() {
  const [date, setDate] = useState("");
  const [numTeams, setNumTeams] = useState(1);
  const [venue, setVenue] = useState("");
  const [startTime, setStartTime] = useState("");
  const [eventLength, setEventLength] = useState(60);
  const [timePerPerson, setTimePerPerson] = useState(10);

  const [tickets, setTickets] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();

    setTickets(
      generateTickets(
        date,
        numTeams,
        venue,
        startTime,
        eventLength,
        timePerPerson
      )
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />

        <label htmlFor="num-teams">Number of Teams:</label>
        <input
          type="number"
          id="num-teams"
          name="num-teams"
          min="1"
          value={numTeams}
          onChange={(event) => setNumTeams(Number(event.target.value))}
          required
        />
        <label htmlFor="venue">Venue:</label>
        <input
          type="text"
          id="venue"
          name="venue"
          value={venue}
          onChange={(event) => setVenue(event.target.value)}
          required
        />

        <label htmlFor="start-time">Start Time:</label>
        <input
          type="time"
          id="start-time"
          name="start-time"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
          required
        />

        <label htmlFor="event-length">Event Length (minutes):</label>
        <input
          type="number"
          id="event-length"
          name="event-length"
          min="1"
          value={eventLength}
          onChange={(event) => setEventLength(Number(event.target.value))}
          required
        />

        <label htmlFor="time-per-person">Time per Person (minutes):</label>
        <input
          type="number"
          id="time-per-person"
          name="time-per-person"
          min="1"
          value={timePerPerson}
          onChange={(event) => setTimePerPerson(Number(event.target.value))}
          required
        />

        <button type="submit">Download Tickets PDF</button>
      </form>

      {tickets && (
        <PDFViewer>
          <TicketPDF tickets={tickets} />
        </PDFViewer>
      )}
    </>
  );
}
