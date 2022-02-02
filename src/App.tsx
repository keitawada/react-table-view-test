import React from 'react'
import './App.css'
import UserInfoTable from 'UserInfoTable/UserInfoTable'
const FROM_TABLE_ID = 1
const TO_TABLE_ID = 2

type UserInfoItem = {
  isChecked: boolean
  userId: number
  userName: string
  mailAddress: string
  teamId: number
}

type TableManagerState = {
  isDisplayedTableA: boolean
  isDisplayedTableB: boolean
  dataListTableA: UserInfoItem[]
  dataListTableB: UserInfoItem[]
}

/**
 * 表形式で表示している部分全体を含むコンポーネント
 */
class TableManager extends React.Component<{}, TableManagerState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      isDisplayedTableA: true,
      isDisplayedTableB: true,
      dataListTableA: [],
      dataListTableB: [],
    }
  }

  /**
   * 表示/非表示のチェックボックスを変更した際に、
   * 該当する表の表示状態を切り替える。
   * @param targetTable チェックを変更した方の表ID
   * @param changeEvent チェックボックスのChangeEvent
   */
  displayTable(targetTable: number, changeEvent: any) {
    if (targetTable === FROM_TABLE_ID) {
      this.setState({
        isDisplayedTableA: changeEvent.target.checked,
      })
    } else {
      this.setState({
        isDisplayedTableB: changeEvent.target.checked,
      })
    }
  }

  /**
   * Table(A)でチェックした行をTable(B)へ移動する。
   * @param index チェックした行番号
   * @param isChecked チェックした行のチェック状態(Trueになる)
   */
  moveItemFromFromListToToList(index: number, isChecked: boolean): void {
    if (isChecked) {
      const userListTableA = this.state.dataListTableA
      const userListTableB = this.state.dataListTableB

      // Table(A)からチェックした行を削除
      const deleteItem = userListTableA.splice(index, 1)
      // 削除した行をTable(B)に追加
      const addItem = {
        isChecked: isChecked,
        userId: deleteItem[0].userId,
        userName: deleteItem[0].userName,
        mailAddress: deleteItem[0].mailAddress,
        teamId: deleteItem[0].teamId,
      }
      userListTableB.push(addItem)

      // TableManagerコンポーネントの状態を更新する。
      this.setState({
        dataListTableA: userListTableA,
        dataListTableB: userListTableB,
      })
    }
  }

  /**
   * Table(B)でチェックを外した行をTable(A)へ移動する。
   * @param index チェックを外した行番号
   * @param isChecked チェックを外した行のチェック状態(Falseになる)
   */
  moveItemFromToListToFromList(index: number, isChecked: boolean): void {
    if (!isChecked) {
      const userListTableA = this.state.dataListTableA
      const userListTableB = this.state.dataListTableB

      // Table(B)からチェックを外した行を削除
      const deleteItem = userListTableB.splice(index, 1)
      // 削除した行をTable(A)に追加
      const addItem = {
        isChecked: isChecked,
        userId: deleteItem[0].userId,
        userName: deleteItem[0].userName,
        mailAddress: deleteItem[0].mailAddress,
        teamId: deleteItem[0].teamId,
      }
      userListTableA.push(addItem)

      // TableManagerコンポーネントの状態を更新する。
      this.setState({
        dataListTableA: userListTableA,
        dataListTableB: userListTableB,
      })
    }
  }

  /**
   * ファイル選択ダイアログで選択したCSVファイルを読み込み、
   * データをFromTableへ登録する。
   * @param e ファイル選択ダイアログのファイル選択時Event
   * @returns void
   */
  async importCSV(e: any) {
    if (!(e.target instanceof HTMLInputElement)) {
      return
    }
    if (!e.target.files) {
      return
    }

    const file = this.parseCSV(await e.target.files[0].text())

    const userListTableA: UserInfoItem[] = []
    // eslint-disable-next-line array-callback-return
    file.map((item) => {
      userListTableA.push({
        isChecked: false,
        userId: Number(item[0]),
        userName: item[1],
        mailAddress: item[2],
        teamId: Number(item[3]),
      })
    })
    this.setState({
      dataListTableA: userListTableA,
    })
  }

  /**
   * CSVファイルのテキストデータから、
   * 各項目の値を取り出して配列に格納する。
   * @param data CSVファイルのテキストデータ
   * @returns
   */
  parseCSV(data: string): string[][] {
    return data.split('\r\n').map((row) => row.split(','))
  }

  /**
   * TableManagerコンポーネントが描画する仮想DOMを構築する。
   * @returns 仮想DOM
   */
  render() {
    return (
      <div className="main">
        <div className="component-name">
          <b>TableManagerComponent</b>
        </div>
        {/* ファイル選択ダイアログを開くボタン */}
        <input
          type="file"
          accept="text/csv"
          onChange={(e) => this.importCSV(e)}
        />
        <br />
        <br />
        {/* Table(A)の表示/非表示を切り替えるチェックボックス */}
        <input
          type="checkbox"
          checked={this.state.isDisplayedTableA}
          onChange={(e) => this.displayTable(FROM_TABLE_ID, e)}
        />
        UserInfoTable(A)
        <div className={this.state.isDisplayedTableA ? '' : 'hide'}>
          {/* ./UserInfoTable/UserInfoTable.tsxから、
              UserInfoTableコンポーネント(表本体)を読み込む。 */}
          <UserInfoTable
            isDisplayed={this.state.isDisplayedTableA}
            userInfoList={this.state.dataListTableA}
            onChecked={(index, isChecked) => {
              this.moveItemFromFromListToToList(index, isChecked)
            }}
          />
        </div>
        <br />
        {/* Table(B)の表示/非表示を切り替えるチェックボックス */}
        <input
          type="checkbox"
          checked={this.state.isDisplayedTableB}
          onChange={(e) => this.displayTable(TO_TABLE_ID, e)}
        />
        UserInfoTable(B)
        <div className={this.state.isDisplayedTableB ? '' : 'hide'}>
          {/* UserInfoTableコンポーネント(表本体) */}
          <UserInfoTable
            isDisplayed={this.state.isDisplayedTableB}
            userInfoList={this.state.dataListTableB}
            onChecked={(index, isChecked) => {
              this.moveItemFromToListToFromList(index, isChecked)
            }}
          />
        </div>
        <br />
        {/* 読み込むCSVファイルのサンプル値 */}
        <p>Appendix.</p>
        <p>CSV Text</p>
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
      </div>
    )
  }
}

/**
 * index.tsxから最初に読まれるMain関数的なコンポーネント
 * @returns void
 */
const App: React.FC = () => {
  return (
    <div className="main">
      <div className="component-name">
        <b>AppComponent</b>
      </div>
      {/* TableManagerコンポーネントを表示する。 */}
      <TableManager />
    </div>
  )
}

export default App
