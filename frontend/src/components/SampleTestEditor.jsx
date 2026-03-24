export default function SampleTestEditor({ value, onChange }) {
  return (
    <div className="editorSurface">
      <textarea
        className="editorText"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={"Input:\n5\n1 2 3 4 5\n\nOutput:\n15"}
        spellCheck={false}
      />
    </div>
  );
}

