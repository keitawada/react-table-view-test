import React from 'react'
import './UserInfoTable.css'
import CustomRoundLabelCheckbox from 'CustomRoundLabelCheckbox/CustomRoundLabelCheckbox'

type UserInfoItem = {
  isChecked: boolean
  userId: number
  userName: string
  mailAddress: string
  teamId: number
}

type UserInfoTableProps = {
  isDisplayed: boolean
  userInfoList: UserInfoItem[]
  onChecked: (index: number, isCkecked: boolean) => void
}

type UserInfoTableState = {
  isDisplayed: boolean
  userInfoList: UserInfoItem[]
}

/**
 * 表本体のコンポーネント
 * Table(A),Table(B)で再利用している。
 */
class UserInfoTable extends React.Component<
  UserInfoTableProps,
  UserInfoTableState
> {
  constructor(props: UserInfoTableProps) {
    super(props)

    this.state = {
      isDisplayed: props.isDisplayed,
      userInfoList: props.userInfoList,
    }
  }

  /**
   * CustomRoundLabelCheckboxでonChangeが発火した際に
   * @param index
   * @param isChecked
   */
  handleChecked = (index: number, isChecked: boolean) => {
    const userInfoItem = this.props.userInfoList[index]
    userInfoItem.isChecked = isChecked
    this.props.onChecked(index, isChecked)
    this.setState({ userInfoList: this.props.userInfoList })
  }

  /**
   * UserInfoTableコンポーネントが描画する仮想DOMを返す。
   * 表の1個分を描画する。
   * @returns 仮想DOM
   */
  render() {
    if (!this.props.isDisplayed) {
      return <></>
    }
    /**
     * 表の1行目以降(<tr>タグ)を描画する仮想DOMを格納する変数
     */
    const userInfoTableInnerJSX = this.props.userInfoList.map(
      (item: UserInfoItem, index: number) => {
        return (
          <tr
            key={item.userId.toString() + 'tableRow'}
            className={index % 2 === 1 ? 'odd-row' : ''}
          >
            <td key={item.userId.toString() + 'checkbox'}>
              <span className={item.userId < 0 ? 'hide' : ''}>
                <div className="" />
                {/* ./CustomRoundLabelCheckbox/CustomRoundLabelCheckbox.tsxの
                    CustomRoundLabelCheckboxコンポーネントを表示する。 */}
                <CustomRoundLabelCheckbox
                  key={item.userId}
                  idx={index}
                  checked={item.isChecked}
                  onCheckChanged={(isChecked) => {
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
      <div className="main">
        <div className="component-name">
          <b>UserInfoTableComponent</b>
        </div>
        <table>
          <tbody>
            {/* 表の一行目を描画 */}
            <tr>
              <th>✓</th>
              <th>ID</th>
              <th>Name</th>
              <th>E-mail</th>
              <th>Team</th>
            </tr>
            {/* 表の一行目以降を描画 */}
            {userInfoTableInnerJSX}
          </tbody>
        </table>
      </div>
    )
  }
}

export default UserInfoTable
