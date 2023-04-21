import React, { KeyboardEventHandler } from 'react';

import CreatableSelect from 'react-select/creatable';
import IMultipleCreatableSelect from './IMultipleCreatableSelect';

const components = {
  DropdownIndicator: null,
};

const createOption = (label: string) => ({
  label,
  value: label,
});

const MultipleCreatableSelect: React.FC<IMultipleCreatableSelect> = ({value, setValue}) => {
  const [inputValue, setInputValue] = React.useState('');
  //const [value, setValue] = React.useState<readonly Option[]>([]);

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setValue((prev: any) => [...prev, createOption(inputValue)]);
        setInputValue('');
        event.preventDefault();
    }
  };

  return (
    <CreatableSelect
      components={components}
      inputValue={inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={(newValue) => setValue(newValue)}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder="Type something and press enter..."
      value={value}
    />
  );
};

export default MultipleCreatableSelect;