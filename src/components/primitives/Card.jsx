import styled from 'styled-components';

const CardWrapper = styled.div`
  padding: 10px;
  margin: 0px 10px 10px 0px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 5px;
  background: #e2e8ff;
`;

const Card = ({ heading, text }) => {
  return (
    <CardWrapper>
      <h2 style={{ marginTop: '0px' }}>{heading}</h2>
      <span>{text}</span>
    </CardWrapper>
  );
};

export default Card;
