import '../styles/tokens-v1.1.css'
import '../styles/system-style.css'
import '../styles/section-sideproject.css'
import Badge from '../components/Badge/Badge.jsx'
import CardSideproject from '../patterns/Card/CardSideproject.jsx'

const SectionSideproject = () => (
  <div className="section-sideproject">
    <h2>Sideproject</h2>
    <div className="cards-container">
      <CardSideproject variant="withBadge"/>
      <CardSideproject variant="withoutBadge"/>
    </div>
  </div>
)

export default SectionSideproject