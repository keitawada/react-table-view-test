import React from 'react'
import './CustomRoundLabelCheckbox.css'

/**
 * Properties of the CustomRoundLabelCheckbox.
 * @param idx Checkbox number.
 * @param checked Checked or not checked.
 * @param onCheckChange Event when the state of checkbox changes.
 */
type CustomRoundLabelCheckboxProps = {
  idx: number
  checked: boolean
  onCheckChange: (checked: boolean) => void
}

/**
 * Functional component of a round checkbox.
 */
const CustomRoundLabelCheckbox: React.FC<CustomRoundLabelCheckboxProps> = (
  props: CustomRoundLabelCheckboxProps,
) => {
  // Event handler when the checkbox is clicked.
  const handleClick = () => {
    console.log('click ' + props.idx + '    checed: ' + !props.checked)
    props.onCheckChange(!props.checked)
  }

  return (
    <>
      <div className="round-checkbox">
        <label
          className={props.checked ? 'checked' : ''}
          onClick={() => handleClick()}
        ></label>
      </div>
    </>
  )
}

export default CustomRoundLabelCheckbox
