import React from 'react'
import './App.css'
import CustomRoundLabelCheckbox from 'CustomRoundLabelCheckbox/CustomRoundLabelCheckbox'

const FROM_TABLE_ID = 1
const TO_TABLE_ID = 2

type UserInfoTableProps = {
  userInfoList: UserInfoItem[]
  onChecked: (index: number, isCkecked: boolean) => void
}

type UserInfoTableState = {
  userInfoList: UserInfoItem[]
}

type UserInfoItem = {
  isChecked: boolean
  userId: number
  userName: string
  mailAddress: string
  teamId: number
}

type TableManagerState = {
  isDisplayedFromTable: boolean
  isDisplayedToTable: boolean
  fromTableDataList: UserInfoItem[]
  toTableDataList: UserInfoItem[]
}

// const addBlankRow = (list: UserInfoItem[]) => {
//   if (list.length < 10) {
//     for (let i = list.length; list.length < 10; i++) {
//       list.push({
//         isChecked: false,
//         userId: -1 * (i + 1),
//         userName: '',
//         mailAddress: '',
//         teamId: -1 * (i + 1),
//       })
//     }
//   }
//   return list
// }

class UserInfoTable extends React.Component<
  UserInfoTableProps,
  UserInfoTableState
> {
  constructor(props: UserInfoTableProps) {
    super(props)

    this.state = {
      userInfoList: props.userInfoList,
    }
  }

  handleChecked = (index: number, isChecked: boolean) => {
    const userInfoItem = this.props.userInfoList[index]
    userInfoItem.isChecked = isChecked
    this.props.onChecked(index, isChecked)
    this.setState({ userInfoList: this.props.userInfoList })
  }

  render() {
    // const userInfoList = addBlankRow(this.props.userInfoList)

    const userInfoTableInnerJSX = this.props.userInfoList.map(
      (item: UserInfoItem, index: number) => {
        return (
          <tr
            key={item.userId.toString() + 'tableRow'}
            className={index % 2 === 1 ? 'odd-row' : ''}
          >
            <td key={item.userId.toString() + 'checkbox'}>
              <span className={item.userId < 0 ? 'hide' : ''}>
                <CustomRoundLabelCheckbox
                  key={item.userId}
                  idx={index}
                  checked={item.isChecked}
                  onCheckChange={(isChecked) => {
                    this.handleChecked(index, isChecked)
                  }}
                />
              </span>
            </td>
            <td key={item.userId.toString() + 'userId'}>
              <span className={item.userId < 0 ? 'hide' : ''}>
                {item.userId}
              </span>
            </td>
            <td key={item.userId.toString() + 'userName'}>
              <span className={item.userId < 0 ? 'hide' : ''}>
                {item.userName}
              </span>
            </td>
            <td key={item.userId.toString() + 'mailAddress'}>
              <span className={item.userId < 0 ? 'hide' : ''}>
                {item.mailAddress}
              </span>
            </td>
            <td key={item.userId.toString() + 'teamId'}>
              <span className={item.userId < 0 ? 'hide' : ''}>
                {item.teamId}
              </span>
            </td>
          </tr>
        )
      },
    )

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>✓</th>
              <th>ID</th>
              <th>Name</th>
              <th>E-mail</th>
              <th>Team</th>
            </tr>
            {userInfoTableInnerJSX}
          </tbody>
        </table>
      </div>
    )
  }
}

