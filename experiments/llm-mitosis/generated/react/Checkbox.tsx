"use client";
import * as React from "react";

export interface CheckboxProps {
  id: string;
  name?: string;
  value?: string;
  checked: boolean;
  label: string;
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "medium" | "large";
  labelPosition?: "left" | "right";
  onCheckedChange: (checked: boolean) => void;
}

function Checkbox(props: CheckboxProps) {
  props = {
    size: "medium",
    labelPosition: "right",
    disabled: false,
    required: false,
    value: "on",
    ...props,
  };
  function invalid() {
    return (
      !props.id ||
      !props.id.trim() ||
      !props.label ||
      !props.label.trim() ||
      typeof props.checked !== "boolean" ||
      typeof props.onCheckedChange !== "function"
    );
  }

  return (
    <>
      <div className="lm-checkbox">
        {invalid() ? (
          <p role="alert">
            Checkbox requires an id, a label, boolean checked state, and a
            change callback.
          </p>
        ) : (
          <>
            <label
              className="lm-checkbox-label"
              htmlFor={props.id}
              data-position={props.labelPosition}
              data-size={props.size}
              data-disabled={props.disabled ? "true" : "false"}
            >
              <input
                className="lm-checkbox-input"
                type="checkbox"
                id={props.id}
                name={props.name}
                value={props.value}
                checked={props.checked}
                disabled={props.disabled}
                required={props.required}
                onChange={(event) =>
                  props.onCheckedChange(event.target.checked)
                }
              />
              <span>{props.label}</span>
            </label>
          </>
        )}
      </div>
      <style jsx>{`
        .lm-checkbox {
          color: var(--color-foreground-neutral);
          font: var(--typography-body-regular);
        }
        .lm-checkbox-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .lm-checkbox-label[data-position="left"] {
          flex-direction: row-reverse;
        }
        .lm-checkbox-label[data-size="small"] {
          gap: 6px;
        }
        .lm-checkbox-label[data-size="large"] {
          gap: 10px;
        }
        .lm-checkbox-label[data-disabled="true"] {
          color: var(--color-foreground-neutral-faded);
          cursor: not-allowed;
        }
        .lm-checkbox-input {
          margin: 0;
          width: 16px;
          height: 16px;
          border-radius: 6px;
          accent-color: var(--color-background-primary);
          cursor: inherit;
          flex-shrink: 0;
        }
        .lm-checkbox-label[data-size="small"] .lm-checkbox-input {
          width: 14px;
          height: 14px;
          border-radius: 4px;
        }
        .lm-checkbox-label[data-size="large"] .lm-checkbox-input {
          width: 20px;
          height: 20px;
          border-radius: 8px;
        }
        .lm-checkbox-input:focus-visible {
          outline: 2px solid var(--color-border-focus);
          outline-offset: 3px;
        }
      `}</style>
    </>
  );
}

export default Checkbox;
