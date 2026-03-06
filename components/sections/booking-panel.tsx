"use client";

import { type FormEvent, useMemo, useState } from "react";

const slotOptions = ["09:00", "11:00", "13:00", "15:00", "17:00"];
const primaryContactEmail = "email@yourstudio.com";

function startOfWeek(weekOffset: number): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun … 6=Sat
  const diffToMon = day === 0 ? -6 : 1 - day;
  const mon = new Date(now);
  mon.setHours(0, 0, 0, 0);
  mon.setDate(now.getDate() + diffToMon + weekOffset * 7);
  return mon;
}

function getWeekDates(weekOffset: number): Date[] {
  const mon = startOfWeek(weekOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const MAX_WEEK_OFFSET = 8;

export function BookingPanel() {
  const [weekOffset, setWeekOffset] = useState(0);
  const visibleDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  // Default to tomorrow (or today if it's the only option)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  });
  const [selectedTime, setSelectedTime] = useState<string>(slotOptions[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const rangeLabel = useMemo(() => {
    const first = visibleDates[0];
    const last = visibleDates[6];
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(first)} – ${fmt(last)}`;
  }, [visibleDates]);

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
              <div className="booking-form__date-header">
                <p className="booking-form__label">Date</p>
                <div className="booking-form__week-nav">
                  <button
                    type="button"
                    className="week-nav__arrow"
                    disabled={weekOffset <= 0}
                    onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                    aria-label="Previous week"
                  >
                    &#8249;
                  </button>
                  <span className="week-nav__label">{rangeLabel}</span>
                  <button
                    type="button"
                    className="week-nav__arrow"
                    disabled={weekOffset >= MAX_WEEK_OFFSET}
                    onClick={() => setWeekOffset((w) => Math.min(MAX_WEEK_OFFSET, w + 1))}
                    aria-label="Next week"
                  >
                    &#8250;
                  </button>
                </div>
              </div>
              <div className="booking-form__week-strip">
                {visibleDates.map((date) => {
                  const key = date.toISOString().slice(0, 10);
                  const active = isSameDay(selectedDate, date);
                  const past = isPast(date);
                  return (
                    <button
                      type="button"
                      key={key}
                      className={[
                        "chip",
                        active && "chip--active",
                        past && "chip--disabled"
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      disabled={past}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span>{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                      <span>{date.getDate()}</span>
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
              <div className="cine-booking__fields-row">
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
              </div>

              <label>
                Company
                <input value={company} onChange={(event) => setCompany(event.target.value)} />
              </label>

              <label>
                Project
                <textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={3} />
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
