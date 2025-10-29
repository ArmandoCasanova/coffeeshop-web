import { useState } from 'react';

function CheckBox() {
  const [isChecked, setIsChecked] = useState(false);
  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <label>
        <input
          className="form-checkbox h-4 w-4 text-brown-600 border-gray-300 rounded focus:ring-brown-500"
          type="checkbox"
          checked={isChecked}
          onChange={handleOnChange}
        />
      </label>
    </div>
  );
}

export default CheckBox;