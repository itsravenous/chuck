import React from 'react';

export const SearchForm = ({ onSubmit }) => {
  const [name, setName] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);

  const handleNameChange = name => {
    setName(name);
    setIsValid(name.length > 0 && name.split(' ').length < 3);
  };
  const handleSubmit = name => {
    const [firstName, lastName] = name.split(' ');
    onSubmit({ firstName, lastName });
  };

  return (
    <form
      className="chuck-search"
      onSubmit={e => {
        e.preventDefault();
        handleSubmit(name);
      }}
    >
      <label htmlFor="name">Enter an inferior name</label>
      <input
        id="name"
        type="text"
        onChange={e => handleNameChange(e.target.value)}
        value={name}
      />
      <button disabled={!isValid} type="submit">
        Submit
      </button>
    </form>
  );
};
