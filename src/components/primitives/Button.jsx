import styled from 'styled-components';

const Button = styled.button`
  background: #293049;
  border-radius: 3px;
  border: none;
  color: white;
  padding: ${(props) => (props.small ? '5px' : '10px')};
  margin: ${(props) => (props.inline ? '10px' : '0px')};
`;

export default Button;
