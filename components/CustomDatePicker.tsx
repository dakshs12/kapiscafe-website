"use client";

import React, { useState, useEffect, useRef } from "react";

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string; // YYYY-MM-DD
  name?: string;
  required?: boolean;
  id?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CustomDatePicker({
  value,
  onChange,
  minDate = "",
  name = "eventDate",
  required = false,
  id = "eventDate",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize view year/month from value or minDate or today
  const getInitialYearMonth = () => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      if (!isNaN(y) && !isNaN(m)) return { year: y, month: m - 1 };
    }
    if (minDate) {
      const [y, m] = minDate.split("-").map(Number);
      if (!isNaN(y) && !isNaN(m)) return { year: y, month: m - 1 };
    }
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  };

  const [viewState, setViewState] = useState(getInitialYearMonth);

  // Update view month when value or minDate changes initially
  useEffect(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      if (!isNaN(y) && !isNaN(m)) {
        setViewState({ year: y, month: m - 1 });
      }
    } else if (minDate && !viewState.year) {
      const [y, m] = minDate.split("-").map(Number);
      if (!isNaN(y) && !isNaN(m)) {
        setViewState({ year: y, month: m - 1 });
      }
    }
  }, [value, minDate]);

  // Handle outside clicks to close the calendar popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const { year, month } = viewState;

  // Month navigation
  const prevMonth = () => {
    if (month === 0) {
      setViewState({ year: year - 1, month: 11 });
    } else {
      setViewState({ year, month: month - 1 });
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setViewState({ year: year + 1, month: 0 });
    } else {
      setViewState({ year, month: month + 1 });
    }
  };

  // Check if prevMonth is before minDate's month
  const isPrevMonthDisabled = () => {
    if (!minDate) return false;
    const [minY, minM] = minDate.split("-").map(Number);
    if (year < minY) return true;
    if (year === minY && month <= minM - 1) return true;
    return false;
  };

  // Calendar days generation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Days array
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  // Check if date string is disabled (< minDate)
  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dateStr < minDate;
  };

  // Check if date string is selected
  const isDateSelected = (day: number) => {
    if (!value) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dateStr === value;
  };

  // Handle day click
  const handleSelectDay = (day: number) => {
    if (isDateDisabled(day)) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  // Quick preset: Earliest Available date
  const handleSelectEarliest = () => {
    if (!minDate) return;
    onChange(minDate);
    const [y, m] = minDate.split("-").map(Number);
    setViewState({ year: y, month: m - 1 });
    setIsOpen(false);
  };

  // Quick preset: Upcoming Weekend (Saturday)
  const handleSelectWeekend = () => {
    if (!minDate) return;
    const d = new Date(minDate + "T00:00:00");
    const dayOfWeek = d.getDay(); // 0=Sun, 6=Sat
    let daysToAdd = 0;
    if (dayOfWeek === 6) {
      daysToAdd = 0; // It's Saturday
    } else if (dayOfWeek === 0) {
      daysToAdd = 6; // Next Saturday
    } else {
      daysToAdd = 6 - dayOfWeek;
    }
    d.setDate(d.getDate() + daysToAdd);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;
    onChange(dateStr);
    setViewState({ year: yyyy, month: d.getMonth() });
    setIsOpen(false);
  };

  // Formatted date display for the trigger button
  const formattedDisplayValue = () => {
    if (!value) return null;
    const dateObj = new Date(value + "T00:00:00");
    if (isNaN(dateObj.getTime())) return value;
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div ref={containerRef} className="relative w-full font-sans">
      {/* Hidden input for form serialization */}
      <input type="hidden" id={id} name={name} value={value} required={required} />

      {/* Styled Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full px-4 py-3 text-left bg-secondary-white rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group ${
          isOpen
            ? "border-primary-mustard ring-2 ring-primary-mustard/30 shadow-xs"
            : "border-secondary-brown/20 hover:border-primary-mustard/60"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Calendar Icon */}
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              value
                ? "bg-primary-mustard/15 text-primary-mustard"
                : "bg-secondary-brown/5 text-secondary-brown/60 group-hover:text-primary-mustard"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Text Content */}
          <div className="flex flex-col min-w-0">
            {value ? (
              <>
                <span className="text-xs text-primary-mustard font-semibold tracking-wide uppercase">
                  Event Date
                </span>
                <span className="text-sm font-bold text-secondary-brown truncate">
                  {formattedDisplayValue()}
                </span>
              </>
            ) : (
              <span className="text-sm text-secondary-brown/50">
                Select celebration date (min. 48h notice)
              </span>
            )}
          </div>
        </div>

        {/* Right Status / Chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {value && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-primary-teal bg-primary-teal/10 px-2.5 py-1 rounded-full">
              <span>✓</span> Confirmed
            </span>
          )}
          <svg
            className={`w-4 h-4 text-secondary-brown/50 transition-transform duration-200 ${
              isOpen ? "transform rotate-180 text-primary-mustard" : "group-hover:text-secondary-brown"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* LUXURY CALENDAR POPOVER */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-full sm:w-[360px] bg-white rounded-3xl border-2 border-primary-mustard/30 shadow-2xl p-5 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Popover Header: Month / Year Navigation */}
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-secondary-brown/10">
            <button
              type="button"
              onClick={prevMonth}
              disabled={isPrevMonthDisabled()}
              aria-label="Previous Month"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isPrevMonthDisabled()
                  ? "text-secondary-brown/20 cursor-not-allowed"
                  : "text-secondary-brown hover:bg-primary-mustard/15 hover:text-primary-mustard cursor-pointer"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <h4 className="font-serif font-bold text-lg text-secondary-brown">
                {MONTH_NAMES[month]} {year}
              </h4>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next Month"
              className="w-8 h-8 rounded-full flex items-center justify-center text-secondary-brown hover:bg-primary-mustard/15 hover:text-primary-mustard transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Weekday Header Row */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAY_NAMES.map((wd) => (
              <div
                key={wd}
                className="text-[11px] font-bold text-secondary-brown/50 uppercase tracking-wider py-1"
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center mb-4">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="w-9 h-9" />;
              }

              const disabled = isDateDisabled(day);
              const selected = isDateSelected(day);

              return (
                <button
                  type="button"
                  key={`day-${day}`}
                  onClick={() => handleSelectDay(day)}
                  disabled={disabled}
                  className={`w-9 h-9 mx-auto rounded-xl text-xs font-semibold flex items-center justify-center transition-all duration-150 relative ${
                    disabled
                      ? "text-secondary-brown/25 cursor-not-allowed bg-transparent"
                      : selected
                      ? "bg-primary-teal text-white shadow-md ring-2 ring-primary-teal/40 scale-105"
                      : "text-secondary-brown hover:bg-primary-mustard/20 hover:text-secondary-brown cursor-pointer active:scale-95"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="pt-3 border-t border-secondary-brown/10 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSelectEarliest}
                className="px-3 py-1.5 rounded-lg bg-primary-mustard/10 hover:bg-primary-mustard/20 text-primary-mustard text-xs font-semibold transition-colors cursor-pointer"
              >
                Earliest Date (+48h)
              </button>
              <button
                type="button"
                onClick={handleSelectWeekend}
                className="px-3 py-1.5 rounded-lg bg-secondary-brown/5 hover:bg-secondary-brown/10 text-secondary-brown text-xs font-semibold transition-colors cursor-pointer"
              >
                Next Saturday
              </button>
            </div>
            
            <p className="text-[11px] text-secondary-brown/60 text-center flex items-center justify-center gap-1">
              <span className="text-primary-mustard font-bold">✦</span>
              Minimum 48 hours baking window required
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
