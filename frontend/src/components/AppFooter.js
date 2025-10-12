import React from 'react'
import { CFooter } from '@coreui/react-pro'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://asgexperience.co.th/" target="_blank" rel="noopener noreferrer">
          STMS
        </a>
        <span className="ms-1">&copy; 2025 ASG EXPERIENCE.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://asgexperience.co.th/" target="_blank" rel="noopener noreferrer">
          ASG EXPERIENCE COMPANY LIMITED
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
