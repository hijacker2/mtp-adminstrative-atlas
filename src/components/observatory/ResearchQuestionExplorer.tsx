import { ChevronDown, CircleHelp } from 'lucide-react'

const openQuestions = [
  'What happens when an applicant cannot provide a listed document?',
  'Are alternative forms of income proof accepted?',
  'What happens after physical verification?',
  'How are rejection reasons communicated?',
  'How accessible are appeals in practice?',
  'Do citizens need multiple visits?',
  'Do different offices request overlapping information?',
]

export default function ResearchQuestionExplorer() {
  return (
    <div className="question-explorer">
      {openQuestions.map((question, index) => (
        <details className="research-question" key={question}>
          <summary>
            <span className="question-number">0{index + 1}</span>
            <span className="question-text"><CircleHelp size={15} aria-hidden="true" />{question}</span>
            <span className="question-status">Open research question — not yet established</span>
            <ChevronDown className="question-chevron" size={16} aria-hidden="true" />
          </summary>
          <p>Open research question — not yet established. The available source register does not establish an answer.</p>
        </details>
      ))}
    </div>
  )
}