class TableManager extends React.Component<{}, TableManagerState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      isDisplayedFromTable: true,
      isDisplayedToTable: true,
      fromTableDataList: [],
      toTableDataList: [],
    }
  }

  showTable(targetTable: number, changeEvent: any) {
    if (targetTable === FROM_TABLE_ID) {
      console.log(changeEvent.target.checked)
      this.setState({
        isDisplayedFromTable: changeEvent.target.checked,
      })
    } else {
      console.log(changeEvent.target.checked)
      this.setState({
        isDisplayedToTable: changeEvent.target.checked,
      })
    }
  }

  moveItemFromFromListToToList(index: number, isChecked: boolean): void {
    if (isChecked) {
      const fromUserInfoList = this.state.fromTableDataList
      const toUserInfoList = this.state.toTableDataList

      const deleteItem = fromUserInfoList.splice(index, 1)
      const addItem = {
        isChecked: isChecked,
        userId: deleteItem[0].userId,
        userName: deleteItem[0].userName,
        mailAddress: deleteItem[0].mailAddress,
        teamId: deleteItem[0].teamId,
      }
      toUserInfoList.push(addItem)
      this.setState({
        fromTableDataList: fromUserInfoList,
        toTableDataList: toUserInfoList,
      })
    }
  }

  moveItemFromToListToFromList(index: number, isChecked: boolean): void {
    if (!isChecked) {
      const fromUserInfoList = this.state.fromTableDataList
      const toUserInfoList = this.state.toTableDataList

      const deleteItem = toUserInfoList.splice(index, 1)
      const addItem = {
        isChecked: isChecked,
        userId: deleteItem[0].userId,
        userName: deleteItem[0].userName,
        mailAddress: deleteItem[0].mailAddress,
        teamId: deleteItem[0].teamId,
      }
      fromUserInfoList.push(addItem)
      this.setState({
        fromTableDataList: fromUserInfoList,
        toTableDataList: toUserInfoList,
      })
    }
  }

  async importCSV(e: any) {
    if (!(e.target instanceof HTMLInputElement)) {
      return
    }
    if (!e.target.files) {
      return
    }

    const file = this.parseCSV(await e.target.files[0].text())
    console.log(file)
    const fromUserInfoList: UserInfoItem[] = []
    // eslint-disable-next-line array-callback-return
    file.map((item) => {
      fromUserInfoList.push({
        isChecked: false,
        userId: Number(item[0]),
        userName: item[1],
        mailAddress: item[2],
        teamId: Number(item[3]),
      })
    })
    this.setState({
      fromTableDataList: fromUserInfoList,
    })
  }

  parseCSV(data: string): string[][] {
    return data.split('\r\n').map((row) => row.split(','))
  }

  render() {
    return (
      <>
        <input
          type="file"
          accept="text/csv"
          onChange={(e) => this.importCSV(e)}
        />
        <br />
        <br />
        <input
          type="checkbox"
          checked={this.state.isDisplayedFromTable}
          onChange={(e) => this.showTable(FROM_TABLE_ID, e)}
        />
        <div className={this.state.isDisplayedFromTable ? '' : 'hide'}>
          From UserInfoTable
          <UserInfoTable
            userInfoList={this.state.fromTableDataList}
            onChecked={(index, isChecked) => {
              this.moveItemFromFromListToToList(index, isChecked)
            }}
          />
        </div>
        <br />
        <input
          type="checkbox"
          checked={this.state.isDisplayedToTable}
          onChange={(e) => this.showTable(TO_TABLE_ID, e)}
        />
        <div className={this.state.isDisplayedToTable ? '' : 'hide'}>
          To UserInfoTable
          <UserInfoTable
            userInfoList={this.state.toTableDataList}
            onChecked={(index, isChecked) => {
              this.moveItemFromToListToFromList(index, isChecked)
            }}
          />
        </div>
        <br />
        CSV Text
        <p>
          1,User1,user1@xxx.xx,1
          <br />
          2,User2,user2@xxx.xx,2
          <br />
          3,User3,user3@xxx.xx,3
          <br />
          4,User4,user4@xxx.xx,4
          <br />
          5,User5,user5@xxx.xx,5
          <br />
          6,User6,user6@xxx.xx,6
          <br />
          7,User7,user7@xxx.xx,7
          <br />
          8,User8,user8@xxx.xx,8
          <br />
          9,User9,user9@xxx.xx,9
          <br />
          10,User10,user10@xxx.xx,10
        </p>
      </>
    )
  }
}

const App: React.FC = () => {
  return (
    <div className="main">
      <TableManager />
    </div>
  )
}

export default App
