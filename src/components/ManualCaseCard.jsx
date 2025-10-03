export default function ManualCaseCard({ test }) {
  return (
    <div className="bg-dark-700/50 rounded-lg p-5 border border-purple-500/20 hover:border-purple-400/40 transition animate-slideIn">
      <h4 className="text-lg font-semibold text-white mb-3">
        {test.id}. {test.title}
      </h4>

      <div className="mb-3">
        <p className="text-sm font-medium text-gray-300 mb-2">Steps:</p>
        <ol className="list-decimal list-inside space-y-1">
          {test.steps.map((step, index) => (
            <li key={index} className="text-gray-400 text-sm">
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-300 mb-1">Expected Result:</p>
        <p className="text-gray-400 text-sm">{test.expected}</p>
      </div>
    </div>
  )
}
