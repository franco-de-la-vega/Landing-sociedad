"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Globe, Loader2 } from "lucide-react";
import {
  ARGENTINA_TZ,
  DIA_LABEL,
  HORAS,
  MES_LABEL,
  MIN_LEAD_HOURS,
  PAISES,
  businessDaysByWeek,
  convertSlot,
  detectDefaultTz,
  slotInstant,
  toDateKey,
} from "@/lib/booking";

export type BookingSelection = { date: Date; hour: number; tz: string };

// Selector de día + hora, reutilizado en /agendar y en el paso de agenda
// embebido en la portada. Solo se encarga de elegir el slot: quien lo usa
// decide qué hacer al confirmar (mostrar un form, reservar directo, etc).
export default function BookingCalendar({
  vendedorFijo,
  onContinue,
  continueLabel = "Continuar",
}: {
  vendedorFijo?: string;
  onContinue: (sel: BookingSelection) => void;
  continueLabel?: string;
}) {
  const [tz, setTz] = useState(ARGENTINA_TZ);
  useEffect(() => setTz(detectDefaultTz()), []);
  const days = useMemo(() => businessDaysByWeek(), []);
  const [dayOffset, setDayOffset] = useState(0);
  const visibleDays = days.slice(dayOffset, dayOffset + 6);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [bookedHours, setBookedHours] = useState<number[]>([]);
  const [loadingHours, setLoadingHours] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingHours(true);
    setSelectedHour(null);
    const vendedorParam = vendedorFijo ? `&vendedor=${encodeURIComponent(vendedorFijo)}` : "";
    fetch(`/api/agendar/availability?date=${toDateKey(selectedDate)}${vendedorParam}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setBookedHours(data.bookedHours);
      })
      .finally(() => setLoadingHours(false));
  }, [selectedDate, vendedorFijo]);

  const todayArgentinaKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: ARGENTINA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  // Nadie puede agendar dentro de las próximas MIN_LEAD_HOURS horas, sin
  // importar qué día sea: se compara el instante real del slot contra
  // "ahora + MIN_LEAD_HOURS", no contra la hora del reloj.
  const minBookableInstant = Date.now() + MIN_LEAD_HOURS * 3600 * 1000;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-[var(--color-text-muted)] sm:text-[13px]">
          <Globe size={13} /> Tu país
        </label>
        <select
          value={tz}
          onChange={(e) => setTz(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-[14.5px] outline-none transition-colors focus:border-[var(--color-accent)] sm:py-3 sm:text-[15.5px]"
        >
          {PAISES.map((p) => (
            <option key={p.tz} value={p.tz}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* selector de día */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setDayOffset((o) => Math.max(0, o - 6))}
          disabled={dayOffset === 0}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] disabled:opacity-30 sm:h-9 sm:w-9"
          aria-label="Días anteriores"
        >
          <ChevronLeft size={14} className="sm:hidden" />
          <ChevronLeft size={16} className="hidden sm:block" />
        </button>
        <div className="grid flex-1 grid-cols-6 gap-1 sm:gap-2">
          {visibleDays.map((d) => {
            const active = selectedDate && toDateKey(d) === toDateKey(selectedDate);
            const isPastDay = toDateKey(d) < todayArgentinaKey;
            return (
              <button
                key={toDateKey(d)}
                type="button"
                disabled={isPastDay}
                onClick={() => setSelectedDate(d)}
                className={`flex flex-col items-center gap-0.5 rounded-lg border px-1 py-2 transition-colors sm:rounded-xl sm:px-2 sm:py-3 ${
                  isPastDay
                    ? "cursor-not-allowed border-[var(--color-border)] opacity-35"
                    : active
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent)]/40"
                }`}
              >
                <span className="text-[9.5px] font-semibold uppercase tracking-[0.04em] text-[var(--color-text-muted)] sm:text-[11px] sm:tracking-[0.06em]">
                  {DIA_LABEL[d.getDay()]}
                </span>
                <span
                  className={`text-[15px] font-bold sm:text-[18px] ${
                    active ? "text-[var(--color-accent-hover)]" : "text-[var(--color-text-primary)]"
                  }`}
                >
                  {d.getDate()}
                </span>
                <span className="text-[9px] text-[var(--color-text-muted)] sm:text-[10.5px]">{MES_LABEL[d.getMonth()]}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setDayOffset((o) => (o + 6 < days.length ? o + 6 : o))}
          disabled={dayOffset + 6 >= days.length}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] disabled:opacity-30 sm:h-9 sm:w-9"
          aria-label="Días siguientes"
        >
          <ChevronRight size={14} className="sm:hidden" />
          <ChevronRight size={16} className="hidden sm:block" />
        </button>
      </div>

      {/* selector de hora */}
      <div className="mt-4 min-h-[150px] sm:mt-6 sm:min-h-[180px]">
        {!selectedDate && (
          <p className="mt-8 text-center text-[14px] text-[var(--color-text-muted)] sm:mt-10 sm:text-[15px]">
            Elegí un día para ver los horarios disponibles.
          </p>
        )}
        {selectedDate && loadingHours && (
          <div className="mt-8 flex justify-center sm:mt-10">
            <Loader2 size={20} className="animate-spin text-[var(--color-accent)]" />
          </div>
        )}
        {selectedDate && !loadingHours && (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 sm:grid-cols-4">
            {HORAS.map((h) => {
              const taken = bookedHours.includes(h);
              const tooSoon = slotInstant(selectedDate, h).getTime() < minBookableInstant;
              const disabled = taken || tooSoon;
              const active = selectedHour === h;
              const { time, dayDiff } = convertSlot(selectedDate, h, tz);
              return (
                <button
                  key={h}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedHour(h)}
                  className={`flex flex-col items-center rounded-lg border px-2 py-2 text-[13px] font-semibold transition-colors sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-[15px] ${
                    disabled
                      ? "cursor-not-allowed border-[var(--color-border)] text-[var(--color-text-muted)] opacity-40 line-through"
                      : active
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                        : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]"
                  }`}
                >
                  {time}
                  {dayDiff !== 0 && (
                    <span className="text-[9px] font-normal opacity-70">
                      {dayDiff > 0 ? "día siguiente" : "día anterior"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={!selectedDate || selectedHour === null}
        onClick={() => selectedDate && selectedHour !== null && onContinue({ date: selectedDate, hour: selectedHour, tz })}
        className="mt-6 w-full rounded-xl bg-[var(--color-accent)] px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-40 sm:mt-8 sm:py-3.5 sm:text-[16px]"
      >
        {continueLabel}
      </button>
    </div>
  );
}
