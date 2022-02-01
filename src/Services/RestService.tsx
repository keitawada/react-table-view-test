import React from 'react'
import fetch from 'node-fetch'

type TestDataEntity = {
  id: number
  title: string
  created_at: Date
  updated_at: Date
}

type GetResponse = {
  status: number
  message: string
  data: TestDataEntity[]
}

type RestProps = {
  url: string
}

type RestStatus = {
  status: number
  message: string
  data: TestDataEntity[]
}

class RestService extends React.Component<RestProps, RestStatus> {
  constructor(props: RestProps) {
    super(props)
    this.state = {
      status: -1,
      message: '',
      data: [],
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    fetch(this.props.url)
      .then((res) => {
        return res.json()
      })
      .then(
        (result: any) => {
          const resultData: GetResponse = result
          console.log(resultData)
          this.setState({
            status: result.status,
            message: result.message,
            data: result.data,
          })
        },
        (error) => {
          console.log(error)
          this.setState({
            status: -1,
            message: 'ERROR',
            data: [],
          })
        },
      )
  }

  render() {
    const dataList = this.state.data.map((item, idx) => {
      return (
        <div key={idx}>
          {idx} : {item.title}
        </div>
      )
    })

    return (
      <>
        <div>status : {this.state.status}</div>
        <div>message : {this.state.message}</div>
        {dataList}
      </>
    )
  }
}

export default RestService
