"use client";
import * as React from "react";

export interface TextFieldProps {
  id: string;
  name?: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
}

function TextField(props: TextFieldProps) {
  props = { disabled: false, required: false, showCount: false, ...props };
  function invalid() {
    return (
      !props.id ||
      !props.id.trim() ||
      !props.label ||
      !props.label.trim() ||
      typeof props.value !== "string" ||
      typeof props.onValueChange !== "function" ||
      (props.maxLength !== undefined &&
        (!Number.isInteger(props.maxLength) || props.maxLength < 0))
    );
  }

  function descriptionIds() {
    return (
      [
        props.error || props.helperText ? props.id + "-message" : "",
        props.showCount ? props.id + "-count" : "",
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  }

  return (
    <>
      <div className="lm-field">
        {invalid() ? (
          <p role="alert">
            Text field requires an id, a label, string value, a change callback,
            and a non-negative integer maximum length when supplied.
          </p>
        ) : (
          <>
            <div className="lm-field">
              <label className="lm-field-label" htmlFor={props.id}>
                {props.label}
                {props.required ? <span aria-hidden="true"> *</span> : null}
              </label>
              <input
                className="lm-field-input"
                type="text"
                id={props.id}
                name={props.name}
                value={props.value}
                placeholder={props.placeholder}
                disabled={props.disabled}
                required={props.required}
                maxLength={props.maxLength}
                aria-invalid={props.error ? "true" : "false"}
                aria-describedby={descriptionIds()}
                onInput={(event) => props.onValueChange(event.target.value)}
              />
              {props.error || props.helperText || props.showCount ? (
                <div className="lm-field-footer">
                  {props.error || props.helperText ? (
                    <p
                      aria-live="polite"
                      id={props.id + "-message"}
                      className={props.error ? "lm-field-error" : ""}
                    >
                      {props.error ? (
                        <>{"Error: " + props.error}</>
                      ) : (
                        <>{props.helperText}</>
                      )}
                    </p>
                  ) : null}
                  {props.showCount ? (
                    <span className="lm-field-count" id={props.id + "-count"}>
                      {props.value.length}
                      {props.maxLength !== undefined ? (
                        <>{" / " + props.maxLength}</>
                      ) : (
                        <>
                          <div _text="" />
                        </>
                      )}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .lm-field {
          display: flex;
          flex-direction: column;
          gap: 12px;
          color: var(--color-foreground-neutral);
          font: var(--typography-body-regular);
          width: 100%;
        }
        .lm-field-label {
          font: var(--typography-body-medium);
        }
        .lm-field-input {
          box-sizing: border-box;
          width: 100%;
          min-height: 36px;
          padding: 4px 12px;
          border: 1px solid var(--color-border-neutral);
          border-radius: 8px;
          background: var(--color-background-page);
          color: var(--color-foreground-neutral);
          font: inherit;
        }
        .lm-field-input::placeholder {
          color: var(--color-foreground-neutral-faded);
        }
        .lm-field-input:focus-visible {
          outline: 2px solid var(--color-border-focus);
          outline-offset: 2px;
        }
        .lm-field-input[aria-invalid="true"] {
          border-style: dashed;
          border-color: var(--color-foreground-neutral);
        }
        .lm-field-input:disabled {
          background: var(--color-background-neutral);
          color: var(--color-foreground-neutral-faded);
          cursor: not-allowed;
        }
        .lm-field-footer {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
          color: var(--color-foreground-neutral-faded);
        }
        .lm-field-footer p {
          margin: 0;
        }
        .lm-field-error {
          color: var(--color-foreground-neutral);
          font: var(--typography-body-bold);
        }
        .lm-field-count {
          white-space: nowrap;
          margin-left: auto;
          font: var(--typography-caption-regular);
        }
      `}</style>
    </>
  );
}

export default TextField;
