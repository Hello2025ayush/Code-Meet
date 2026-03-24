export default function ProblemEditor({ value, onChange }) {
  return (
    <div className="editorSurface">
      <textarea
        className="editorText"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Write the full problem statement here..."
        spellCheck={false}
      />
    </div>
  );
}

