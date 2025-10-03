export default function CodeBlock({ code, language = 'javascript' }) {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded transition"
        >
          Copy
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
        <code className={`language-${language} text-sm`}>{code}</code>
      </pre>
    </div>
  )
}
