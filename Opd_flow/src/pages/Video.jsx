import { useParams } from 'react-router-dom'

function Video() {
  const { requestId } = useParams()

  return (
    <div className="page">
      <div className="container">
        <div className="placeholder">
          <h1>Video Consultation</h1>
          <p>Video call interface for request ID: {requestId}</p>
          <p>Video consultation functionality will be implemented here</p>
        </div>
      </div>
    </div>
  )
}

export default Video
