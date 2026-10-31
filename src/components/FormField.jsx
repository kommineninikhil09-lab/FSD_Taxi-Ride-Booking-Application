// Labelled input with inline error message, shared by the Booking and Contact forms.
export default function FormField({ label, name, error, as = 'input', children, hint, ...props }) {
  const Tag = as;
  const errorId = `${name}-error`;

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <Tag
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      >
        {children}
      </Tag>
      {/* Message slot is always rendered so errors appearing on blur don't shift the layout. */}
      <small
        id={error ? errorId : undefined}
        className={error ? 'field__error' : hint ? 'field__hint' : 'field__msg'}
        role={error ? 'alert' : undefined}
      >
        {error || hint}
      </small>
    </div>
  );
}
