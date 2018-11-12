import React, {useState, useEffect} from 'react'

import SubPageTemplate from '../components/SubPageTemplate'
import ProjectPageTemplate from '../components/ProjectPageTemplate'
import Loading from '../components/loading/'

import { getBaseUrl } from '../utils/'

const ProjectDashboard = ({match}) => {

  const {
    url,
    params,
  } = match

  const { projectId } = params

  const cleanUrl = getBaseUrl(url, 'dashboard', projectId)

  const [loading, setLoading] = useState(false)

  return (

    <SubPageTemplate title={'Project Dashboard'}>
      { loading && <Loading message={''} />}
      <ProjectPageTemplate
        baseUrl={cleanUrl}
        id={projectId}
        >
        <p>Project id: {projectId}</p>
      </ProjectPageTemplate>
    </SubPageTemplate>
  )
}

// const styles = {
// }

export default ProjectDashboard
