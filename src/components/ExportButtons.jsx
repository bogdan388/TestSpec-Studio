export default function ExportButtons({ results }) {
  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExportCSV = () => {
    downloadFile(results.exports.csv, 'test-cases.csv', 'text/csv')
  }

  const handleExportMarkdown = () => {
    downloadFile(results.exports.markdown, 'test-cases.md', 'text/markdown')
  }

  const handleExportZIP = async () => {
    if (results.exports.zipUrl) {
      window.open(results.exports.zipUrl, '_blank')
    } else {
      // Fallback: download files individually if ZIP URL not available
      handleExportCSV()
      handleExportMarkdown()
      downloadFile(results.automationSkeletons, 'test-automation.js', 'text/javascript')
    }
  }

  return (
    <div className="mt-6 flex flex-wrap gap-4">
      <button
        onClick={handleExportCSV}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        Export CSV
      </button>
      <button
        onClick={handleExportMarkdown}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        Export Markdown
      </button>
      <button
        onClick={handleExportZIP}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        Export ZIP Bundle
      </button>
    </div>
  )
}
