import formOpt from "@/lib/formOpt";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const TimestampInput = ({
  name,
  form,
  placeholder,
  label,
  description,
  disabled,
  required = false,
  className,
  onChange = () => {},
}) => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [milliseconds, setMilliseconds] = useState("");
  const [isValid, setIsValid] = useState({
    hours: true,
    minutes: true,
    seconds: true,
    milliseconds: true,
  });
  const [isFocused, setIsFocused] = useState(false);

  const hoursRef = useRef(null);
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);
  const millisecondsRef = useRef(null);

  const validateSegment = (value, type) => {
    if (!value) return true;
    const num = parseInt(value, 10);

    switch (type) {
      case "hours":
        return num >= 0 && num <= 23;
      case "minutes":
      case "seconds":
        return num >= 0 && num <= 59;
      case "milliseconds":
        return num >= 0 && num <= 999;
      default:
        return true;
    }
  };

  // Commit form value immediately when all segments are valid
  const commitFormValue = (updatedParts) => {
    if (form?.setValue && name) {
      const {
        hours: h,
        minutes: m,
        seconds: s,
        milliseconds: ms,
      } = updatedParts;

      const allEmpty = !h && !m && !s && !ms;
      const complete = h && m && s && ms;
      const allValid =
        validateSegment(h, "hours") &&
        validateSegment(m, "minutes") &&
        validateSegment(s, "seconds") &&
        validateSegment(ms, "milliseconds");

      if (allEmpty) {
        try {
          form.setValue(name, "", formOpt);
          onChange("");
        } catch {}
      } else if (complete && allValid) {
        const formatted = `${h}:${m}:${s}:${ms}`;
        try {
          form.setValue(name, formatted, formOpt);
          onChange(formatted);
        } catch {}
      }
    }
  };

  useEffect(() => {
    if (form && name) {
      const formValue = form.getValues?.(name);
      if (formValue && typeof formValue === "string") {
        // Parse timestamp format: HH:MM:SS:MS or HH:MM:SS.MS
        const parts = formValue.split(/[:.]/);
        if (parts.length >= 4) {
          setHours(parts[0] || "");
          setMinutes(parts[1] || "");
          setSeconds(parts[2] || "");
          setMilliseconds(parts[3] || "");
        }
      }
    }
  }, [form?.getValues?.(name)]);

  const handleSegmentChange = (value, type, setValue, nextRef, maxLength) => {
    // Only allow digits
    const cleanValue = value.replace(/\D/g, "");

    // Limit to maxLength digits
    if (cleanValue.length <= maxLength) {
      setValue(cleanValue);

      // Validate
      const valid = validateSegment(cleanValue, type);
      setIsValid((prev) => ({ ...prev, [type]: valid }));

      // Create updated parts object for form commit
      const updatedParts = {
        hours,
        minutes,
        seconds,
        milliseconds,
        [type]: cleanValue,
      };

      // Commit to form immediately if valid
      if (valid) {
        commitFormValue(updatedParts);
      }

      // Auto-advance to next field when max digits entered
      if (cleanValue.length === maxLength && valid && nextRef?.current) {
        // Small delay to ensure state is updated before focus change
        setTimeout(() => nextRef.current.focus(), 0);
      }
    }
  };

  // Simplified handleKeyDown - only for navigation
  const handleKeyDown = (e, currentValue, nextRef, prevRef) => {
    // Backspace to previous field when current is empty
    if (e.key === "Backspace" && currentValue === "" && prevRef?.current) {
      e.preventDefault();
      prevRef.current.focus();
      return;
    }

    // Arrow right to next field (when at end of input)
    if (
      e.key === "ArrowRight" &&
      e.target.selectionStart === currentValue.length &&
      nextRef?.current
    ) {
      e.preventDefault();
      nextRef.current.focus();
      return;
    }

    // Arrow left to previous field (when at start of input)
    if (
      e.key === "ArrowLeft" &&
      e.target.selectionStart === 0 &&
      prevRef?.current
    ) {
      e.preventDefault();
      prevRef.current.focus();
      return;
    }
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    // Delay to check if focus moved to another input within the container
    setTimeout(() => {
      const activeElement = document.activeElement;
      const container = document.getElementById("timestamp-container");
      const leavingContainer = !container?.contains(activeElement);
      if (leavingContainer) {
        setIsFocused(false);
      }
    }, 0);
  };

  const hasError =
    (!isValid.hours && hours) ||
    (!isValid.minutes && minutes) ||
    (!isValid.seconds && seconds) ||
    (!isValid.milliseconds && milliseconds);

  return (
    <div className="w-full mx-auto space-y-6">
      {label && (
        <label className="text-sm font-medium flex items-center gap-2">
          {label}
        </label>
      )}

      <div
        id="timestamp-container"
        className={cn(
          `file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex items-center h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
            isFocused
              ? hasError
                ? "border-destructive ring-2 ring-destructive/20"
                : "border-primary ring-2 ring-primary/20"
              : hasError
              ? "border-destructive"
              : "border-gray-200 hover:border-gray-300"
          }`,
          className
        )}
      >
        {/* Hours */}
        <input
          ref={hoursRef}
          type="text"
          value={hours}
          onChange={(e) =>
            handleSegmentChange(
              e.target.value,
              "hours",
              setHours,
              minutesRef,
              2
            )
          }
          onKeyDown={(e) => handleKeyDown(e, hours, minutesRef, null)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="HH"
          className="size-8 rounded-sm text-center font-mono text-sm bg-transparent border-none outline-none p-0"
          maxLength={2}
        />

        <span className="h-8 flex items-center text-sm font-mono text-gray-400">
          :
        </span>

        {/* Minutes */}
        <input
          ref={minutesRef}
          type="text"
          value={minutes}
          onChange={(e) =>
            handleSegmentChange(
              e.target.value,
              "minutes",
              setMinutes,
              secondsRef,
              2
            )
          }
          onKeyDown={(e) => handleKeyDown(e, minutes, secondsRef, hoursRef)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="MM"
          className="size-8 rounded-sm text-center font-mono text-sm bg-transparent border-none outline-none p-0"
          maxLength={2}
        />

        <span className="h-8 flex items-center text-sm font-mono text-gray-400">
          :
        </span>

        {/* Seconds */}
        <input
          ref={secondsRef}
          type="text"
          value={seconds}
          onChange={(e) =>
            handleSegmentChange(
              e.target.value,
              "seconds",
              setSeconds,
              millisecondsRef,
              2
            )
          }
          onKeyDown={(e) =>
            handleKeyDown(e, seconds, millisecondsRef, minutesRef)
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="SS"
          className="size-8 rounded-sm text-center font-mono text-sm bg-transparent border-none outline-none p-0"
          maxLength={2}
        />

        <span className="h-8 flex items-center text-sm font-mono text-gray-400">
          :
        </span>

        {/* Milliseconds */}
        <input
          ref={millisecondsRef}
          type="text"
          value={milliseconds}
          onChange={(e) =>
            handleSegmentChange(
              e.target.value,
              "milliseconds",
              setMilliseconds,
              null,
              3
            )
          }
          onKeyDown={(e) => handleKeyDown(e, milliseconds, null, secondsRef)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="MS"
          className="size-8 rounded-sm text-center font-mono text-sm bg-transparent border-none outline-none p-0"
          maxLength={3}
        />
      </div>

      {/* Validation messages */}
      {hasError && (
        <div className="space-y-1">
          {!isValid.hours && hours && (
            <p className="text-xs text-red-500">Hours must be 00-23</p>
          )}
          {!isValid.minutes && minutes && (
            <p className="text-xs text-red-500">Minutes must be 00-59</p>
          )}
          {!isValid.seconds && seconds && (
            <p className="text-xs text-red-500">Seconds must be 00-59</p>
          )}
          {!isValid.milliseconds && milliseconds && (
            <p className="text-xs text-red-500">Milliseconds must be 000-999</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TimestampInput;
