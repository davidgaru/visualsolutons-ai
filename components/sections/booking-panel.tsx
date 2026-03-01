"use client";

import { type FormEvent, useMemo, useState } from "react";

const slotOptions = ["09:00", "11:00", "13:00", "15:00", "17:00"];
const primaryContactEmail = "email@yourstudio.com";

function getUpcomingDates(days = 14) {
  const list: Date[] = [];
  const base = new Date();
  for (let i = 0; i < days; i += 1) {
    const copy = new Date(base);
    copy.setDate(base.getDate() + i);
    list.push(copy);
  }
  return list;
}

export function BookingPanel() {
  const dates = useMemo(() => getUpcomingDates(16), []);
  const [selectedDate, setSelectedDate] = useState<Date>(dates[1] ?? dates[0]);
  const [selectedTime, setSelectedTime] = useState<string>(slotOptions[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          details,
          preferredDate: selectedDate.toISOString(),
          preferredTime: selectedTime
        })
      });

      if (!response.ok) throw new Error("Submission failed");

      setStatus("ok");
      setName("");
      setEmail("");
      setCompany("");
      setDetails("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="cine-booking" id="booking">
      <div className="container">
        <div className="cine-booking__panel">
          <div className="cine-booking__intro">
            <p className="eyebrow">Contact</p>
            <h2>Book a creative call.</h2>
            <p>Pick a slot and send a short brief. We will follow up fast.</p>

            <div className="cine-booking__quick">
              <p>Prefer email?</p>
              <a href={`mailto:${primaryContactEmail}`} className="cine-booking__email">
                {primaryContactEmail}
              </a>
            </div>
          </div>

          <form className="cine-booking__form" onSubmit={onSubmit}>
            <div>
              <p className="booking-form__label">Date</p>
              <div className="booking-form__chips">
                {dates.map((date) => {
                  const key = date.toISOString().slice(0, 10);
                  const active =
                    selectedDate.toISOString().slice(0, 10) === date.toISOString().slice(0, 10);
                  return (
                    <button
                      type="button"
                      key={key}
                      className={active ? "chip chip--active" : "chip"}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span>{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                      <span>{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="booking-form__label">Time</p>
              <div className="booking-form__times">
                {slotOptions.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={selectedTime === slot ? "chip chip--active" : "chip"}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="cine-booking__fields">
              <label>
                Name
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label>
                Company
                <input value={company} onChange={(event) => setCompany(event.target.value)} />
              </label>

              <label>
                Project
                <textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={4} />
              </label>
            </div>

            <button type="submit" className="button" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Request Booking"}
            </button>

            {status === "ok" && <p className="booking-form__ok">Request sent. We will confirm by email.</p>}
            {status === "error" && (
              <p className="booking-form__error">Submission failed. Please try again in a moment.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
