import styled from 'styled-components';

const NavWrapper = styled.div`
  padding: 20px;
  overflow: hidden;
  color: #f1f1f1;
  background-color: #293049;
  min-height: 60px;
  display: flex;
  align-items: center;
`;

const Nav = ({ title }) => (
  <NavWrapper>
    <p>{title}</p>
  </NavWrapper>
);

export default Nav;
